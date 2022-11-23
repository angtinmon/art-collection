export interface Artwork {
  readonly title: string | null;
  readonly artist: string | null;
  readonly origin: string | null;
  readonly medium: string | null;
  readonly styles: string[];
  imageUrl: string | null;
}
