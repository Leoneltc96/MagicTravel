import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSuitcase } from '@fortawesome/free-solid-svg-icons';

export type CardItem =  { 
  title: string,
  price: number,
  days: string,
  nights: string,
  tax: number,
  img: string,
  clv: string,
}

@Component({
  selector: 'card',
  imports: [CurrencyPipe, FontAwesomeModule, RouterModule],
  templateUrl: './cards.html',
  styleUrl: './cards.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})


export class Cards { 

  protected readonly faSuitcase = faSuitcase;

  public cardItem = input<CardItem>({ title: '', price: 0, days: '', nights: '', tax: 0, img: '', clv: '' })
}
