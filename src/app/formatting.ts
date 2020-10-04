import Decimal from 'break_infinity.js'

// https://officespace.zendesk.com/hc/en-us/articles/115000593531-Scientific-Notation-Large-Numbers-Guide

const suffixes = [
  {
    size: new Decimal(1e3),
    name: 'kilo',
    unit: 'K'
  },
  {
    size: new Decimal(1e6),
    name: 'million',
    unit: 'M'
  },
  {
    size: new Decimal(1e9),
    name: 'billion',
    unit: 'B'
  },
  {
    size: new Decimal(1e12),
    name: 'trillion',
    unit: 'T'
  },
  {
    size: new Decimal(1e15),
    name: 'quadrillion',
    unit: 'Qa'
  },
  {
    size: new Decimal(1e18),
    name: 'quintillion',
    unit: 'Qi'
  },
  {
    size: new Decimal(1e21),
    name: 'sextillion',
    unit: 'Sx'
  },
  {
    size: new Decimal(1e24),
    name: 'septillion',
    unit: 'Sp'
  },
  {
    size: new Decimal(1e27),
    name: 'octillion',
    unit: 'Oc'
  },
  {
    size: new Decimal(1e30),
    name: 'nonillion',
    unit: 'No'
  },
  {
    size: new Decimal(1e33),
    name: 'decillion',
    unit: 'Dc'
  },
  {
    size: new Decimal(1e36),
    name: 'undecillion',
    unit: 'Ud'
  },
  {
    size: new Decimal(1e39),
    name: 'duodecillion',
    unit: 'Dd'
  },
  {
    size: new Decimal(1e42),
    name: 'tredecillion',
    unit: 'Td'
  },
  {
    size: new Decimal(1e45),
    name: 'quattuordecillion',
    unit: 'Qad'
  },
  {
    size: new Decimal(1e48),
    name: 'quindecillion',
    unit: 'Qid'
  },
  {
    size: new Decimal(1e51),
    name: 'sexdecillion',
    unit: 'Sxd'
  },
  {
    size: new Decimal(1e54),
    name: 'septendecillion',
    unit: 'Spd'
  },
  {
    size: new Decimal(1e57),
    name: 'octodecillion',
    unit: 'Ocd'
  },
  {
    size: new Decimal(1e60),
    name: 'novemdecillion',
    unit: 'Nod'
  },
  {
    size: new Decimal(1e63),
    name: 'vigintillion',
    unit: 'Vg'
  },
  {
    size: new Decimal(1e66),
    name: 'unvigintillion',
    unit: 'Uvg'
  },
];

const lastSuffixSize = suffixes[suffixes.length - 1].size;
export function hasKnownSuffix(value: Decimal): boolean {
  return value.lessThanOrEqualTo(lastSuffixSize);
}

export function shorten(value: Decimal): [Decimal, string, string ] {
  let suffix: { size: Decimal, name: string, unit: string };
  for(let s of suffixes) {
    if(value.greaterThanOrEqualTo(s.size)) {
      suffix = s;
    }
  }

  let val = value.div(suffix.size);
  return [val, suffix.name, suffix.unit];
}

export function formatBignumber(value: Decimal): string {
  let mantissa = value.mantissa;
  let exponent = value.exponent;
  if (mantissa >= 10) {
    exponent += 1;
    mantissa /= 10;
  }
  return `${mantissa.toFixed(1)}e${exponent}`;
}