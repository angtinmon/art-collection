import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NxDropdownModule } from '@aposin/ng-aquila/dropdown';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxHeadlineModule } from '@aposin/ng-aquila/headline';
import { of } from 'rxjs';
import { testArtworkResult } from 'src/testing/test.data';

import { AppComponent } from './app.component';
import { ArtworkService } from './services/artwork.service';

describe('AppComponent', () => {
  const artworkServiceSpy = jasmine.createSpyObj<ArtworkService>('ArtworkService', ['getArtworks']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        NxHeadlineModule,
        NxFormfieldModule,
        NxDropdownModule
      ],
      providers: [
        { provide: ArtworkService, useValue: artworkServiceSpy }
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    artworkServiceSpy.getArtworks.and.returnValue(of(testArtworkResult as any));
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h1.nx-heading--section').textContent).toContain('ART COLLECTION');
  });
});
