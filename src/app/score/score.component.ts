import { Component, OnInit } from '@angular/core';
import { State } from '../state';
import { StateService } from '../state.service';
import Decimal from 'break_infinity.js';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';

const baseTarget = new Decimal(1e4);
const targetMultiplier = new Decimal(1e6);

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.css']
})
export class ScoreComponent implements OnInit {
  state: State;

  constructor(
    private stateService: StateService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.state = this.stateService.getState();
  }

  target(): Decimal {
    return baseTarget.mul(targetMultiplier.pow(this.state.level));
  }

  progress(): number {
    if (this.state.output.lessThan(1)) {
      return 0;
    }

    let e = this.state.energy.plus(1).log10();
    let t = this.target().plus(1).log10();
    return Math.min(e / t * 100, 100);
  }

  evolve(): void {
    this.stateService.evolve();
    for (let g of this.state.generators) {
      if (g.requiredLevel === this.state.level) {
        this.toastr
          .info(`${g.name} unlocked!`, 'New generator', {
            disableTimeOut: true,
            closeButton: false
          })
          .onTap
          .pipe(take(1))
          .subscribe(() => this.toasterClickHandler());
      }
    }
  }

  toasterClickHandler(): void {
    this.state.toasters += 1;
  }
}
