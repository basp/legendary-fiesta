import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Legendary Fiesta';
  active = 'generators';

  select(name: string) {
    this.active = name;
  }
}
