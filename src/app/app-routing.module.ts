import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneratorsComponent } from './generators/generators.component'
import { OptionsComponent } from './options/options.component';

const routes: Routes = [
  { path: 'generators', component: GeneratorsComponent },
  { path: 'options', component: OptionsComponent },
  { path: '', redirectTo: '/generators', pathMatch: 'full' }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
