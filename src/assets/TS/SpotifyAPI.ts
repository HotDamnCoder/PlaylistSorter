/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { ipcRenderer } from 'electron'
import { IPlaylistAPI } from './IPlaylistAPI'
import SpotifyWebApi from 'spotify-web-api-node'
import { VideoInfo } from './VideoInfo'
import Store from 'electron-store'
import { PlaylistInfo } from './PlaylistInfo'
import { VideoTags } from './Tags'
const store = new Store()
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

  public getPlaylistInfo (id: string): Promise<PlaylistInfo> {
    return this.api.getPlaylist(id).then((response) => {
      const playlistData = response.body
      const playlistThumbnails: {[index:string]:string} = { high: playlistData.images[0].url, medium: playlistData.images[1].url, low: playlistData.images[2].url }
      const playlistName = playlistData.name
      const playlistId = playlistData.id
      const playlistInfo = { name: playlistName, id: playlistId, thumbnails: playlistThumbnails }
      return playlistInfo
    })
  }

  public getPlaylistItems (id: string): Promise<Array<VideoInfo>> {
    return this.api.getPlaylistTracks(id).then((response: any) => {
      const tracks = response.body.tracks.items
      const items = []
      for (const trackIndex in tracks) {
        const albumData = tracks[trackIndex].track.album
        const videoThumbnails: {[index:string]:string} = { high: albumData.images[0].url, medium: albumData.images[1].url, low: albumData.images[2].url }
        const videoName = albumData.name
        const videoId = albumData.id
        const videoTags = store.get(videoId, []) as VideoTags
        const videoInfo = { name: videoName, id: videoId, thumbnails: videoThumbnails, tags: videoTags }
        items.push(videoInfo)
      }
      return items
    })
  }

  private getPlaylistId (name: string) : Promise<string> {
    return this.api.getUserPlaylists().then((data) => {
      const userPlaylists = data.body.items
      for (const playlistIndex in userPlaylists) {
        const playlist = userPlaylists[playlistIndex]
        if (playlist.name === name) {
          return playlist.id
        }
      }
      return ''
    })
  }

  private getVideosURIS (videoIds: Array<string>) : Array<string> {
    const videoIdsURIS = []
    for (const videoIdIndex in videoIds) {
      const videoId = videoIds[videoIdIndex]
      videoIdsURIS.push(`spotify:track:${videoId}`)
    }
    return videoIdsURIS
  }

  public playlistExists (name: string) : Promise<boolean> {
    return this.api.getUserPlaylists().then((data) => {
      const userPlaylists = data.body.items
      for (const playlistIndex in userPlaylists) {
        const playlist = userPlaylists[playlistIndex]
        if (playlist.name === name) {
          return true
        }
      }
      return false
    })
  }

  public createPlaylist (name: string): Promise<boolean> {
    return this.api.createPlaylist(name).then((_data) => {
      return true
    }, (_error) => {
      return false
    })
  }

  public addItemsToPlaylist (name: string, items: Array<string>): Promise<boolean> {
    return this.getPlaylistId(name).then((id) => {
      return this.api.addTracksToPlaylist(id, this.getVideosURIS(items)).then((_data) => {
        return true
      }, (_error) => {
        return false
      })
    })
  }
}
