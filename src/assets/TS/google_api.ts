/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoginResponse, VueGapi } from "vue-gapi";

const CLIENT_ID = "1044735142013-4bbuv3kuv7lmk5bietrlrcpnca9vtq5m.apps.googleusercontent.com"
const SCOPE = "https://www.googleapis.com/auth/youtube"
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"]

function loginToGoogle(vueGapi: VueGapi): Promise<LoginResponse> {
    return vueGapi.login();
}

function getGoogleAPI(vueGapi: VueGapi): Promise<any> {
    return vueGapi.getGapiClient();
}

function listYoutubePlaylists(googleAPI: any, playlistID: string): Promise<any> {
    return googleAPI.client.youtube.playlists.list({
        part: ["snippet"],
        id: [playlistID]
    })
}

function getPlaylistInfo(vueGapi: VueGapi, playlistID: string): Promise<any> {
    return getGoogleAPI(vueGapi).then((googleAPI) => {
        return listYoutubePlaylists(googleAPI, playlistID).then((response: any) => {
            return response['result']['items'][0]
        })
    })
}
export { CLIENT_ID, SCOPE, DISCOVERY_DOCS, loginToGoogle, getPlaylistInfo }