/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { ipcRenderer } from 'electron'
import { IPlaylistAPI } from './IPlaylistAPI'
import SpotifyWebApi from 'spotify-web-api-node'
import { Video } from './Video'
import Store from 'electron-store'
import { Playlist } from './Playlist'
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

  private getPlaylistIdFromName (playlistName: string) : Promise<string> {
    return this.api.getUserPlaylists().then((data) => {
      const userPlaylists = data.body.items
      for (const playlistIndex in userPlaylists) {
        const playlist = userPlaylists[playlistIndex]
        if (playlist.name === playlistName) {
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

  public getPlaylist (playlistId: string): Promise<Playlist> {
    return this.api.getPlaylist(playlistId).then((response) => {
      const playlistData = response.body
      const playlistThumbnails: {[index:string]:string} = { high: playlistData.images[0].url, medium: playlistData.images[1].url, low: playlistData.images[2].url }
      const playlistName = playlistData.name
      return new Playlist(playlistId, playlistName, playlistThumbnails)
    })
  }

  public getPlaylistVideos (playlistId: string): Promise<Array<Video>> {
    return this.api.getPlaylistTracks(playlistId).then((response: any) => {
      const videos = response.body.tracks.items
      const items = []
      for (const videoIndex in videos) {
        const videoData = videos[videoIndex].track.album
        const videoThumbnails: {[index:string]:string} = { high: videoData.images[0].url, medium: videoData.images[1].url, low: videoData.images[2].url }
        const videoName = videoData.name
        const videoId = videoData.id
        const videoTags = store.get(videoId, []) as VideoTags
        items.push(new Video(videoId, videoName, videoThumbnails, videoTags, ''))
      }
      return items
    })
  }

  public checkIfPlaylistExists (playlistName: string) : Promise<boolean> {
    return this.getPlaylistIdFromName(playlistName).then((playlistId) => {
      return playlistId !== ''
    })
  }

  public createPlaylist (playlistName: string): Promise<any> {
    return this.api.createPlaylist(playlistName, { public: false })
  }

  public addItemsToPlaylist (playlistName: string, playlistItems: Array<string>): Promise<any> {
    return this.getPlaylistIdFromName(playlistName).then((id) => {
      return this.api.addTracksToPlaylist(id, this.getVideosURIS(playlistItems))
    })
  }
}
