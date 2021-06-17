import { VideoTags } from './Tags'

type VideoInfo = {id: string, name: string, thumbnails: {[index: string]: string}, tags: VideoTags}
export { VideoInfo }
