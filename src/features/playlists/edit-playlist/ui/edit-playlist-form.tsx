import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { client } from "../../../../shared/api/client"
import { playlistsKeys } from "../../../../shared/api/keys-factories/playlists-keys-factories"
import type { SchemaUpdatePlaylistRequestPayload } from "../../../../shared/api/schema"
import { useUpdatePlaylistMutation } from "../api/use-update-playlist-mutation"

type Props = {
    playlistId: string | null;
}

export const EditPlaylistForm = ({ playlistId }: Props) => {
  const { register, handleSubmit, reset } =
    useForm<SchemaUpdatePlaylistRequestPayload>()

  const playlistQuery = useQuery({
    queryKey: playlistsKeys.detail(playlistId),
    queryFn: async () => {
      const response = await client.GET("/playlists/{playlistId}", {
        params: { path: { playlistId: playlistId! } },
      })
      return response.data!
    },
    enabled: Boolean(playlistId),
  })

  const updatePlaylist = useUpdatePlaylistMutation()

  useEffect(() => {
    const playlist = playlistQuery.data?.data
    if (!playlist) return

    reset({
      data: {
        type: "playlists",
        attributes: {
          title: playlist.attributes.title,
          description: playlist.attributes.description,
          tagIds: playlist.attributes.tags.map((tag) => tag.id),
        },
      },
    })
  }, [playlistQuery.data, reset])

  const onSubmit = (payload: SchemaUpdatePlaylistRequestPayload) => {
    if (!playlistId) return
    updatePlaylist.mutate({ playlistId, payload })
  }

  if (!playlistId) return null
  if (playlistQuery.isPending) return <p>Loading...</p>
  if (playlistQuery.isError || !playlistQuery.data) return <p>Error...</p>

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Edit Playlist</h2>
      <p>
        <input {...register("data.attributes.title", { required: true })} />
      </p>
      <p>
        <textarea {...register("data.attributes.description")} />
      </p>
      {updatePlaylist.isError && <p>Could not save the playlist.</p>}
      <button type="submit" disabled={updatePlaylist.isPending}>
        {updatePlaylist.isPending ? "Saving..." : "Save"}
      </button>
    </form>
  )
}
