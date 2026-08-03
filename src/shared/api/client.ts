import createClient, {type Middleware, type MiddlewareCallbackParams} from "openapi-fetch"
import type { paths } from "./schema"

const authMiddleware: Middleware = {
    async onRequest({ request }: MiddlewareCallbackParams) {
        const accessToken = localStorage.getItem('musicfun-access-token');
        if (accessToken) {
            request.headers.set("Authorization", "Bearer " + accessToken);
        }

        return request;
    },
    onResponse({ response }) {
        if (!response.ok) {
            throw new Error(`${response.url}: ${response.status} ${response.statusText}`)
        }
    }
};

export const client = createClient<paths>({
    baseUrl: "https://musicfun.it-incubator.app/api/1.0",
    headers: {
        "api-key": "11532260-b6d2-4b22-913e-589abf305d60",
    },
})

client.use(authMiddleware);