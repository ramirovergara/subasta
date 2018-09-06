import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {NgxChildProcessModule} from 'ngx-childprocess';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent
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
