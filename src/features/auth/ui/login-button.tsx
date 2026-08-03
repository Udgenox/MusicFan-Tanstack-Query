import { useMutation } from "@tanstack/react-query"
import {client} from "../../../shared/api/client";


export const LoginButton = () => {
    const callbackUrl = 'http://localhost:5173/oauth/callback';

    const mutation = useMutation({
        mutationFn: async ({ code }: { code: string }) => {
            const response = await client.POST("/auth/login", {
                body: {
                    code: code,
                    redirectUri: callbackUrl,
                    rememberMe: true,
                    accessTokenTTL: "1d",
                },
            })

            if (response.error) {
                throw new Error(response.error.message)
            }

            return response.data
        },
        onSuccess: (data: { refreshToken: string; accessToken: string }) => {
            localStorage.setItem("musicfun-refresh-token", data.refreshToken)
            localStorage.setItem("musicfun-access-token", data.accessToken)
        },
    })

    const handleLoginClick = () => {
        const handleOAuthMessage = (event: MessageEvent) => {
            // Удаляем слушатель после обработки
            window.removeEventListener('message', handleOAuthMessage);

            if (event.origin !== window.location.origin) {
                console.warn('origin not match');
                return;
            }

            const code = event.data?.code;
            if (!code) {
                console.warn('no code in message');
                return;
            }

            mutation.mutate({ code });
        };

        window.addEventListener('message', handleOAuthMessage);

        window.open(
            `https://musicfun.it-incubator.app/api/1.0/auth/oauth-redirect?callbackUrl=${callbackUrl}`,
            'apihub-oauth2',
            'width=500, height=600'
        );
    };

    return (
        <button onClick={handleLoginClick} type="button">
            🔑 Login with GITHUB
        </button>
    );
};