class Playlist {
  id: string;
  name: string;
  thumbnails: { [index: string]: string };

  constructor(
    id: string,
    name: string,
    thumbnails: { high: string; medium: string; low: string }
  ) {
    this.id = id;
    this.name = name;
    this.thumbnails = thumbnails;
  }
}

export { Playlist };
