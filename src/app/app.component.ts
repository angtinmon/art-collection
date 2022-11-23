import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Artwork } from './models/artwork.model';
import { ArtworkService } from './services/artwork.service';
import { validateNumber } from './utils/utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  total = 0;
  limit = 8;
  page = 1;
  loading = false;
  artworks: readonly Artwork[] = [];

  constructor(private readonly artworkService: ArtworkService) {
    this.changePage(this.page);
  }

  public changePage(page: number): void {
    if (!this.loading) {
      this.loading = true;
      this.page = page;
      this.artworkService.getArtworks(this.limit, this.page).subscribe(result => {
        this.total = validateNumber(result.total, 0);
        this.page = validateNumber(result.page, this.page);
        this.artworks = result.artworks;
        this.loading = false;
      });
    }
  }

  public setDefaultImage(artwork: Artwork): void {
    artwork.imageUrl = environment.settings.defaultImageUrl;
  }
}
