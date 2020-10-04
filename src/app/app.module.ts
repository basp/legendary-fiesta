import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GeneratorsComponent } from './generators/generators.component';
import { OptionsComponent } from './options/options.component';
import { ScoreComponent } from './score/score.component';
import { AchievementsComponent } from './achievements/achievements.component';

import { FormatCostPipe } from './format-cost.pipe';
import { FormatNumberPipe } from './format-number.pipe';
import { FormatProductionPipe } from './format-production.pipe';
import { FormatScorePipe } from './format-score.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
    GeneratorsComponent,
    OptionsComponent,
    ScoreComponent,
    AchievementsComponent,
    FormatCostPipe,
    FormatNumberPipe,
    FormatProductionPipe,
    FormatScorePipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
