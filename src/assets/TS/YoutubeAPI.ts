/* eslint-disable @typescript-eslint/no-explicit-any */
import { IPlaylistAPI } from './IPlaylistAPI'
import { VueGapi } from 'vue-gapi'
import { VideoInfo } from './VideoInfo'

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

    public getPlaylistInfo (playlistID: string): Promise<VideoInfo> {
      return this.getGoogleAPI().then((googleAPI) => {
        return this.listYoutubePlaylists(googleAPI, playlistID).then((response: any) => {
          const data = response.result.items[0]
          const thumbnails: {[index: string]: string} = {}
          for (const thumbnail in data.snippet.thumbnails) {
            thumbnails[thumbnail] = data.snippet.thumbnails[thumbnail].url
          }
          return { id: data.id, name: data.snippet.title, thumbnails: thumbnails }
        })
      })
    }

    private listYoutubePlaylistItems = (googleAPI: any, playlistID: string, playlistItems = [], nextPageToken = '') => {
      return googleAPI.client.youtube.playlistItems.list({
        part: ['snippet'],
        playlistId: [playlistID],
        pageToken: nextPageToken,
        maxResults: 50
      }).then((response: any) => {
        nextPageToken = response.result.nextPageToken
        playlistItems = playlistItems.concat(response.result.items)
        if (nextPageToken !== undefined && nextPageToken !== '') {
          return this.listYoutubePlaylistItems(googleAPI, playlistID, playlistItems, nextPageToken)
        } else {
          return playlistItems
        }
      })
    }

    public getPlaylistItems (playlistID: string): Promise<Array<VideoInfo>> {
      return this.getGoogleAPI().then((googleAPI) => {
        return this.listYoutubePlaylistItems(googleAPI, playlistID).then((items: any) => {
          const videos = []
          for (const itemNr in items) {
            const thumbnails: {[index: string]: string} = {}
            for (const thumbnail in items[itemNr].snippet.thumbnails) {
              thumbnails[thumbnail] = items[itemNr].snippet.thumbnails[thumbnail].url
            }
            videos.push({ id: items[itemNr].snippet.resourceId.videoId, name: items[itemNr].snippet.title, thumbnails: thumbnails })
          }
          return videos
        })
      })
    }
}
