class PlaylistId {
  reExps: { [index: string]: RegExp } = {
    Youtube: /([\d\w_-]){28,}/g,
    Spotify: /(?<=playlist\/).{42}/g,
  };

  id = "";
  type = "";

  constructor(url: string) {
    for (const type in this.reExps) {
      const matches = url.match(this.reExps[type]);
      if (matches?.length === 1) {
        this.id = matches[0];
        this.type = type;
        break;
      }
    }
    if (!this.id || !this.type) {
      throw new Error("Invalid url");
    }
  }
}
export { PlaylistId };
