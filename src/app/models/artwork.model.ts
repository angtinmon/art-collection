export interface Artwork {
  readonly title: string | null;
  readonly artist: string | null;
  readonly origin: string | null;
  readonly startYear: number | null;
  readonly endYear: number | null;
  readonly medium: string | null;
  readonly styles: string[];
  readonly imageUrl: string | null;
}
