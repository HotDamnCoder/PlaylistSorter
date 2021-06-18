import { PlaylistInfo } from './PlaylistInfo'
import { VideoInfo } from './VideoInfo'
export interface IPlaylistAPI {
    loginToAPI() : Promise<boolean>;
    getPlaylistInfo(playlistId: string) : Promise<PlaylistInfo>
    getPlaylistItems(playlistID: string) : Promise<Array<VideoInfo>>
    playlistExists(playlistName: string) : Promise<boolean>
    createPlaylist(playlistName: string) : Promise<boolean>
    addItemsToPlaylist(playlistName: string, items: Array<string>) : Promise<boolean>
}
