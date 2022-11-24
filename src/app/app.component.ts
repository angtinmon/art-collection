import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NxDialogService, NxModalRef } from '@aposin/ng-aquila/modal';
import { catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Artwork } from './models/artwork.model';
import { ArtworkResult, ArtworkService } from './services/artwork.service';
import { compareStringOrNumber } from './utils/utils';

type SortableField = Extract<keyof Artwork, 'title' | 'artist' | 'startYear'>;
type DropdownOption<T extends string> = { readonly value: T; readonly label: string; };

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public readonly sortingOptions: readonly DropdownOption<SortableField | ''>[] = [
    { value: '', label: 'Recommendation' },
    { value: 'title', label: 'Title' },
    { value: 'artist', label: 'Artist' },
    { value: 'startYear', label: 'Date' },
  ] as const;
  public filterOptions: DropdownOption<string>[] = [];

  public filters: string[] = [];
  public sorting: SortableField | '' = '';

  public total = 1;
  public limit = environment.settings.itemsPerPage;
  public page = 1;
  public loading = false;

  public artworks: readonly Artwork[] = [];
  public artworkMetas: ReadonlyMap<Artwork, { // this is a map between all current artworks and additional data used for the UI
    originalIndex: number;
    visible: boolean;
    imageUrl?: string | null;
  }> = new Map();

  @ViewChild('errorDialog') private errorDialog!: TemplateRef<any>;
  private errorDialogRef: NxModalRef<any, any> | null = null;

  constructor(private readonly dialogService: NxDialogService, private readonly artworkService: ArtworkService) { }

  public ngOnInit(): void {
    this.changePage(this.page);
  }

  // filter current artworks based on selected styles or show all artworks when no style is selected
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

  // sort current artworks based on the selected property or revert to original sorting
  public sortArtworks(): void {
    if (!this.loading) {
      let compare: (a: Artwork, b: Artwork) => -1 | 1 | 0;
      const field = this.sorting;
      if (field !== '') {
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

  // load artworks from the API resets the filters and the filter dropdown options
  // also sorts the new set of artworks based on selected sorting
  public changePage(page: number): void {
    if (!this.loading) {
      this.loading = true;
      this.page = page;
      this.artworks = [];
      this.filters = [];
      this.filterOptions = [];
      this.artworkService.getArtworks(this.limit, this.page).pipe(
        catchError(error => {
          console.error(error);
          this.openErrorDialog();
          return of({ total: this.total, page: 1, artworks: [] } as ArtworkResult);
        })
      ).subscribe(result => {
        this.loading = false;
        this.total = result.total ?? 1;
        this.page = result.page ?? this.page;
        this.artworks = result.artworks;
        this.artworkMetas = new Map(this.artworks.map((artwork, index) => [artwork, { originalIndex: index, visible: true }]));
        this.filterOptions = this.getFilterOptions(result.artworks);
        this.sortArtworks();
      });
    }
  }

  // set the alternate image to be displayed in case the original image does not work
  public setDefaultImageUrl(artwork: Artwork): void {
    const meta = this.artworkMetas.get(artwork);
    if (meta != null) {
      meta.imageUrl = environment.settings.defaultImageUrl;
    }
  }

  // format the start and end dates of the artwork as (YYYY - YYYY) or (YYYY)
  public getYears(artwork: Artwork): string {
    return artwork.startYear === artwork.endYear ? String(artwork.startYear ?? '') :
      [artwork.startYear, artwork.endYear].filter(year => year != null).join(' - ');
  }

  public openErrorDialog(): void {
    this.errorDialogRef = this.dialogService.open(this.errorDialog, { ariaLabel: 'Error' });
  }

  public closeErrorDialog(): void {
    this.errorDialogRef?.close();
  }

  // get the list of dropdown options for the filter field based on the styles of all artworks on the page
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
