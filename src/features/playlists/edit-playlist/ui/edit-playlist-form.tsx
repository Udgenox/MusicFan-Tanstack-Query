import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useEffect} from "react";
import {useForm} from "react-hook-form";
import {client} from "../../../../shared/api/client";
import type {
     SchemaGetPlaylistsOutput,
    SchemaUpdatePlaylistRequestPayload
} from "../../../../shared/api/schema";
import {useMeQuery} from "../../../auth/api/use-me-query";

type Props = {
    playlistId: string | null;
}

export const EditPlaylistForm = ({playlistId}: Props) => {
    const {
        register,
        handleSubmit,
        reset
    } = useForm<SchemaUpdatePlaylistRequestPayload>()

    const {data: meData} = useMeQuery ()

    useEffect(() => {
        reset()
    }, [playlistId])

    const {data, isError, isFetching} = useQuery({
        queryKey: ["playlistId", 'details', playlistId],
        queryFn: async () => {
            const response = await client.GET('/playlists/{playlistId}', {params: {path: {playlistId: playlistId!}}});
            return response.data!;
        },
        enabled: !!playlistId,
    })

    const queryClient = useQueryClient()

    const key = ["playlists", "my", meData?.userId] as const

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
        onMutate: async (formData) => {
            await queryClient.cancelQueries({ queryKey: ["playlists"] })

            const previousMyPlaylists =
                queryClient.getQueryData<SchemaGetPlaylistsOutput>(key)

            queryClient.setQueryData<SchemaGetPlaylistsOutput>(
                key,
                (oldData) => {
                    if (!oldData) return oldData

                    return {
                        ...oldData,
                        data: oldData.data.map((playlist) =>
                            playlist.id === playlistId
                                ? {
                                    ...playlist,
                                    attributes: {
                                        ...playlist.attributes,
                                        title: formData.data.attributes.title,
                                        description: formData.data.attributes.description,
                                    },
                                }
                                : playlist,
                        ),
                    }
                },
            )

            return { previousMyPlaylists }
        },
        onError: (_error, _variables, context) => {
            if (context?.previousMyPlaylists) {
                queryClient.setQueryData(key, context.previousMyPlaylists)
            }
        },
        onSettled: () =>
            queryClient.invalidateQueries({
                queryKey: ["playlists"],
                refetchType: 'all',
            })
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