import { Component } from '@angular/core';
import { Generator } from './generator';
import { State } from './state';
import { StateService } from './state.service';
import { ToastrService } from 'ngx-toastr';
import { SAVE_FILE } from './common';
import Decimal from 'break_infinity.js';

declare var $:any;

const refspeed = 1000;
const tickspeed = 1000;
const rate = 10;
const interval = 1000 / rate;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Legendary Fiesta';
  active = 'generators';
  state: State;

  constructor(
    private stateService: StateService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.state = this.stateService.getState();
    this.state.lastUpdate = performance.now();
    
    this.load();

    setInterval(() => {
      const thisUpdate = performance.now();
      this.update(thisUpdate - this.state.lastUpdate);
      this.state.lastUpdate = thisUpdate;
    }, interval);

    setInterval(() => {
      this.save();
      this.toastr.info('Game saved.')
    }, 30 * 1000);    
  }

  select(name: string) {
    this.active = name;
  }

  head(): Generator {
    return this.state.generators[0];
  }

  tail(): Generator[] {
    return this.state.generators.slice(1);
  }  

  save(): void {
    localStorage.setItem(SAVE_FILE, JSON.stringify(this.state));
  }

  load(): void {
    let json = localStorage.getItem(SAVE_FILE);
    if(!json) {
      return;
    }

    let save = JSON.parse(json);     
    this.state.energy = new Decimal(save.energy);
    this.state.lastUpdate = save.lastUpdate;
    this.state.level = save.level;

    for (let i = 0; i < this.state.generators.length; i++) {
      this.state.generators[i].baseProduction = new Decimal(save.generators[i].baseProduction);
      this.state.generators[i].number = new Decimal(save.generators[i].number);
      this.state.generators[i].numberBought = save.generators[i].numberBought;
      this.state.generators[i].level = save.generators[i].level;
    }
  }

  update(dt: number) {
    // The value of `dt` should be around 1000 / rate. 
    // With rate of 20 this boils down to 50 millisecods.
    // However, it might be a bit shorter or longer.

    // First we need to find out if we under- or overshot our
    // intended interval. We expect this method to be called
    // every `interval` of time (which is a number in milliseconds)
    // so we need to see how much of the interval we have (especially
    // when we are lagging).

    // If we are running exactly on schedule then `r` should be 1.0.
    // If we are lagging then `r` will be greater than 1.0.
    // If we are running too fast (usually only happens due to tiny
    // browser scheduling variations) then `r` will be less than 1.0.
    let r = dt / interval;

    // However, if `r` is less than 1.0 we'll clamp it to 1 so we dont
    // get weird number behavior going between growth and decline.
    // If we didn't do this your energy gain of 3.2 might suddenly become
    // 3.17 on the next frame and that is really annoying.
    r = r < 1.0 ? 1.0 : r;

    // Now we just need to compensate this with either a higher
    // or lower tickspeed. The `tickspeed` value starts of at 1000
    // but can be dynamically adjusted by whatever the game requires. 
    // The `refspeed` value never changes but it should be equal 
    // to the `tickspeed` at the beginning of the game.

    // First we convert our scaled unit value `r` into "speed" domain.
    // If we are running exactly on time then `r` should be very close
    // to 1.0 and to normalize it we want it to be around a `refspeed` 
    // instead.
    let s = r * refspeed;

    // Now we scale `s` with our actual tickspeed. If the tickspeed
    // is lower than a 1000 then time should be progressing faster
    // scorewise (even though we're still ticking along the same `interval`).
    // If tickspeed is 1000 and we are running on time then this should
    // return back into a scale unit of around 1.0.
    s = s / tickspeed;

    // Now we can finally scale our production with time and tickspeed.
    let first = this.head();
    let grossEnergy = first.number.mul(first.production());
    this.state.energy = this.state.energy.add(grossEnergy);
    this.state.output = grossEnergy.mul(rate).floor();

    let rest = this.tail();
    for (let g of rest) {
      let x = g.number.mul(g.production()).mul(s);
      let downstream = this.state.generators[g.tier - 1];
      downstream.number = downstream.number.add(x);
    }
  }  
}
