import { Component, OnInit } from '@angular/core';
import { State } from '../state';
import { StateService } from '../state.service';
import { Generator } from '../generator';

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

  generators(): Generator[] {
    let state = this.state;
    return this.state.generators.filter(function (x) {
      return x.isVisible(state);
    });
  }

  max(): void {
    for (let g of this.generators()) {
      if (this.state.energy.greaterThanOrEqualTo(g.costTo10())) {
        g.buyTo10(this.state);
      }
    }
  }

  isMaxEnabled(): boolean {
    let state = this.state;
    let gens = this.generators();
    return gens.some(function (x) {
      return x.isBuyTo10Enabled(state);
    });
  }  
}
