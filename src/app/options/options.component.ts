import { Component, OnInit } from '@angular/core';
import { State } from '../state';
import { StateService } from '../state.service';
import { SAVE_FILE } from '../common';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css']
})
export class OptionsComponent implements OnInit {
  state: State;

  constructor(private stateService: StateService) { }

  ngOnInit(): void {
    this.state = this.stateService.getState();
  }
  
  reset(): void {
    this.stateService.reset();
    localStorage.removeItem(SAVE_FILE);
  }  
}
