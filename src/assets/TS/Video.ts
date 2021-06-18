import { VideoTags } from './Tags'

class Video {
    id: string
    name: string
    thumbnails: {[index:string]: string }
    tags: VideoTags
    preview: string

    constructor (id: string, name: string, thumbnails: {[index: string]: string}, tags: VideoTags, preview: string) {
      this.id = id
      this.name = name
      this.thumbnails = thumbnails
      this.tags = tags
      this.preview = preview
    }
}
export { Video }
