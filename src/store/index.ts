import { createStore } from 'vuex'
import { PlaylistId } from '@/assets/TS/PlaylistID'
import { IPlaylistAPI } from '@/assets/TS/IPlaylistAPI'
import { Video } from '@/assets/TS/Video'
const store = createStore({
  state: {
    playlistID: {},
    playlistAPI: {},
    playlistName: '',
    playlistThumbnailURL: '',
    playlistItems: []
  },
  mutations: {
    setPlaylistID: (state, id: PlaylistId) => {
      state.playlistID = id
    },
    setPlaylistAPI: (state, api: IPlaylistAPI) => {
      state.playlistAPI = api
    },
    setPlaylistName: (state, name: string) => {
      state.playlistName = name
    },
    setPlaylistThumbnailURL: (state, url) => {
      state.playlistThumbnailURL = url
    },
    setPlaylistItems: (state, items) => {
      state.playlistItems = items
    }
  },
  actions: {

  },
  getters: {
    getPlaylistID: (state) => () => {
      return state.playlistID as PlaylistId
    },
    getPlaylistAPI: (state) => () => {
      return state.playlistAPI as IPlaylistAPI
    },
    getPlaylistName: (state) => () => {
      return state.playlistName as string
    },
    getPlaylistThumbnailURL: (state) => () => {
      return state.playlistThumbnailURL as string
    },
    getPlaylistItems: (state) => () => {
      return state.playlistItems as Array<Video>
    }
  }
})

export default store
