import { Injectable } from '@angular/core';
import Decimal from 'break_infinity.js';
import { State } from './state';

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

  reset(): void {
    this.state.energy = def.energy;
    this.state.interval = def.interval;
    this.state.level = def.level;
    this.state.output = def.output;
    for(let g of this.state.generators) {
      g.number = new Decimal(0);
      g.numberBought = 0;
      g.level = 0;
    }
  }
}
