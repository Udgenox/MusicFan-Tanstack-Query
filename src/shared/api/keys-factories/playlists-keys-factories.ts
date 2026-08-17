import type { SchemaGetPlaylistsRequestPayload } from "../schema.ts"

export const playlistsKeys = {
    all: ["playlists"] as const,
    lists: () => playlistsKeys.all,
    list: (filters: Partial<SchemaGetPlaylistsRequestPayload>) =>
        [...playlistsKeys.all, filters] as const,
    details: () => [...playlistsKeys.all, "details"] as const,
    detail: (id: string) => [...playlistsKeys.details(), id] as const,
}
