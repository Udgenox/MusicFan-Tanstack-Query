import createClient, {type Middleware, type MiddlewareCallbackParams} from "openapi-fetch"
import type { paths } from "./schema"

export const baseUrl = "https://musicfun.it-incubator.app/api/1.0/";
export const apiKey = "11532260-b6d2-4b22-913e-589abf305d60";

let refreshPromise: Promise<void> | null = null;

function makeRefreshToken() {
    if (!refreshPromise) {
        refreshPromise = (async (): Promise<void> => {
            const refreshToken = localStorage.getItem("musicfun-refresh-token");
            if (!refreshToken) throw new Error("No refresh token");

            const response = await fetch(`${baseUrl}auth/refresh`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "API-KEY": apiKey,
                },
                body: JSON.stringify({ refreshToken }),
            });

            if (!response.ok) {
                throw new Error(`Refresh token failed: ${response.status}`);
            }

            const data = await response.json();
            localStorage.setItem("musicfun-access-token", data.accessToken);
            if (data.refreshToken) {
                localStorage.setItem("musicfun-refresh-token", data.refreshToken);
            }
        })();

        refreshPromise.finally(() => {
            refreshPromise = null;
        });
    }

    return refreshPromise;
}

const authMiddleware: Middleware = {
    onRequest({ request }: MiddlewareCallbackParams) {
        const accessToken = localStorage.getItem("musicfun-access-token");
        if (accessToken) {
            request.headers.set("Authorization", `Bearer ${accessToken}`);
        }

        // @ts-expect-error - сохраняем оригинальный запрос для повторной попытки
        request._retryRequest = request.clone();

        return request;
    },

    async onResponse({ request, response }) {
        if (response.ok) return response;

        // Если не 401 — выбрасываем ошибку
        if (response.status !== 401) {
            throw new Error(`${response.url}: ${response.status} ${response.statusText}`);
        }

        // 401 — пробуем обновить токен
        try {
            await makeRefreshToken();

            // @ts-expect-error - восстанавливаем оригинальный запрос
            const originalRequest: Request = request._retryRequest;
            const retryRequest = new Request(originalRequest, {
                headers: new Headers(originalRequest.headers),
            });

            const newAccessToken = localStorage.getItem("musicfun-access-token");
            if (newAccessToken) {
                retryRequest.headers.set("Authorization", `Bearer ${newAccessToken}`);
            }

            return fetch(retryRequest);
        } catch (error) {
            console.error("Refresh token failed:", error);
            // Можно выкинуть пользователя на логин
            // window.location.href = '/login';
            return response;
        }
    },
};

// 👇 Создаем клиент
export const client = createClient<paths>({
    baseUrl,
    headers: {
        "api-key": apiKey,
    },
});

// 👇 Применяем middleware
client.use(authMiddleware);