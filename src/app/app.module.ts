import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {NgxChildProcessModule} from 'ngx-childprocess';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormatDatePipe } from './shared/format-date.pipe';
import { TypePipe } from './shared/pipes/type.pipe';
import { TypeNumberPipe } from './shared/type-number.pipe';
import { ParseIntPipe } from './shared/pipes/parse-int.pipe';

@NgModule({
  declarations: [
    AppComponent,
    FormatDatePipe,
    TypePipe,
    TypeNumberPipe,
    ParseIntPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgxChildProcessModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
