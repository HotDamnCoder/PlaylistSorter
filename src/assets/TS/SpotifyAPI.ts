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

  private getAuthUrl () : string {
    return `https://accounts.spotify.com/authorize?response_type=token&client_id=${this.clientId}&scope=${this.clientScope}&redirect_uri=${this.redirectUri}`
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
    const authWindow = window.open(this.getAuthUrl())
    return new Promise<boolean>((resolve) => {
      const intervalTimer = setInterval(() => {
        if (this.api.getAccessToken() || error || authWindow?.closed) {
          clearInterval(intervalTimer)
          if (error) {
            alert(`An error occured login in to spotify API : ${error}`)
            resolve(false)
          }
          if (authWindow?.closed && !this.api.getAccessToken()) {
            resolve(false)
          }
          resolve(true)
        }
      }, 500)
    })
  }

  public getPlaylistIdFromName (playlistName: string) : Promise<string> {
    return this.api.getUserPlaylists().then((data) => {
      const userPlaylists = data.body.items
      for (const playlistIndex in userPlaylists) {
        const playlist = userPlaylists[playlistIndex]
        if (playlist.name === playlistName) {
          return playlist.id
        }
      }
      return ''
    }, (error) => {
      throw new Error(error.message)
    })
  }

  public getPlaylist (playlistId: string): Promise<Playlist> {
    return this.api.getPlaylist(playlistId).then((response) => {
      const playlistData = response.body
      const playlistThumbnails = { high: playlistData.images[0].url, medium: playlistData.images[1].url, low: playlistData.images[2].url }
      const playlistName = playlistData.name
      return new Playlist(playlistId, playlistName, playlistThumbnails)
    }, (error) => {
      throw new Error(error.message)
    })
  }

  public getPlaylistVideos (playlistId: string): Promise<Array<Video>> {
    return this.api.getPlaylistTracks(playlistId).then((response: any) => {
      let videos
      if ('tracks' in response.body) {
        videos = response.body.tracks.items
      } else {
        videos = response.body.items
      }
      const items: Array<Video> = []
      for (const videoIndex in videos) {
        const videoData = videos[videoIndex].track
        const videoAlbumData = videoData.album
        const videoThumbnails: {[index:string]:string} = { high: videoAlbumData.images[0].url, medium: videoAlbumData.images[1].url, low: videoAlbumData.images[2].url }
        const videoName = videoData.name
        const videoId = videoData.id
        const videoTags = store.get(videoId, []) as VideoTags
        const videoLink = `https://open.spotify.com/embed/track/${videoId}`
        items.push(new Video(videoId, videoName, videoThumbnails, videoTags, videoLink))
      }
      return items
    }, (error) => {
      throw new Error(error.message)
    })
  }

  public async createPlaylist (playlistName: string): Promise<string> {
    return this.api.createPlaylist(playlistName, { public: false }).then((response) => {
      return response.body.id
    }, (error) => {
      throw new Error(error.message)
    })
  }

  public async addItemsToPlaylist (playlistId: string, playlistItems: Array<string>): Promise<void> {
    try {
      await this.api.addTracksToPlaylist(playlistId, this.getVideosURIS(playlistItems))
    } catch (error) {
      throw new Error(error.message)
    }
  }
}
