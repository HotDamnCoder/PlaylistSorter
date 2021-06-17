import { PlaylistInfo } from './PlaylistInfo'
import { VideoInfo } from './VideoInfo'
export interface IPlaylistAPI {
    loginToAPI() : Promise<boolean>;
    getPlaylistInfo(id: string) : Promise<PlaylistInfo>
    getPlaylistItems(id: string) : Promise<Array<VideoInfo>>
    createPlaylist(name: string, videos: Array<string>) : Promise<boolean>
    playlistExists(name: string) : Promise<boolean>
}
