import { useQuery } from "@tanstack/react-query"
import { client } from "../../../shared/api/client.ts"
import {authKeys} from "../../../shared/api/keys-factories/auth-keys-factories";

export const useMeQuery = () => {
    const query = useQuery({
        queryKey: authKeys.me(),
        queryFn: async () => {
            const clientResponse = await client.GET("/auth/me")
            return clientResponse.data
        },
        retry: false,
    })

    return query
}