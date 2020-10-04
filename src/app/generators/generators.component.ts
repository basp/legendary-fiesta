import { Component, OnInit } from '@angular/core';
import { State } from '../state';
import { StateService } from '../state.service';

@Component({
  selector: 'app-generators',
  templateUrl: './generators.component.html',
  styleUrls: ['./generators.component.css']
})
export class GeneratorsComponent implements OnInit {
  state: State;

  constructor(private stateService: StateService) { }

  ngOnInit(): void {
    this.state = this.stateService.getState();
  }
}
