import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxCardModule } from '@aposin/ng-aquila/card';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxDropdownModule } from '@aposin/ng-aquila/dropdown';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxHeadlineModule } from '@aposin/ng-aquila/headline';
import { NxModalModule } from '@aposin/ng-aquila/modal';
import { NxPaginationModule } from '@aposin/ng-aquila/pagination';
import { NxSpinnerModule } from '@aposin/ng-aquila/spinner';
import { NxTooltipModule } from '@aposin/ng-aquila/tooltip';
import { of, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { testArtworkResult } from 'src/testing/test.data';

import { AppComponent } from './app.component';
import { Artwork } from './models/artwork.model';
import { ArtworkResult, ArtworkService } from './services/artwork.service';

describe('AppComponent', () => {
  const artworkServiceSpy = jasmine.createSpyObj<ArtworkService>('ArtworkService', ['getArtworks']);

  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        NxHeadlineModule,
        NxFormfieldModule,
        NxDropdownModule,
        NxCardModule,
        NxCopytextModule,
        NxTooltipModule,
        NxPaginationModule,
        NxSpinnerModule,
        NxModalModule,
        NxButtonModule
      ],
      providers: [
        { provide: ArtworkService, useValue: artworkServiceSpy }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('should load artworks on init', () => {
    artworkServiceSpy.getArtworks.and.returnValue(of(testArtworkResult));
    fixture.detectChanges();

    expect(app.artworks).toEqual(testArtworkResult.artworks);
  });

  it('should filter artworks', () => {
    const artworks: Artwork[] = testArtworkResult.artworks;

    artworkServiceSpy.getArtworks.and.returnValue(of(testArtworkResult));
    fixture.detectChanges();

    app.filters = ['Art Deco'];
    app.filterArtworks();
    expect(app.artworkMetas.get(artworks[0])).toEqual({ originalIndex: 0, visible: false });
    expect(app.artworkMetas.get(artworks[1])).toEqual({ originalIndex: 1, visible: true });
    expect(app.artworkMetas.get(artworks[2])).toEqual({ originalIndex: 2, visible: false });

    app.filters = ['Art Deco', 'Arts and Crafts Movement'];
    app.filterArtworks();
    expect(app.artworkMetas.get(artworks[0])).toEqual({ originalIndex: 0, visible: true });
    expect(app.artworkMetas.get(artworks[1])).toEqual({ originalIndex: 1, visible: true });
    expect(app.artworkMetas.get(artworks[2])).toEqual({ originalIndex: 2, visible: false });

    app.filters = [];
    app.filterArtworks();
    expect(app.artworkMetas.get(artworks[0])).toEqual({ originalIndex: 0, visible: true });
    expect(app.artworkMetas.get(artworks[1])).toEqual({ originalIndex: 1, visible: true });
    expect(app.artworkMetas.get(artworks[2])).toEqual({ originalIndex: 2, visible: true });
  });

  it('should sort artworks', () => {
    const artworks: Artwork[] = testArtworkResult.artworks;

    artworkServiceSpy.getArtworks.and.returnValue(of(testArtworkResult));
    fixture.detectChanges();

    app.sorting = 'artist';
    app.sortArtworks();
    expect(app.artworks).toEqual([artworks[0], artworks[2], artworks[1]]);

    app.sorting = 'startYear';
    app.sortArtworks();
    expect(app.artworks).toEqual([artworks[2], artworks[0], artworks[1]]);

    app.sorting = 'title';
    app.sortArtworks();
    expect(app.artworks).toEqual([artworks[1], artworks[0], artworks[2]]);

    app.sorting = '';
    app.sortArtworks();
    expect(app.artworks).toEqual([artworks[0], artworks[1], artworks[2]]);
  });

  it('should change page', () => {
    const artworks: Artwork[] = testArtworkResult.artworks;
    const testPage = 11;
    const artworkSubject = new Subject<ArtworkResult>();

    artworkServiceSpy.getArtworks.and.returnValue(artworkSubject.asObservable());
    fixture.detectChanges();
    artworkSubject.next({ total: 0, page: 0, artworks: [] });
    app.sorting = 'startYear';

    app.changePage(testPage);
    expect(app.loading).toBeTrue();
    expect(app.page).toBe(testPage);

    artworkSubject.next(testArtworkResult);
    expect(app.loading).toBeFalse();
    expect(app.total).toBe(testArtworkResult.total);
    expect(app.artworks).toEqual([artworks[2], artworks[0], artworks[1]]);
    expect(app.filterOptions).toEqual([
      { value: 'Modernism', label: 'Modernism (2)' },
      { value: 'Arts and Crafts Movement', label: 'Arts and Crafts Movement (1)' },
      { value: 'American Arts and Crafts Movement', label: 'American Arts and Crafts Movement (1)' },
      { value: 'Art Deco', label: 'Art Deco (1)' },
    ]);
    expect(app.filters).toEqual([]);
  });

  it('should format artwork dates', () => {
    const artworks: Artwork[] = testArtworkResult.artworks;
    expect(app.getYears(artworks[0])).toBe('1920 - 1921');
    expect(app.getYears(artworks[1])).toBe('1931');
    expect(app.getYears(artworks[2])).toBe('');
  });

  it('should set default image URL', () => {
    const artworks: Artwork[] = testArtworkResult.artworks;
    artworkServiceSpy.getArtworks.and.returnValue(of(testArtworkResult));
    fixture.detectChanges();

    expect(app.artworkMetas.get(artworks[1])?.imageUrl).toBeFalsy();

    app.setDefaultImageUrl(artworks[1]);
    expect(app.artworkMetas.get(artworks[1])?.imageUrl).toBe(environment.settings.defaultImageUrl);
  });

});
