import { ipcRenderer } from 'electron'
import { IPlaylistAPI } from './IPlaylistAPI'
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URI, SPOTIFY_AUTH_URL } from './credentials'
import SpotifyWebApi from 'spotify-web-api-node'

export class SpotifyAPI implements IPlaylistAPI {
  private SPOTIFY_API = new SpotifyWebApi({
    clientId: SPOTIFY_CLIENT_ID,
    clientSecret: SPOTIFY_CLIENT_SECRET,
    redirectUri: SPOTIFY_REDIRECT_URI
  })

  private setToken (token: string) {
    this.SPOTIFY_API.setAccessToken(token)
  }

  public loginToAPI (): Promise<boolean> {
    ipcRenderer.on('spotify_oauth', (_event, authToken) => {
      this.SPOTIFY_API.setAccessToken(authToken)
    })
    const authwindow = window.open(SPOTIFY_AUTH_URL) as Window
    return new Promise((resolve) => {
      const timeoutTime = 2 * 1000
      const intervalTime = 500
      let timesChecked = 0
      const intervalTimer = setInterval(() => {
        timesChecked += 1
        if (authwindow.closed) {
          clearInterval(intervalTimer)
          resolve(true)
        }
        if (timesChecked * intervalTime >= timeoutTime) {
          clearInterval(intervalTimer)
          authwindow.close()
          resolve(true)
        }
      }, intervalTime)
    })
  }

  public getPlaylistInfo (id: string) : Promise<{name: string, thumbnails: SpotifyApi.ImageObject[]}> {
    return this.SPOTIFY_API.getPlaylist(id).then((response) => {
      const data = response.body
      return { name: data.name, thumbnails: data.images }
    })
  }

  public getPlaylistItems (id: string) {
    return this.SPOTIFY_API.getPlaylistTracks(id)
  }
}
