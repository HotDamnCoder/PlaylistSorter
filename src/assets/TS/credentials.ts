import { generateRandomString } from './helpers'

const YOUTUBE_CLIENT_ID = '1044735142013-4bbuv3kuv7lmk5bietrlrcpnca9vtq5m.apps.googleusercontent.com'
const YOUTUBE_SCOPE = 'https://www.googleapis.com/auth/youtube'
const YOUTUBE_DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest']

const SPOTIFY_CLIENT_SECRET = '***REMOVED***'
const SPOTIFY_CLIENT_ID = '***REMOVED***'
const SPOTIFY_REDIRECT_URI = 'http://localhost:8080/callback'
const SPOTIFY_SCOPE = 'user-read-private user-read-email'
const SPOTIFY_STATE = generateRandomString(16)
const SPOTIFY_AUTH_URL = `https://accounts.spotify.com/authorize?response_type=token&client_id=${SPOTIFY_CLIENT_ID}&scope=${SPOTIFY_SCOPE}&redirect_uri=${SPOTIFY_REDIRECT_URI}&state=${SPOTIFY_STATE}`
const SPOTIFY_AUTH_TOKEN_RE = /(?<=access_token=).+?(?=&)/g

export { YOUTUBE_CLIENT_ID, YOUTUBE_SCOPE, YOUTUBE_DISCOVERY_DOCS, SPOTIFY_CLIENT_SECRET, SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI, SPOTIFY_SCOPE, SPOTIFY_STATE, SPOTIFY_AUTH_URL, SPOTIFY_AUTH_TOKEN_RE }
