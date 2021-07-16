class Video {
  id: string;
  name: string;
  thumbnails: { [index: string]: string };
  link: string;
  author: string;

  constructor(
    id: string,
    name: string,
    thumbnails: { [index: string]: string } = {},
    link: string,
    author = ""
  ) {
    this.id = id;
    this.name = name;
    this.thumbnails = thumbnails;
    this.link = link;
    this.author = author;
  }
}
export { Video };
