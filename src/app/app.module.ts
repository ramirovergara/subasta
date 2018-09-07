import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {NgxChildProcessModule} from 'ngx-childprocess';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormatDatePipe } from './shared/format-date.pipe';

@NgModule({
  declarations: [
    AppComponent,
    FormatDatePipe
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
