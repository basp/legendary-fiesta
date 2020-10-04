import { Component } from '@angular/core';
import { Generator } from './generator';
import { State } from './state';
import { StateService } from './state.service';
import { ToastrService } from 'ngx-toastr';
import { SAVE_FILE } from './common';
import Decimal from 'break_infinity.js';

// In order to increase game speed without increasing
// the actual framerate we'll use `refspeed` and `tickspeed`.
// At the start of the game `refspeed` and `tickspeed` should
// be equal. This will yield a production multiplier of 1.
// During the game, `tickspeed` might become lower and thus the 
// ratio of `refspeed` divided by `tickspeed` will be greater
// than one. If production is then multiplied with this value
// we will get a "virtual" time boost.
const refspeed = 1000;
const tickspeed = 1000;

// This is the actual "framerate" (i.e the game will update `rate` 
// times per second).
const rate = 10;

// This is the expect duration of each "frame" in milliseconds if
// the game would run on an infinitely fast CPU with 100% accurate
// browser scheduling.
const interval = 1000 / rate;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Legendary Fiesta';
  state: State;

  constructor(
    private stateService: StateService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    // State is now shared between multiple components
    // so we'll obtain it via a state service.
    this.state = this.stateService.getState();

    // We probably don't want to do this once
    // we enable offline progression.
    this.state.lastUpdate = performance.now();
    
    // Try to load any save game we might have.
    // This will do nothing if there's no stored
    // save file available (i.e. a completely new user).
    this.load();

    // Initialize the main gameloop timer.
    setInterval(() => {
      const thisUpdate = performance.now();

      // The value of `dt` is the amount of time that
      // has passed since we last updated the game.
      const dt = thisUpdate - this.state.lastUpdate;
      this.update(dt);

      // Make sure we remember the last time that
      // we updated for the next frame update.
      this.state.lastUpdate = thisUpdate;
    }, interval);

    // We'll save every 30 seconds which seems reasonable.
    const saveInterval = 30 * 1000;
    setInterval(() => {
      this.save();
      this.toastr.info('Game saved.', null, {
        closeButton: false,
      });
    }, saveInterval);    
  }

  // Returns the head of our generator list. This is the
  // generator that actually produces energy.
  head(): Generator {
    return this.state.generators[0];
  }

  // Return all generators (in order) except the main
  // generator (which is returned by `head`). All generators
  // except the main generator produce other generators
  // one tier below them.
  tail(): Generator[] {
    return this.state.generators.slice(1);
  }  

  save(): void {
    localStorage.setItem(SAVE_FILE, JSON.stringify(this.state));
  }

  load(): void {
    let json = localStorage.getItem(SAVE_FILE);

    // Make sure we actually have a save file, otherwise just
    // return early and do nothing.
    if(!json) {
      return;
    }

    // The rest of this code just copies the values from our
    // save file into the actual state. This code is quite
    // error prone and may lead to really weird stuff if you
    // forget anything.
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
    // With `rate` of 10 this boils down to 100 millisecods.
    // It might be a bit shorter or longer depending on browser timing.

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
    // The way we need to deal with generators depends on whether it 
    // produces energy or other generators. All generators except the first
    // one (`head`) produce generators one tier below them. The `head`
    // generators produce the actual energy.
    let first = this.head();

    // The value of `grossEnergy` is what we would've produced if the
    // game was running perfectly on time.
    let grossEnergy = first.number.mul(first.production());

    // The value of `nettEnergy` is compensated for the slight variations
    // of actual frame duration (`dt`).
    let nettEnergy = grossEnergy.mul(s);
    this.state.energy = this.state.energy.add(nettEnergy);

    // We'll use `grossEnergy` to display current output because it's a
    // much more stable number than `nettEnergy`. So even though we're
    // technically lying to the user this leads to a much more pleasant
    // experience.
    this.state.output = grossEnergy.mul(rate).floor();

    // The rest of the generators can all be handled by just looping
    // through them and adding their production to the number of 
    // generators one tier below (i.e. a hyper booster produces boosters
    // and a booster produces generators).
    let rest = this.tail();
    for (let g of rest) {
      let x = g.number.mul(g.production()).mul(s);
      let downstream = this.state.generators[g.tier - 1];
      downstream.number = downstream.number.add(x);
    }
  }  
}
