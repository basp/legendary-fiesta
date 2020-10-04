import { Injectable } from '@angular/core';
import Decimal from 'break_infinity.js';
import { State } from './state';
import { SAVE_FILE } from './common';

const def = new State();

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private state = new State();

  constructor() { }

  getState(): State {
    return this.state;
  }

  evolve(): void {
    this.state.energy = def.energy;
    this.state.interval = def.interval;
    this.state.output = def.output;
    for(let g of this.state.generators) {
      if(g.requiredLevel > this.state.level) {
        continue;
      }
      g.number = new Decimal(0);
      g.numberBought = 0;
      g.baseProduction = new Decimal(1);
      g.level += 1;
    }
    this.state.level += 1;
  }

  save(): void {
    let json = JSON.stringify(this.state);
    localStorage.setItem(SAVE_FILE, json);
  }

  load(): void {
    let json = localStorage.getItem(SAVE_FILE);

    // Make sure we actually have a save file, otherwise just
    // return early and do nothing.
    if(!json) {
      return;
    }

    // console.log(json);

    // The rest of this code just copies the values from our
    // save file into the actual state. This code is quite
    // error prone and may lead to really weird stuff if you
    // forget anything.
    let save = JSON.parse(json);     
    this.state.energy = new Decimal(save.energy);
    this.state.lastUpdate = save.lastUpdate;
    this.state.level = save.level;
    this.state.toasters = save.toasters;

    for (let i = 0; i < this.state.generators.length; i++) {
      this.state.generators[i].baseProduction = new Decimal(save.generators[i].baseProduction);
      this.state.generators[i].number = new Decimal(save.generators[i].number);
      this.state.generators[i].numberBought = save.generators[i].numberBought;
      this.state.generators[i].level = save.generators[i].level;
    }
  }
  
  reset(): void {
    this.state.energy = def.energy;
    this.state.interval = def.interval;
    this.state.level = def.level;
    this.state.output = def.output;
    this.state.toasters = def.toasters;
    for(let g of this.state.generators) {
      g.number = new Decimal(0);
      g.numberBought = 0;
      g.level = 0;
      g.baseProduction = new Decimal(1);
    }
  }
}
