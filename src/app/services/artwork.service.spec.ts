import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { appSettings } from 'src/settings/app.settings';
import { testArtworkApiResponse, testArtworkResult } from 'src/testing/test.data';

import { ArtworkService } from './artwork.service';

describe('ArtworkService', () => {
  const artworkApiUrl = appSettings.artworkApiUrl;
  let service: ArtworkService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(ArtworkService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get artworks', () => {
    const limit = 123;
    const page = 456;
    const fields = 'title,artist_title,place_of_origin,date_start,date_end,medium_display,style_titles,image_id';
    const params = `limit=${limit}&page=${page}&fields=${fields}`;
    const artworkResult = testArtworkResult;
    const apiResponse = testArtworkApiResponse;

    service.getArtworks(limit, page).subscribe(result => {
      expect<any>(result).toEqual(artworkResult);
    });

    const req = httpTestingController.expectOne(`${artworkApiUrl}?${params}`);
    expect(req.request.method).toEqual('GET');

    req.flush(apiResponse);
  });
});
