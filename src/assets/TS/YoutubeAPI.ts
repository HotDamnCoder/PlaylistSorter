/* eslint-disable @typescript-eslint/no-explicit-any */
import { IPlaylistAPI } from "./IPlaylistAPI";
import { VueGapi } from "vue-gapi";
import { Video } from "./Video";
import Store from "electron-store";
import { Playlist } from "./Playlist";
import { VideoTags } from "./Tags";
const store = new Store();

export class YoutubeAPI implements IPlaylistAPI {
  private vueGAPI: VueGapi;
  private api: any;

  constructor(vueGapi: VueGapi) {
    this.vueGAPI = vueGapi;
    this.vueGAPI.getGapiClient().then((gapiClient) => {
      this.api = gapiClient.client.youtube;
    });
  }

  private listUserPlaylistsInfos = (
    playlistInfos = [],
    nextPageToken = ""
  ): Promise<any> => {
    return this.api.playlists
      .list({
        part: ["snippet"],
        mine: true,
      })
      .then((response: any) => {
        const items = response.result.items;
        playlistInfos = playlistInfos.concat(items);
        if (nextPageToken !== undefined && nextPageToken !== "") {
          return this.listUserPlaylistsInfos(playlistInfos, nextPageToken);
        } else {
          return playlistInfos;
        }
      });
  };

  private listPlaylistInfo(playlistId: string): Promise<any> {
    return this.api.playlists
      .list({
        part: ["snippet"],
        id: [playlistId],
      })
      .then((response: any) => {
        return response.result.items[0];
      });
  }

  private listPlaylistItems = (
    playlistId: string,
    playlistItems = [],
    nextPageToken = ""
  ): Promise<any> => {
    return this.api.playlistItems
      .list({
        part: ["snippet"],
        playlistId: [playlistId],
        pageToken: nextPageToken,
        maxResults: 50,
      })
      .then((response: any) => {
        nextPageToken = response.result.nextPageToken;
        const items = response.result.items;
        playlistItems = playlistItems.concat(items);
        if (nextPageToken !== undefined && nextPageToken !== "") {
          return this.listPlaylistItems(
            playlistId,
            playlistItems,
            nextPageToken
          );
        } else {
          return playlistItems;
        }
      });
  };

  private getThumbnailUrls(thumbnails: any): {
    high: string;
    medium: string;
    low: string;
  } {
    try {
      const thumbnailUrls = { high: "", medium: "", low: "" };
      if ("standard" in thumbnails) {
        thumbnailUrls.high = thumbnails.standard.url;
      } else {
        thumbnailUrls.high = thumbnails.high.url;
      }
      thumbnailUrls.medium = thumbnails.high.url;
      thumbnailUrls.low = thumbnails.medium.url;
      return thumbnailUrls;
    } catch {
      throw new Error("Couldn't get thumbnails");
    }
  }

  public loginToAPI(): Promise<boolean> {
    return this.vueGAPI.login().then(
      (loginResponse) => {
        return loginResponse.hasGrantedScopes;
      },
      (error: any) => {
        throw new Error(error.result.error.message);
      }
    );
  }

  public getPlaylistIdFromName(playlistName: string): Promise<string> {
    return this.listUserPlaylistsInfos().then(
      (playlistInfos: any) => {
        for (const playlistInfoIndex in playlistInfos) {
          const playlistInfo = playlistInfos[playlistInfoIndex];
          if (playlistName === playlistInfo.snippet.title) {
            return playlistInfo.id;
          }
        }
        return "";
      },
      (error: any) => {
        throw new Error(error.result.error.message);
      }
    );
  }

  public getPlaylist(playlistId: string): Promise<Playlist> {
    return this.listPlaylistInfo(playlistId).then(
      (playlistInfo: any) => {
        playlistInfo = playlistInfo.snippet;
        const playlistThumbnails = this.getThumbnailUrls(
          playlistInfo.thumbnails
        );
        const playlistName = playlistInfo.title;
        return new Playlist(playlistId, playlistName, playlistThumbnails);
      },
      (error: any) => {
        throw new Error(error.result.error.message);
      }
    );
  }

  public getPlaylistVideos(playlistId: string): Promise<Array<Video>> {
    return this.listPlaylistItems(playlistId).then(
      (items: any) => {
        const videos = [];
        for (const itemIndex in items) {
          const videoData = items[itemIndex].snippet;
          const videoName = videoData.title;
          if (videoName !== "Private video" && videoName !== "Deleted video") {
            const videoThumbnails = this.getThumbnailUrls(videoData.thumbnails);
            const videoId = videoData.resourceId.videoId;
            const videoTags = store.get(videoId, []) as VideoTags;
            const videoLink = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
            videos.push(
              new Video(
                videoId,
                videoName,
                videoThumbnails,
                videoTags,
                videoLink
              )
            );
          }
        }
        return videos;
      },
      (error: any) => {
        throw new Error(error.result.error.message);
      }
    );
  }

  public async createPlaylist(playlistName: string): Promise<string> {
    return this.api.playlists
      .insert({
        part: ["snippet"],
        resource: {
          snippet: {
            title: playlistName,
          },
        },
      })
      .then(
        (response: any) => {
          console.log(response);
          return "";
        },
        (error: any) => {
          throw new Error(error.result.error.message);
        }
      );
  }

  public addItemsToPlaylist = async (
    playlistId: string,
    items: Array<string>,
    itemIndex = 0
  ): Promise<void> => {
    await this.api.playlistItems.insert(
      {
        part: ["snippet"],
        resource: {
          snippet: {
            playlistId: playlistId,
            resourceId: {
              kind: "youtube#video",
              videoId: items[itemIndex],
            },
          },
        },
      },
      (error: any) => {
        throw new Error(error.result.error.message);
      }
    );
    itemIndex += 1;
    if (itemIndex <= items.length - 1) {
      await this.addItemsToPlaylist(playlistId, items, itemIndex);
    }
  };
}
