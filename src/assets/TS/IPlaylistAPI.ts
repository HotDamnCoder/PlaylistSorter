/* eslint-disable @typescript-eslint/no-explicit-any */
import { Playlist } from './Playlist'
import { Video } from './Video'
export interface IPlaylistAPI {
    loginToAPI() : Promise<boolean>;
    getPlaylist(playlistId: string) : Promise<Playlist>
    getPlaylistVideos(playlistID: string) : Promise<Array<Video>>
    checkIfPlaylistExists(playlistName: string) : Promise<boolean>
    createPlaylist(playlistName: string) : Promise<any>
    addItemsToPlaylist(playlistName: string, items: Array<string>) : Promise<any>
}
