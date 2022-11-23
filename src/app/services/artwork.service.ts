import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { appSettings } from 'src/settings/app.settings';
import { Artwork } from '../models/artwork.model';
import { ArtworkError, ArtworkErrorType } from '../models/errors/artwork-error.model';

export interface ArtworkResult {
  total: number | null;
  artworks: Artwork[];
}

// response body structure from http://api.artic.edu/docs/#collections
interface ArtworkApiResponse {
  readonly pagination: {
    readonly total: number;
    readonly limit: number;
    readonly offset: number;
    readonly total_pages: number;
    readonly current_page: number;
  };
  readonly data: {
    readonly title: string;
    readonly date_start: number;
    readonly date_end: number;
    readonly place_of_origin: string;
    readonly medium_display: string;
    readonly artist_title: string;
    readonly style_titles: string[];
    readonly image_id: string;
  }[];
  readonly config: {
    readonly iiif_url: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ArtworkService {
  private readonly url = appSettings.artworkApiUrl;
  private readonly imageSize = 843;
  private readonly imageSpecPath = `full/${this.imageSize},/0/default.jpg`;
  private readonly fieldsParamValue = 'title,artist_title,place_of_origin,date_start,date_end,medium_display,style_titles,image_id';

  constructor(private readonly httpClient: HttpClient) { }

  // get artworks with page number and items per page, according to http://api.artic.edu/docs/#collections 
  public getArtworks(limit: number, page: number): Observable<ArtworkResult> {
    return this.httpClient.get<ArtworkApiResponse>(this.url, {
      params: { limit, page, fields: this.fieldsParamValue }
    }).pipe(
      map(response => ({
        // empty or invalid data will be null
        total: response.pagination?.total || null,
        artworks: this.validateArray(response.data)?.map(artwork => ({
          title: artwork.title || null,
          artist: artwork.artist_title || null,
          origin: artwork.place_of_origin || null,
          startYear: artwork.date_start || null,
          endYear: artwork.date_end || null,
          medium: artwork.medium_display || null,
          styles: this.validateArray(artwork.style_titles) || [],
          imageUrl: this.buildImageUrl(response.config?.iiif_url, artwork.image_id)
        })) || []
      })),
      catchError(error => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 0) {
            return throwError(() => new ArtworkError(ArtworkErrorType.ClientError, error));
          } else {
            return throwError(() => new ArtworkError(ArtworkErrorType.ServerError, error));
          }
        } else {
          return throwError(() => error);
        }
      }),
    );
  }

  // construct IIIF image URL according to http://api.artic.edu/docs/#images
  private buildImageUrl(baseUrl: string, imageId: string): string | null {
    return baseUrl != null && imageId != null ?
      `${baseUrl}/${imageId}/${this.imageSpecPath}` :
      null;
  }

  // check if data from API response is an array and copy it into a new array
  private validateArray<T>(array: T[]): T[] | null {
    return Array.isArray(array) ? Array.from(array) : null;
  }

}
