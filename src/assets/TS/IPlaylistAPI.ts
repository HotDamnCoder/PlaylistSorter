/* eslint-disable @typescript-eslint/no-explicit-any */
type loginResponse = Promise<any> | void
export interface IPlaylistAPI {
    loginToAPI() : loginResponse;
    getPlaylistInfo(id: string) : Promise<any>
    getPlaylistItems(id: string) : Promise<any>
}
