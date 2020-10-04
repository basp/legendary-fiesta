import { Component, OnInit } from '@angular/core';
import { State } from '../state';
import { StateService } from '../state.service';
import Decimal from 'break_infinity.js';

const baseTarget = new Decimal(1e3);
const targetMultiplier = new Decimal(1);

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.css']
})
export class ScoreComponent implements OnInit {
  state: State;

  constructor(private stateService: StateService) { }

  ngOnInit(): void {
    this.state = this.stateService.getState();
  }

  target(): Decimal {
    return baseTarget.mul(targetMultiplier.pow(this.state.level));
  }

  progress(): number {
    if (this.state.output.lessThanOrEqualTo(0)) {
      return 0;
    }

    let e = this.state.energy.plus(1).log10();
    let t = this.target().plus(1).log10();
    return Math.min(e / t * 100, 100);
  }

  evolve(): void {
    this.stateService.evolve();
  }
}
