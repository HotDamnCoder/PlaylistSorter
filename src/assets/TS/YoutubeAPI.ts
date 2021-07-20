/* eslint-disable @typescript-eslint/no-explicit-any */
import { IPlaylistAPI } from "./IPlaylistAPI";
import { VueGapi } from "vue-gapi";
import { Video } from "./Video";
import { Playlist } from "./Playlist";

export class YoutubeAPI implements IPlaylistAPI {
  private vueGAPI: VueGapi;
  private api: any;

  constructor(vueGapi: VueGapi) {
    this.vueGAPI = vueGapi;
  }

  private listUserPlaylistsInfos = (
    playlistInfos = [],
    nextPageToken = ""
  ): Promise<any> => {
    return this.api.playlists
      .list({
        part: ["snippet"],
        mine: true,
        pageToken: nextPageToken,
        // maxresults: 50,
      })
      .then((response: any) => {
        nextPageToken = response.result.nextPageToken;
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

  public async loginToAPI(): Promise<boolean> {
    await this.vueGAPI.getGapiClient().then((gapiClient) => {
      this.api = gapiClient.client.youtube;
    });
    return this.vueGAPI.login().then(
      (loginResponse) => {
        return loginResponse.hasGrantedScopes;
      },
      (error: any) => {
        throw new Error(`Failed to log in: "${error.error}"`);
      }
    );
  }

  public getPlaylistIdFromName(playlistName: string): Promise<string> {
    return this.listUserPlaylistsInfos().then(
      (playlistInfos: any) => {
        playlistInfos.forEach((playlistInfo: any) => {
          if (playlistName === playlistInfo.snippet.title) {
            return playlistInfo.id;
          }
        });
        return "";
      },
      (error: any) => {
        throw new Error(
          `Failed to get playlist id from name: "${error.result.error.message}"`
        );
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
        throw new Error(
          `Failed to get playlist info: "${error.result.error.message}"`
        );
      }
    );
  }

  public getPlaylistVideos(playlistId: string): Promise<Array<Video>> {
    return this.listPlaylistItems(playlistId).then(
      (items: any) => {
        const videos: Array<Video> = [];
        items.forEach((item: any) => {
          const videoData = item.snippet;
          const videoName = videoData.title;
          if (videoName !== "Private video" && videoName !== "Deleted video") {
            const videoThumbnails = this.getThumbnailUrls(videoData.thumbnails);
            const videoId = videoData.resourceId.videoId;
            const videoLink = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
            videos.push(
              new Video(videoId, videoName, videoThumbnails, videoLink)
            );
          }
        });
        return videos;
      },
      (error: any) => {
        throw new Error(
          `Failed to get playlist videos: "${error.result.error.message}"`
        );
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
          return response.result.id;
        },
        (error: any) => {
          throw new Error(
            `Failed to create a new playlist: "${error.result.error.message}`
          );
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
        throw new Error(
          `Failed to add items to playlist: "${error.result.error.message}`
        );
      }
    );
    itemIndex += 1;
    if (itemIndex <= items.length - 1) {
      await this.addItemsToPlaylist(playlistId, items, itemIndex).catch(
        (error) => {
          throw new Error(
            `Failed to add items to playlist: "${error.result.error.message}`
          );
        }
      );
    }
  };

  public search(query: Video): Promise<Array<Video>> {
    let improvedQuery;
    if (query.author) {
      improvedQuery = query.author + " - " + query.name;
    } else {
      improvedQuery = query.name;
    }
    return this.api.search
      .list({
        part: ["snippet"],
        maxResults: 5,
        q: improvedQuery,
      })
      .then(
        (response: any) => {
          const searchItems = response.result.items;
          const videos: Array<Video> = [];
          searchItems.forEach((searchItem: any) => {
            const videoData = searchItem.snippet;
            const videoId = searchItem.id.videoId;
            const videoName = videoData.title;
            const videoThumbnails = this.getThumbnailUrls(videoData.thumbnails);
            const videoLink = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
            videos.push(
              new Video(videoId, videoName, videoThumbnails, videoLink)
            );
          });
          return videos;
        },
        (error: any) => {
          throw new Error(
            `Failed to search for items: "${error.result.error.message}`
          );
        }
      );
  }
}
