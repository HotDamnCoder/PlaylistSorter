import { Playlist } from './Playlist'
import { Video } from './Video'
export interface IPlaylistAPI {
  loginToAPI(): Promise<boolean>;
  getPlaylist(playlistId: string): Promise<Playlist>;
  getPlaylistVideos(playlistID: string): Promise<Array<Video>>;
  getPlaylistIdFromName(playistName: string): Promise<string>;
  createPlaylist(playlistName: string): Promise<string>;
  addItemsToPlaylist(playlistId: string, items: Array<string>): Promise<void>;
}
