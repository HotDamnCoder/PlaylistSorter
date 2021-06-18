/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { IPlaylistAPI } from './IPlaylistAPI'
import { VueGapi } from 'vue-gapi'
import { Video } from './Video'
import Store from 'electron-store'
import { Playlist } from './Playlist'
import { VideoTags } from './Tags'
const store = new Store()

export class YoutubeAPI implements IPlaylistAPI {
  private vueGAPI: VueGapi
  private api: any

  constructor (vueGapi: VueGapi) {
    this.vueGAPI = vueGapi
    this.vueGAPI.getGapiClient().then((gapiClient) => {
      this.api = gapiClient.client.youtube
    })
  }

  private listPlaylistInfo (playlistId: string) {
    return this.api.playlists.list({
      part: ['snippet'],
      id: [playlistId]
    }).then((response: any) => {
      return response.result.items[0]
    })
  }

  private listPlaylistItems = (playlistId: string, playlistItems = [], nextPageToken = '') => {
    return this.api.playlistItems.list({
      part: ['snippet'],
      playlistId: [playlistId],
      pageToken: nextPageToken,
      maxResults: 50
    }).then((response: any) => {
      nextPageToken = response.result.nextPageToken
      const items = response.result.items
      playlistItems = playlistItems.concat(items)
      if (nextPageToken !== undefined && nextPageToken !== '') {
        return this.listPlaylistItems(playlistId, playlistItems, nextPageToken)
      } else {
        return playlistItems
      }
    })
  }

  private getThumbnailUrls (thumbnails: any) {
    const thumbnailUrls: { [index:string]: string } = {}
    for (const thumbnailKey in thumbnails) {
      const thumbnail = thumbnails[thumbnailKey]
      thumbnailUrls[thumbnailKey] = thumbnail.url
    }
    return thumbnailUrls
  }

  private getPlaylistIdFromName (playlistName: string): Promise<string> {
    return this.api.search.list({
      part: ['snippet'],
      q: playlistName,
      forMine: true,
      type: ['playlist'],
      maxResults: 25
    }).then((response: any) => {
      const searchResults = response.result.items
      if (searchResults.length >= 1) {
        const playlistData = searchResults[0].snippet
        return playlistData.id
      } else {
        return ''
      }
    })
  }

  public loginToAPI (): Promise<boolean> {
    return this.vueGAPI.login().then((loginResponse) => {
      return loginResponse.hasGrantedScopes
    })
  }

  public getPlaylist (playlistId: string): Promise<Playlist> {
    return this.listPlaylistInfo(playlistId).then((playlistInfo: any) => {
      playlistInfo = playlistInfo.snippet
      const playlistThumbnails = this.getThumbnailUrls(playlistInfo.thumbnails)
      const playlistName = playlistInfo.title
      return new Playlist(playlistId, playlistName, playlistThumbnails)
    })
  }

  public getPlaylistVideos (playlistId: string): Promise<Array<Video>> {
    return this.listPlaylistItems(playlistId).then((items: any) => {
      const videos = []
      for (const itemIndex in items) {
        const videoData = items[itemIndex].snippet
        const videoThumbnails = this.getThumbnailUrls(videoData.thumbnails)
        const videoName = videoData.title
        const videoId = videoData.resourceId.videoId
        const videoTags = store.get(videoId, []) as VideoTags
        videos.push(new Video(videoId, videoName, videoThumbnails, videoTags, ''))
      }
      return videos
    })
  }

  public checkIfPlaylistExists (playlistName: string): Promise<boolean> {
    return this.getPlaylistIdFromName(playlistName).then((playlistId: string) => {
      return playlistId !== ''
    })
  }

  public createPlaylist (playlistName: string): Promise<any> {
    return this.api.playlists.insert({
      resource: {
        snippet: {
          title: playlistName
        },
        status: {
          privacyStatus: 'private'
        }
      }
    })
  }

  public addItemsToPlaylist = (playlistName: string, items: Array<string>, itemIndex = 0) : Promise<any> => {
    return this.api.playlists.insert({
      part: ['snippet'],
      resource: {
        snippet: {
          playlistId: this.getPlaylistIdFromName(playlistName),
          resourceId: {
            kind: 'youtube#video',
            videoId: items[itemIndex]
          }
        }
      }
    }).then((_response: any) => {
      if (itemIndex <= items.length - 1) {
        return this.addItemsToPlaylist(playlistName, items, itemIndex++)
      }
    })
  }
}
