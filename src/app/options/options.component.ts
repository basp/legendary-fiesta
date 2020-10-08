import { Component, OnInit } from '@angular/core';
import { State } from '../state';
import { StateService } from '../state.service';
import { Quote } from '../quote';
import { SAVE_FILE } from '../common';

const QUOTES: Quote[] = [
  {
    text: 'Nothing is eternal. Eternal is darkness. Darkness is bliss.',
    author: 'Kittekat Ocelotson',
    title: 'The Catzars of Dominion',
  },
  {
    text: 'There are darknesses in life and there are lights, and you are one of the lights, the light of all lights.',
    author: 'Bram Stoker',
    title: 'Dracula',
  },
  {
    text: 'Someone I loved once gave me a box full of darkness. It took me years to understand that this too, was a gift.',
    author: 'Mary Oliver',
    title: null,
  },
  {
    text: 'Everyone is a moon, and has a dark side which he never shows to anybody.',
    author: 'Mark Twain',
    title: null,
  },
  {
    text: 'Stars, hide your fires; Let not light see my black and deep desires.',
    author: 'William Shakespeare',
    title: 'Macbeth',
  },
];

function getRandomQuote(): Quote {
  var i = Math.floor(Math.random() * QUOTES.length);
  return QUOTES[i];
}

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css']
})
export class OptionsComponent implements OnInit {
  state: State;
  quote: Quote;

  constructor(private stateService: StateService) { }

  ngOnInit(): void {
    this.state = this.stateService.getState();
    this.quote = getRandomQuote();
  }

  reset(): void {
    this.stateService.reset();
    localStorage.removeItem(SAVE_FILE);
  }
}
