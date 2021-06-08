import { ipcRenderer } from 'electron'
import { IPlaylistAPI } from './IPlaylistAPI'
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URI, SPOTIFY_AUTH_URL, SPOTIFY_AUTH_TOKEN_RE } from './credentials'
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

    public async loginToAPI () {
      ipcRenderer.on('spotify_oauth', (_event, url) => {
        if (url.includes(SPOTIFY_REDIRECT_URI)) {
          const accessTokenMatches = url.match(SPOTIFY_AUTH_TOKEN_RE)
          if (accessTokenMatches) {
            if (accessTokenMatches.length === 1) {
              this.setToken(accessTokenMatches[0])
              window.close()
            } else {
              console.log('Error with spotify') //!  Add error code
            }
          }
        }
      })
      window.open(SPOTIFY_AUTH_URL)
    }

    public getPlaylistInfo (id: string) {
      return this.SPOTIFY_API.getPlaylist(id)
    }

    public getPlaylistItems (id: string) {
      return this.SPOTIFY_API.getPlaylistTracks(id)
    }
}
