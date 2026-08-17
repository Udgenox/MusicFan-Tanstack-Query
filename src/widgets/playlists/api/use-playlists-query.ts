import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { client } from "../../../shared/api/client"
import { playlistsKeys } from "../../../shared/api/keys-factories/playlists-keys-factories"

type Filters = {
    pageNumber: number
    search: string
}

export const usePlaylistsQuery = (
    userId: string | undefined,
    { pageNumber, search }: Filters,
) => {
    const queryParams = {
        userId,
        pageNumber,
        search,
    }

    return useQuery({
        queryKey: playlistsKeys.list(queryParams),

        queryFn: async ({ signal }) => {
            const response = await client.GET("/playlists", {
                params: { query: queryParams },
                signal,
            })

            return response.data
        },

        placeholderData: keepPreviousData,
        staleTime: 30_000,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    })
}
