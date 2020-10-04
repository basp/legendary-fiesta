import Decimal from 'break_infinity.js';
import { Generator } from './generator';

export class State {
  public lastUpdate: number;
  public energy = new Decimal(10);
  public output = new Decimal(0);
  public interval = new Decimal(1000);
  public level = 0;
  public generators = [
    new Generator(
      0,
      'Generator',
      new Decimal(1e1),
      new Decimal(1e3),
      0),
    new Generator(
      1,
      'Booster',
      new Decimal(1e2),
      new Decimal(1e4),
      1),
    new Generator(
      2,
      'Hyper Booster',
      new Decimal(1e3),
      new Decimal(1e5),
      1),
    new Generator(
      3,
      'Enhanced Sensors',
      new Decimal(1e5),
      new Decimal(1e7),
      2),
    new Generator(
      4,
      '6DoF Stabilizers',
      new Decimal(1e8),
      new Decimal(1e9),
      3),
    new Generator(
      5,
      'Deep Learning',
      new Decimal(1e13),
      new Decimal(1e12),
      5),
    new Generator(
      6,
      'Nano Servos',
      new Decimal(1e19),
      new Decimal(1e14),
      8),
    new Generator(
      7,
      'Gravity Shift',
      new Decimal(1e25),
      new Decimal(1e18),
      13),
  ];
}