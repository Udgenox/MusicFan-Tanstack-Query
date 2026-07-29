import {useQuery} from "@tanstack/react-query";
import {useEffect, useState} from "react";
import {client} from "../shared/api/client";

function PlaylistsPage() {
    const [isVisible, setIsVisible] = useState(true)
    useEffect(() => {
        setInterval(() => {
            setIsVisible((prev) => !prev)
        }, 30000000)
    }, [])


  return (
      <>
          <h2>hello it-incubator!!!</h2>
          {isVisible && <Playlists />}
      </>
  )
}

const Playlists = () => {
    const query = useQuery({
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        // gcTime: 5 * 1000,
        queryKey: ["playlists"],
        queryFn: () =>
            client.GET("/playlists")
        ,
    })
    return (
        <div>
            <ul>
                {query.data?.data?.data.map((playlist) => (
                    <li>{playlist.attributes.title}</li>
                ))}
            </ul>
        </div>
    )
}

export default PlaylistsPage
