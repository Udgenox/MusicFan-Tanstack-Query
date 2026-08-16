import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useEffect} from "react";
import {useForm} from "react-hook-form";
import {client} from "../../../../shared/api/client";
import type {
    SchemaUpdatePlaylistRequestPayload
} from "../../../../shared/api/schema";

type Props = {
    playlistId: string | null;
}

export const EditPlaylistForm = ({playlistId}: Props) => {
    const {
        register,
        handleSubmit,
        reset
    } = useForm<SchemaUpdatePlaylistRequestPayload>()

    useEffect(() => {
        reset()
    }, [playlistId])

    const {data, isError, isFetching} = useQuery({
        queryKey: ["playlistId", playlistId],
        queryFn: async () => {
            const response = await client.GET('/playlists/{playlistId}', {params: {path: {playlistId: playlistId!}}});
            return response.data!;
        },
        enabled: !!playlistId,
    })

    const queryClient = useQueryClient()

    const {mutate} = useMutation({
        mutationFn: async (data:SchemaUpdatePlaylistRequestPayload) => {
            const response = await  client.PUT('/playlists/{playlistId}', {
                params: {path: {playlistId: playlistId!}},
                body: {
                    data: {
                        type: "playlists",
                        attributes: {
                            ...data.data.attributes,
                            tagIds: [],
                        },
                    },
                }
            })
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["playlists"],
                refetchType: 'active',
            })
        }
    })

    const onSubmit = (data: SchemaUpdatePlaylistRequestPayload) => {
        mutate(data)
    }

    if (!playlistId) return <></>
    if (isFetching) return <p>Loading...</p>
    if (isError || !data) return <p>Error...</p>

    return <form onSubmit={handleSubmit(onSubmit)}>
        <h2>Edit Playlist</h2>
        <p>
            <input  {...register("data.attributes.title")} defaultValue={data.data.attributes.title} />
        </p>
        <p>
            <textarea {...register('data.attributes.description')} defaultValue={data.data.attributes.description ?? ""}></textarea>
        </p>
        <button type='submit'>Save</button>
    </form>
}