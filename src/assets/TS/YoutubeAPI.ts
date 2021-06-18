/* eslint-disable @typescript-eslint/no-explicit-any */
import { IPlaylistAPI } from './IPlaylistAPI'
import { VueGapi } from 'vue-gapi'
import { VideoInfo } from './VideoInfo'
import Store from 'electron-store'
import { PlaylistInfo } from './PlaylistInfo'
import { VideoTags } from './Tags'
const store = new Store()

export class YoutubeAPI implements IPlaylistAPI {
    private VUE_GAPI: VueGapi

    constructor (vueGapi: VueGapi) {
      this.VUE_GAPI = vueGapi
    }

    private getGoogleAPI () {
      return this.VUE_GAPI.getGapiClient()
    }

    public loginToAPI (): Promise<boolean> {
      return this.VUE_GAPI.login().then((loginResponse) => {
        return loginResponse.hasGrantedScopes
      })
    }

    private listYoutubePlaylists (googleAPI: any, playlistID: string) {
      return googleAPI.client.youtube.playlists.list({
        part: ['snippet'],
        id: [playlistID]
      })
    }

    public getPlaylistInfo (playlistID: string): Promise<PlaylistInfo> {
      return this.getGoogleAPI().then((googleAPI) => {
        return this.listYoutubePlaylists(googleAPI, playlistID).then((response: any) => {
          const playlistData = response.result.items[0]
          const playlistThumbnails: {[index: string]: string} = {}
          for (const thumbnail in playlistData.snippet.thumbnails) {
            playlistThumbnails[thumbnail] = playlistData.snippet.thumbnails[thumbnail].url
          }
          const playlistId = playlistData.id
          const playlistName = playlistData.snippet.title
          return { id: playlistId, name: playlistName, thumbnails: playlistThumbnails }
        })
      })
    }

    private listYoutubePlaylistVideos = (googleAPI: any, playlistID: string, playlistVideos = [], nextPageToken = '') => {
      return googleAPI.client.youtube.playlistItems.list({
        part: ['snippet'],
        playlistId: [playlistID],
        pageToken: nextPageToken,
        maxResults: 50
      }).then((response: any) => {
        nextPageToken = response.result.nextPageToken
        const items = response.result.items
        playlistVideos = playlistVideos.concat(items)
        if (nextPageToken !== undefined && nextPageToken !== '') {
          return this.listYoutubePlaylistVideos(googleAPI, playlistID, playlistVideos, nextPageToken)
        } else {
          return playlistVideos
        }
      })
    }

    public getPlaylistItems (playlistID: string): Promise<Array<VideoInfo>> {
      return this.getGoogleAPI().then((googleAPI) => {
        return this.listYoutubePlaylistVideos(googleAPI, playlistID).then((videos: any) => {
          const items = []
          for (const videoIndex in videos) {
            const videoThumbnails: {[index: string]: string} = {}
            for (const thumbnail in videos[videoIndex].snippet.thumbnails) {
              videoThumbnails[thumbnail] = videos[videoIndex].snippet.thumbnails[thumbnail].url
            }
            const videoName = videos[videoIndex].snippet.title
            const videoId = videos[videoIndex].snippet.resourceId.videoId
            const videoTags = store.get(videoId, []) as VideoTags
            items.push({ id: videoId, name: videoName, thumbnails: videoThumbnails, tags: videoTags })
          }
          return items
        })
      })
    }
}
