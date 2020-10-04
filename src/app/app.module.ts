import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GeneratorsComponent } from './generators/generators.component';
import { AppRoutingModule } from './app-routing.module';
import { OptionsComponent } from './options/options.component';

@NgModule({
  declarations: [
    AppComponent,
    GeneratorsComponent,
    OptionsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
