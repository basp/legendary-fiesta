import { Pipe, PipeTransform } from '@angular/core';
import Decimal from 'break_infinity.js';
import { hasKnownSuffix, formatBignumber, shorten } from './formatting';

@Pipe({ name: 'formatNumber'})
export class FormatNumberPipe implements PipeTransform {
  transform(value: Decimal) {
    if (value.lessThan(1e4)) {
      return value.toFixed(0);
    }
  
    if (!hasKnownSuffix(value)) {
      return formatBignumber(value);
    }
  
    let [val, _, suffix] = shorten(value);
    return `${val.toFixed(1)} ${suffix}`;
  }
}