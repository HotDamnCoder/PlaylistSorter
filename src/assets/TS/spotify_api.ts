import { generateRandomString } from './helpers'
import SpotifyWebApi from 'spotify-web-api-node'

const CLIENT_SECRET = '***REMOVED***'
const CLIENT_ID = '***REMOVED***';
const REDIRECT_URI = 'http://localhost:8080/callback';
const SCOPE = 'user-read-private user-read-email';
const STATE = generateRandomString(16);
const AUTH_URL = `https://accounts.spotify.com/authorize?response_type=token&client_id=${CLIENT_ID}&scope=${SCOPE}&redirect_uri=${REDIRECT_URI}&state=${STATE}`
const AUTH_TOKEN_RE = /(?<=access_token=).+?(?=&)/g

const SPOTIFY_API = new SpotifyWebApi({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri: REDIRECT_URI
});

export { REDIRECT_URI, AUTH_URL, AUTH_TOKEN_RE, SPOTIFY_API };