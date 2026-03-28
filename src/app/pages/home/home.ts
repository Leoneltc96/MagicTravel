import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CarouselFlayers } from '../../components/carousel-flayers/carousel-flayers';
import { FeaturedOffers } from '../../components/featured-offers/featured-offers';

@Component({
  selector: 'app-home',
  imports: [
    NgOptimizedImage,
    CarouselFlayers,
    FeaturedOffers,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {}
