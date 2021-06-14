/* eslint-disable @typescript-eslint/no-explicit-any */

import { ipcRenderer } from 'electron'
import { IPlaylistAPI } from './IPlaylistAPI'
import SpotifyWebApi from 'spotify-web-api-node'
import { VideoInfo } from './VideoInfo'

export class SpotifyAPI implements IPlaylistAPI {
  private clientId: string
  private clientSecret: string
  private clientScope: string
  private redirectUri: string
  private api : SpotifyWebApi

  constructor (clientId: string, clientSecret: string, clientScope: string, redirectUri:string) {
    this.clientId = clientId
    this.clientSecret = clientSecret
    this.clientScope = clientScope
    this.redirectUri = redirectUri
    this.api = new SpotifyWebApi({
      clientId: this.clientId,
      clientSecret: this.clientSecret,
      redirectUri: this.redirectUri
    })
  }

  private getAuthUrl () {
    return `https://accounts.spotify.com/authorize?response_type=token&client_id=${this.clientId}&scope=${this.clientScope}&redirect_uri=${this.redirectUri}`
  }

  public loginToAPI (): Promise<boolean> {
    let error = ''
    ipcRenderer.on('spotify_oauth_access', (_event, authToken) => {
      this.api.setAccessToken(authToken)
    })
    ipcRenderer.on('spotify_auth_error', (_event, errorCode) => {
      error = errorCode
    })
    window.open(this.getAuthUrl())
    return new Promise<boolean>((resolve) => {
      const intervalTimer = setInterval(() => {
        if (this.api.getAccessToken() || error) {
          clearInterval(intervalTimer)
          if (error) {
            alert(`An error occured login in to spotify API : ${error}`)
            resolve(false)
          }
          resolve(true)
        }
      }, 500)
    })
  }

  public getPlaylistInfo (id: string): Promise<VideoInfo> {
    return this.api.getPlaylist(id).then((response) => {
      const data = response.body
      const thumbnails: {[index:string]:string} = { high: data.images[0].url, medium: data.images[1].url, low: data.images[2].url }
      return { name: data.name, id: data.id, thumbnails: thumbnails }
    })
  }

  public getPlaylistItems (id: string): Promise<Array<VideoInfo>> {
    return this.api.getPlaylistTracks(id).then((response: any) => {
      const tracks = response.body.tracks.items
      const items = []
      for (const trackNr in tracks) {
        const data = tracks[trackNr].track.album
        const thumbnails: {[index:string]:string} = { high: data.images[0].url, medium: data.images[1].url, low: data.images[2].url }
        items.push({ name: data.name, id: data.id, thumbnails: thumbnails })
      }
      return items
    })
  }
}
