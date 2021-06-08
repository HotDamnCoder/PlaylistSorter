/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { IPlaylistAPI } from './IPlaylistAPI'
import { VueGapi } from 'vue-gapi'

export class YoutubeAPI implements IPlaylistAPI {
    private VUE_GAPI: VueGapi

    constructor (vueGapi: VueGapi) {
      this.VUE_GAPI = vueGapi
    }

    private getGoogleAPI (): Promise<any> {
      return this.VUE_GAPI.getGapiClient()
    }

    public loginToAPI () {
      return this.VUE_GAPI.login()
    }

    private listYoutubePlaylists (googleAPI: any, playlistID: string): Promise<any> {
      return googleAPI.client.youtube.playlists.list({
        part: ['snippet'],
        id: [playlistID]
      })
    }

    public getPlaylistInfo (playlistID: string): Promise<any> {
      return this.getGoogleAPI().then((googleAPI) => {
        return this.listYoutubePlaylists(googleAPI, playlistID).then((response: any) => {
          return response.result.items[0]
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

    public getPlaylistItems (playlistID: string): Promise<any> {
      return this.getGoogleAPI().then((googleAPI) => {
        return this.listYoutubePlaylistItems(googleAPI, playlistID)
      })
    }
}
