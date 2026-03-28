import { ChangeDetectionStrategy, Component } from '@angular/core';
import { faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { Nav } from '../../components/nav/nav';
import { Footer } from '../../components/footer/footer';
import { RouterOutlet } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-magictravel',
  imports: [
    Nav, 
    Footer, 
    RouterOutlet,
    FontAwesomeModule,
  ],
  templateUrl: './magictravel.html',
  styleUrl: './magictravel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Magictravel { 
  public readonly faInstagram = faInstagram;

  public readonly faWhatsapp = faWhatsapp;
}
