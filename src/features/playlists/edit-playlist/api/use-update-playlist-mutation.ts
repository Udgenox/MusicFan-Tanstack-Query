import { useMutation, useQueryClient } from "@tanstack/react-query"
import { client } from "../../../../shared/api/client"
import { playlistsKeys } from "../../../../shared/api/keys-factories/playlists-keys-factories"
import type {
  SchemaGetPlaylistsOutput,
  SchemaUpdatePlaylistRequestPayload,
} from "../../../../shared/api/schema"

type UpdatePlaylistVariables = {
  playlistId: string
  payload: SchemaUpdatePlaylistRequestPayload
}

export const useUpdatePlaylistMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ playlistId, payload }: UpdatePlaylistVariables) => {
      await client.PUT("/playlists/{playlistId}", {
        params: { path: { playlistId } },
        body: payload,
      })
    },

    onMutate: async ({ playlistId, payload }) => {
      await queryClient.cancelQueries({ queryKey: playlistsKeys.lists() })

      const previousPlaylists =
        queryClient.getQueriesData<SchemaGetPlaylistsOutput>({
          queryKey: playlistsKeys.lists(),
        })

      queryClient.setQueriesData<SchemaGetPlaylistsOutput>(
        { queryKey: playlistsKeys.lists() },
        (oldData) => {
          if (!oldData || !Array.isArray(oldData.data)) return oldData

          return {
            ...oldData,
            data: oldData.data.map((playlist) =>
              playlist.id === playlistId
                ? {
                    ...playlist,
                    attributes: {
                      ...playlist.attributes,
                      title: payload.data.attributes.title,
                      description: payload.data.attributes.description,
                    },
                  }
                : playlist,
            ),
          }
        },
      )

      return { previousPlaylists }
    },

    onError: (_error, _variables, context) => {
      context?.previousPlaylists.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data)
      })
    },

    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: playlistsKeys.lists() }),
  })
}
