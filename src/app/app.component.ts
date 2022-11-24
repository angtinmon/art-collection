import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Artwork } from './models/artwork.model';
import { ArtworkService } from './services/artwork.service';
import { compareStringOrNumber } from './utils/utils';

type SortableField = Extract<keyof Artwork, 'title' | 'artist' | 'startYear'>;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  readonly sortingOptions: { value: SortableField | null; label: string; }[] = [
    { value: null, label: 'Default' },
    { value: 'title', label: 'Title' },
    { value: 'artist', label: 'Artist' },
    { value: 'startYear', label: 'Date' },
  ];
  filterOptions: { value: string; label: string; }[] = [];

  filters: string[] = [];
  sorting: SortableField | null = null;

  total = 0;
  limit = 14;
  page = 1;
  loading = false;

  artworks: readonly Artwork[] = [];
  artworkMetas: ReadonlyMap<Artwork, {
    originalIndex: number;
    visible: boolean;
    imageUrl?: string | null;
  }> = new Map();

  constructor(private readonly artworkService: ArtworkService) {
    this.changePage(this.page);
  }

  public filterArtworks(): void {
    if (!this.loading) {
      for (const artwork of this.artworks) {
        const meta = this.artworkMetas.get(artwork);
        if (meta != null) {
          meta.visible = this.filters.length === 0 || artwork.styles.some(style => this.filters.includes(style));
        }
      }
    }
  }

  public sortArtworks(): void {
    if (!this.loading) {
      let compare: (a: Artwork, b: Artwork) => -1 | 1 | 0;
      if (this.sorting != null) {
        const field = this.sorting;
        compare = (a, b) => compareStringOrNumber(a[field], b[field]);
      } else {
        compare = (a, b) => compareStringOrNumber(
          this.artworkMetas.get(a)?.originalIndex,
          this.artworkMetas.get(b)?.originalIndex
        );
      }
      this.artworks = [...this.artworks].sort(compare);
    }
  }

  public changePage(page: number): void {
    if (!this.loading) {
      this.loading = true;
      this.page = page;
      this.artworks = [];
      this.filters = [];
      this.filterOptions = [];
      this.artworkService.getArtworks(this.limit, this.page).subscribe(result => {
        this.total = result.total ?? 0;
        this.page = result.page ?? this.page;
        this.artworks = result.artworks;
        this.artworkMetas = new Map(this.artworks.map((artwork, index) => [artwork, { originalIndex: index, visible: true }]));
        this.filterOptions = this.getFilterOptions(result.artworks);
        this.sortArtworks();
        this.loading = false;
      });
    }
  }

  public setDefaultImageUrl(artwork: Artwork): void {
    const meta = this.artworkMetas.get(artwork);
    if (meta != null) {
      meta.imageUrl = environment.settings.defaultImageUrl;
    }
  }

  public getYears(artwork: Artwork): string | null {
    return artwork.startYear === artwork.endYear ? String(artwork.startYear) :
      [artwork.startYear, artwork.endYear].filter(year => year != null).join(' - ');
  }

  private getFilterOptions(artworks: readonly Artwork[]): typeof this.filterOptions {
    const styleCounts = new Map<string, number>();
    for (const artwork of artworks) {
      for (const style of artwork.styles) {
        const count = styleCounts.get(style) ?? 0;
        styleCounts.set(style, count + 1);
      }
    }
    return Array.from(styleCounts.entries()).map(([style, count]) =>
      ({ value: style, label: `${style} (${count})` }));
  }

}
