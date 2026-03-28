import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';
import { Cards } from '../cards/cards';
import { AppService } from '../../services/app.service';
import { tap } from 'rxjs';

@Component({
  selector: 'featured-offers',
  imports: [CommonModule, Cards],
  templateUrl: './featured-offers.html',
  styleUrl: './featured-offers.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeaturedOffers { 
  
  private readonly appService = inject(AppService);

  protected readonly featuredOffers$ = rxResource({
    stream: () => this.appService.getMegaSliderPromos().pipe(tap((res) => console.log(res)))
    
  })
  
}
