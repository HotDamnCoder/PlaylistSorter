const YOUTUBE_CLIENT_ID =
  "1044735142013-k3bmr7kq5qn4ijdbs6jj211ipj5p2lbv.apps.googleusercontent.com";
const YOUTUBE_SCOPE = "https://www.googleapis.com/auth/youtube";
const YOUTUBE_DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest",
];

const SPOTIFY_CLIENT_SECRET = "ca3a458dd41f4412bd76ff862edb2b8f";
const SPOTIFY_CLIENT_ID = "a264ff02b1f24d179ffd96680d556f56";
const SPOTIFY_REDIRECT_URI = "http://localhost:8080/callback";
const SPOTIFY_SCOPE =
  "user-read-private playlist-modify-private playlist-read-private";

const SPOTIFY_ERROR_RE = /(?<=error=).+?(?=&)/g;
const SPOTIFY_AUTH_TOKEN_RE = /(?<=access_token=).+?(?=&)/g;

export {
  YOUTUBE_CLIENT_ID,
  YOUTUBE_SCOPE,
  YOUTUBE_DISCOVERY_DOCS,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_REDIRECT_URI,
  SPOTIFY_SCOPE,
  SPOTIFY_ERROR_RE,
  SPOTIFY_AUTH_TOKEN_RE,
};
