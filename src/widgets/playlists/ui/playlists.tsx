import {type ChangeEvent, useState} from "react";
import {DeletePlaylist} from "../../../features/playlists/delete-playlist/ui/delete-playlist";
import {Pagination} from "../../../shared/ui/pagination/pagination";
import {usePlaylistsQuery} from "../api/use-playlists-query";

type Props = {
    userId?: string
    onPlaylistSelected?: (playlistId: string) => void
    isSearchActive?: boolean
}

export const Playlists = ({userId, onPlaylistSelected, isSearchActive}: Props) => {
    const [pageNumber, setPageNumber] = useState(1)
    const [search, setSearch] = useState("")


    const query = usePlaylistsQuery(userId, {
        pageNumber,
        search: isSearchActive ? search : "",
    })

    console.log("status:" + query.status)
    console.log("fetchStatus:" + query.fetchStatus)

    const handleSelectPlaylistClick = (playlistId: string) => {
        onPlaylistSelected?.(playlistId);
    }

    if (query.isPending) return <span>Loading...</span>
    if (query.isError || !query.data) {
        return <span>Error loading playlists</span>
    }

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
            <hr/>
            <Pagination
                pagesCount={query.data.meta.pagesCount}
                current={query.data.meta.page}
                changePageNumber={setPageNumber}
                isFetching={query.isFetching}
            />

            <ul>
                {query.data.data.map((playlist) => (
                    <li
                        key={playlist.id}
                        onClick={() => handleSelectPlaylistClick(playlist.id)}
                    >
                        {playlist.attributes.title}
                        <DeletePlaylist playlistId={playlist.id} />
                    </li>
                ))}
            </ul>
        </div>
    )
}