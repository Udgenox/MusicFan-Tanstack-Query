import {useForm} from "react-hook-form";
import type {SchemaCreatePlaylistRequestPayload} from "../../../../shared/api/schema";
import {useAddPlaylistMutation} from "../api/use-add-playlist-mutation";

export const AddPlaylistForm = () => {
    const { register, handleSubmit } = useForm<SchemaCreatePlaylistRequestPayload>({
        defaultValues: {
            data: {
                type: "playlists", // или "artist"
                attributes: {
                    title: "",
                    description: "",
                },
            },
        },
    });


    const {mutate} = useAddPlaylistMutation()

    const onSubmit = (data: SchemaCreatePlaylistRequestPayload) => {
        mutate(data)
    }

    return <form onSubmit={handleSubmit(onSubmit)}>
        <h2>Add New Playlist</h2>
        <p>
            <input  {...register("data.attributes.title", { required: "Title is required" })}/>
        </p>
        <p>
            <textarea {...register('data.attributes.description')}></textarea>
        </p>
        <button type='submit'>Create</button>
    </form>
}


// import {useForm} from "react-hook-form";
// import type {SchemaCreatePlaylistRequestPayload} from "../../../../shared/api/schema";
// import {useAddPlaylistMutation} from "../api/use-add-playlist-mutation";
//
// export const AddPlaylistForm = () => {
//     const {
//         register,
//         handleSubmit,
//         reset,
//         setError,
//         formState: { errors },
//     } = useForm<SchemaCreatePlaylistRequestPayload>()
//
//     const { mutateAsync } = useAddPlaylistMutation()
//
//     const onSubmit = async (data: SchemaCreatePlaylistRequestPayload) => {
//         try {
//             await mutateAsync(data)
//             reset()
//         } catch (error) {
//             queryErrorHandlerForRHFFactory({ setError })(error as unknown as JsonApiErrorDocument)
//         }
//     }
//
//     return (
//         <form onSubmit={handleSubmit(onSubmit)}>
//             <h2>Add New Playlist</h2>
//             <p>
//                 <input {...register("title")} />
//             </p>
//             {errors.title && <p>{errors.title.message}</p>}
//             <p>
//                 <textarea {...register("description")}></textarea>
//             </p>
//             {errors.description && <p>{errors.description.message}</p>}
//
//             <button type={"submit"}>Create</button>
//             {errors.root?.server && <p>{errors.root?.server.message}</p>}
//         </form>
//     )
// }