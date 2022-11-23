import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NxCardModule } from '@aposin/ng-aquila/card';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxDropdownModule } from '@aposin/ng-aquila/dropdown';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxHeadlineModule } from '@aposin/ng-aquila/headline';
import { NxPaginationModule } from '@aposin/ng-aquila/pagination';
import { NxTooltipModule } from '@aposin/ng-aquila/tooltip';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    NxHeadlineModule,
    NxFormfieldModule,
    NxDropdownModule,
    NxCardModule,
    NxCopytextModule,
    NxTooltipModule,
    NxPaginationModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
