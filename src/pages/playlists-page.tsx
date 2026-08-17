import {Playlists} from "../widgets/playlists/ui/playlists";

export function PlaylistsPage() {

  return (
      <div>
          <h2>hello it-incubator!!!</h2>
          <Playlists isSearchActive={true}/>
      </div>
  )
}

// export const Playlists = () => {„„
//     const query = useQuery({
//         staleTime: Infinity,
//         refetchOnMount: false,
//         refetchOnWindowFocus: false,
//         refetchOnReconnect: false,
//         // gcTime: 5 * 1000,
//         queryKey: ["playlists"],
//         queryFn: () =>
//             client.GET("/playlists")
//         ,
//     })
//     return (
//         <div>
//             <ul>
//                 {query.data?.data?.data.map((playlist) => (
//                     <li>{playlist.attributes.title}</li>
//                 ))}
//             </ul>
//         </div>
//     )
// }


