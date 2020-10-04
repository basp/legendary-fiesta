import { Pipe, PipeTransform } from '@angular/core';
import Decimal from 'break_infinity.js';
import { hasKnownSuffix, formatBignumber, shorten } from './formatting';

@Pipe({ name: 'formatCost' })
export class FormatCostPipe implements PipeTransform {
  transform(value: Decimal) {
    if (value.lessThan(1e4)) {
      return value.toString();
    }
  
    if (!hasKnownSuffix(value)) {
      return `${value.mantissa}e${value.exponent}`;
    }
  
    let [val, _, suffix] = shorten(value);
    return `${val.toFixed(0)} ${suffix}`;
  }
}