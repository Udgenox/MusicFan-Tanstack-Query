import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {useState} from "react";
import {client} from "../shared/api/client";
import {Pagination} from "../shared/ui/pagination/pagination";

export const Playlists = () => {
    const [page, setPage] = useState(1)

    const query = useQuery({
        queryKey: ["playlists", page],
        queryFn: async () => {
            const response = await client.GET("/playlists", {
                params: {
                    query: {
                        pageNumber: page,
                    },
                },
            })
            if (response.error) {
                throw (response as unknown as { error: Error }).error
            }
            return response.data
        },
        placeholderData: keepPreviousData,
    })

    console.log("status:" + query.status)
    console.log("fetchStatus:" + query.fetchStatus)

    if (query.isPending) return <span>Loading...</span>
    if (query.isError) return <span>{JSON.stringify(query.error.message)}</span>

    return (
        <div>
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