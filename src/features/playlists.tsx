import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {type ChangeEvent, useState} from "react";
import {client} from "../shared/api/client";
import {Pagination} from "../shared/ui/pagination/pagination";

type Props = {
    userId?: string
}

export const Playlists = ({userId} : Props) => {
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState("")

    const query = useQuery({
        queryKey: ["playlists", {page, search}],
        queryFn: async ({signal}) => {
            const response = await client.GET("/playlists", {
                params: {
                    query: {
                        pageNumber: page,
                        search,
                        userId,
                    },
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
        staleTime: 0, // Данные сразу устаревают
        refetchOnMount: 'always', // Всегда перезапрашивать при монтировании
        refetchOnWindowFocus: true, // Обновлять при возврате на вкладку
    })

    console.log("status:" + query.status)
    console.log("fetchStatus:" + query.fetchStatus)

    if (query.isPending) return <span>Loading...</span>
    if (query.isError) return <span>{JSON.stringify(query.error.message)}</span>

    return (
        <div>
            <div>
                <input
                    value={search}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.currentTarget.value)}
                    placeholder={"search..."}
                />
            </div>
            <hr />
            <Pagination
                pagesCount={query.data.meta.pagesCount}
                current={query.data.meta.page}
                changePageNumber={setPage}
                isFetching={query.isFetching}
            />
            <ul>
                {query.data.data?.map((playlist) => (
                    <li>{playlist.attributes.title}</li>
                ))}
            </ul>
        </div>
    )
}