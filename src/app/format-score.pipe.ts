import { Pipe, PipeTransform } from '@angular/core';
import Decimal from 'break_infinity.js';
import { hasKnownSuffix, formatBignumber, shorten } from './formatting';

@Pipe({ name: 'formatScore'})
export class FormatScorePipe implements PipeTransform {
  transform(value: Decimal) {
    if (value.lessThan(1e4)) {
      return value.toFixed(0);
    }
  
    if (!hasKnownSuffix(value)) {
      return formatBignumber(value);
    }
  
    let [val, name, suffix] = shorten(value);
    return `${val.toFixed(1)} ${suffix} (${name})`;
  }
}
