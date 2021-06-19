import { VideoTags } from './Tags'

class Video {
    id: string
    name: string
    thumbnails: {[index:string]: string }
    tags: VideoTags
    link: string

    constructor (id: string, name: string, thumbnails: {[index: string]: string}, tags: VideoTags, link: string) {
      this.id = id
      this.name = name
      this.thumbnails = thumbnails
      this.tags = tags
      this.link = link
    }
}
export { Video }
