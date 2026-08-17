import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {type ChangeEvent, useState} from "react";
import {DeletePlaylist} from "../../../features/playlists/delete-playlist/ui/delete-playlist";
import {client} from "../../../shared/api/client";
import {Pagination} from "../../../shared/ui/pagination/pagination";

type Props = {
    userId?: string
    onPlaylistSelected?: (playlistId: string) => void
    isSearchActive?: boolean
}

export const Playlists = ({userId, onPlaylistSelected, isSearchActive} : Props) => {
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState("")

    const key = userId ? ["playlists", 'my', userId] : ["playlists", {page, search}]
    const queryParams = userId ? {
        userId
    } : {
        pageNumber: page,
        search
    }

    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    const query = useQuery({
        queryKey: key,
        queryFn: async ({signal}) => {
            const response = await client.GET("/playlists", {
                params: {
                    query: queryParams,
                },
                signal,
            })
            if (response.error) {
                throw (response as unknown as { error: Error }).error
            }
            return response.data
        },
        placeholderData: keepPreviousData,
        // ✅ Добавляем настройки для обновления
        staleTime: 30_000, // Данные сразу устаревают
        refetchOnMount: false, // Всегда перезапрашивать при монтировании
        refetchOnWindowFocus: false, // Обновлять при возврате на вкладку
    })

    console.log("status:" + query.status)
    console.log("fetchStatus:" + query.fetchStatus)

    const handleSelectPlaylistClick = (playlistId: string) => {
        onPlaylistSelected?.(playlistId);
    }

    if (query.isPending) return <span>Loading...</span>
    if (query.isError) return <span>{JSON.stringify(query.error.message)}</span>

    return (
        <div>
            {isSearchActive && <div>
                <input
                    value={search}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.currentTarget.value)}
                    placeholder={"search..."}
                />
            </div>
            }
            <hr />
            <Pagination
                pagesCount={query.data.meta.pagesCount}
                current={query.data.meta.page}
                changePageNumber={setPage}
                isFetching={query.isFetching}
            />
            <ul>
                {query.data.data.map((playlist) => (
                    <li key={playlist.id} onClick={() => handleSelectPlaylistClick(playlist.id)}>
                        {playlist.attributes.title} <DeletePlaylist playlistId={playlist.id} />
                    </li>
                ))}
            </ul>
        </div>
    )
}