import { Component, OnInit } from '@angular/core';
import { Quote } from '../quote';

const QUOTES: Quote[] = [
  {
    text: 'Rivers know this: there is no hurry. We shall get there some day.',
    author: 'A.A. Milne',
    title: null,
  },
  {
    text: 'Trees that are slow to grow bear the best fruit.',
    author: 'Moliere',
    title: null,
  },
  {
    text: 'The strongest of all warriors are these two — Time and Patience.',
    author: 'Leo Tolstoy',
    title: 'War and Peace',
  },
  {
    text: 'Make your ego porous. Will is of little importance, complaining is nothing, fame is nothing. Openness, patience, receptivity, solitude is everything.',
    author: 'Rainer Maria Rilke',
    title: null,
  },
  {
    text: 'Everybody going to be dead one day, just give them time.',
    author: 'Neil Gaiman',
    title: 'Anansi Boys',
  },
  {
    text: 'I am extraordinarily patient, provided I get my own way in the end.',
    author: 'Margaret Thatcher',
    title: null,
  },
];

function getRandomQuote(): Quote {
  var i = Math.floor(Math.random() * QUOTES.length);
  return QUOTES[i];
}

const ACHIEVEMENTS = [];

@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.component.html',
  styleUrls: ['./achievements.component.css']
})
export class AchievementsComponent implements OnInit {
  quote: Quote;

  constructor() { }

  ngOnInit(): void {
    this.quote = getRandomQuote();
  }
}
