import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Artwork } from '../models/artwork.model';
import { ArtworkError, ArtworkErrorType } from '../models/errors/artwork-error.model';
import { isRealNumber, isStringNotEmpty, joinNotEmpty, validateArray, validateNumber, validateString } from '../utils/utils';

export interface ArtworkResult {
  readonly total: number | null;
  readonly page: number | null;
  readonly artworks: readonly Artwork[];
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
  private readonly url = environment.settings.artworkApiUrl;
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
        total: validateNumber(response.pagination?.total),
        page: validateNumber(response.pagination.current_page),
        artworks: validateArray(response.data)?.map(artwork => ({
          title: validateString(artwork.title),
          artist: validateString(artwork.artist_title),
          origin: this.buildOrigin(artwork.place_of_origin, artwork.date_start, artwork.date_end),
          medium: validateString(artwork.medium_display),
          styles: validateArray(artwork.style_titles),
          imageUrl: this.buildImageUrl(response.config?.iiif_url, artwork.image_id)
        }))
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

  // format origin place, start date, and end date
  private buildOrigin(place: string, startYear: number, endYear: number): string | null {
    let years = '';
    if (isRealNumber(startYear) || isRealNumber(endYear)) {
      years = `(${startYear === endYear ? startYear : joinNotEmpty([startYear, endYear], ' - ')})`;
    }
    const origin = joinNotEmpty([place, years], ' ');
    return validateString(origin);
  }

  // construct IIIF image URL according to http://api.artic.edu/docs/#images
  private buildImageUrl(baseUrl: string, imageId: string): string | null {
    return isStringNotEmpty(baseUrl) && isStringNotEmpty(imageId) ?
      `${baseUrl}/${imageId}/${this.imageSpecPath}` :
      null;
  }

}
