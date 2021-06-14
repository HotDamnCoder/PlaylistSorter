/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IPlaylistAPI {
    loginToAPI() : Promise<boolean>;
    getPlaylistInfo(id: string) : Promise<any>
    getPlaylistItems(id: string) : Promise<any>
}
