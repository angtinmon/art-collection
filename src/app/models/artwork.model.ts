export interface Artwork {
  title: string | null;
  artist: string | null;
  origin: string | null;
  startYear: number | null;
  endYear: number | null;
  medium: string | null;
  styles: string[];
  imageUrl: string | null;
}
