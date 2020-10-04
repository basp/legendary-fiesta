import { Injectable } from '@angular/core';
import { State } from './state';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private state = new State();

  constructor() { }

  getState(): State {
    return this.state;
  }
}
