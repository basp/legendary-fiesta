import Decimal from 'break_infinity.js';
import { State } from './state';

export class Generator {
  public number = new Decimal(0);
  public numberBought = 0;
  public level = 0;
  public baseProduction = new Decimal(1);

  constructor(
    public tier: number,
    public name: string,
    public baseCost: Decimal,
    public costMultiplier: Decimal,
    public requiredLevel: number) { }

  buy(state: State): void {
    state.energy = state.energy.sub(this.cost());
    this.number = this.number.add(1);
    this.numberBought += 1;
  }

  buyTo10(state: State): void {
    let num = 10 - (this.numberBought % 10);
    for (let i = 0; i < num; i++) {
      this.buy(state);
    }
  }

  power(): number {
    return Math.floor(this.numberBought / 10);
  }

  purchased(): number {
    return Math.floor(this.numberBought % 10);
  }

  cost(): Decimal {
    return this.baseCost.mul(
      this.costMultiplier.pow(this.power()));
  }

  costTo10(): Decimal {
    let num = 10 - (this.numberBought % 10);
    return this.cost().mul(num);
  }

  production(): Decimal {
    let base = this.baseProduction.plus(this.level * 0.5);
    return base.mul(new Decimal(2).pow(this.power()));
  }

  isBuyEnabled(state: State): boolean {
    return state.energy.greaterThanOrEqualTo(this.cost());
  }

  isBuyTo10Enabled(state: State): boolean {
    return state.energy.greaterThanOrEqualTo(this.costTo10());
  }

  isVisible(state: State): boolean {
    if (this.tier < 1) {
      return true;
    }

    return state.generators[this.tier - 1].number.greaterThan(0) &&
      this.requiredLevel <= state.level;
  }
}