import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { navArray } from '../../components/nav/navArray';

type LinkItem = { id: number; title: string; icon: string; url: string };

@Component({
  selector: 'app-explorar-page',
  imports: [RouterLink, NgOptimizedImage, FontAwesomeModule],
  templateUrl: 'explorar.page.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExplorarPage {
  protected readonly faInstagram = faInstagram;
  protected readonly faWhatsapp = faWhatsapp;

  private readonly destinos: LinkItem[] =
    (
      navArray.find((item) => Array.isArray((item as { destinos?: unknown }).destinos)) as {
        destinos?: LinkItem[];
      }
    )?.destinos ?? [];

  private readonly ofertas: LinkItem[] = navArray.filter((item): item is LinkItem => {
    const url = (item as { url?: unknown }).url;
    return typeof url === 'string' && url.startsWith('/travel/');
  });

  protected readonly botones: LinkItem[] = [...this.ofertas, ...this.destinos];
}

