import { VideoInfo } from './VideoInfo'
export interface IPlaylistAPI {
    loginToAPI() : Promise<boolean>;
    getPlaylistInfo(id: string) : Promise<VideoInfo>
    getPlaylistItems(id: string) : Promise<Array<VideoInfo>>
}
