import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { iframesURLS } from './iframes';
import { TmButton } from '../../components/tm-button/tm-button';

export type IframeCountryType =  {
    betterOffers: CountryType;
    currentOffers: CountryType;
    europa: CountryType;
    medioOriente: CountryType;
    canada: CountryType;
    asia: CountryType;
    africa: CountryType;
    pacific: CountryType;
    southAmerica: CountryType;
    eua: CountryType;
    centerAmerica: CountryType;
    cubaCaribean: CountryType;
    nacional: CountryType;
    specialesEvents: CountryType;
    cruises: CountryType;
}

export type CountryType = {
  url: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-details.page',
  imports: [TmButton],
  templateUrl: './details.page.html',
  styleUrl: './details.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsPage {
  private readonly route = inject(ActivatedRoute);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly destroyRef = inject(DestroyRef);
  private readonly iframesURLS: IframeCountryType = iframesURLS;

  protected readonly backgroundImage = 'url("img/banners/booknow_bg.jpg")';

  protected readonly clv = signal('');
  protected readonly country = signal('');
  protected readonly urlIframe = signal<SafeResourceUrl | null>(null);
  protected readonly titleIframe = signal('Detalles del viaje');
  protected readonly descriptionIframe = signal('');



  constructor() {
    const sub = this.route.paramMap.subscribe((params) => {
      let normalized = this.normalizeInput(params.get('clv'));
      let country = this.normalizeInput(params.get('country'));
    // console.log('entre aqui', normalized, country, params.get('country'));

      this.country.set(country ?? '');
      this.clv.set(normalized ?? '');

      // 1. Normalizamos los valores (aseguramos que sean strings)
      normalized = normalized || '';
      country = country || '';
      


      // 2. Cláusula de guarda: Si ambos están vacíos, limpiamos y salimos
      if (normalized === '' && country === '') {
        this.urlIframe.set(null);

        return;
      }
      

      // 3. Determinamos qué URL construir (Prioridad a normalized si country está vacío)
      const finalUrl =
        normalized && !country
          ? this.buildMegaTravelUrl(normalized)
          : this.buildCountryUrl(country as keyof IframeCountryType);

      // 4. Seteamos el valor sanitizado una sola vez
      this.urlIframe.set(this.sanitizer.bypassSecurityTrustResourceUrl(finalUrl));
    });

    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  private normalizeInput(value: string | null): string | null {
    const trimmed = value?.trim();

    if (!trimmed) return null;
    
    if (!/^[a-zA-Z0-9]{1,20}$/.test(trimmed)) return null;
    
    return trimmed;
  }

  private buildMegaTravelUrl(clv: string): string {
    const url = new URL('https://www.megatravel.com.mx/tools/circuito.php');
    url.searchParams.set('viaje', clv);
    url.searchParams.set('txtColor', '000000');//Texto
    url.searchParams.set('lblTPaq', '00000'); //No sirve
    url.searchParams.set('lblTRange', '000000'); //No sirve
    url.searchParams.set('lblNumRange', '000000');//No sirve
    url.searchParams.set('itemBack', '000000'); //No sirve
    url.searchParams.set('ItemHov', '000000'); // No sirve
    url.searchParams.set('txtColorHov', '1');// No sirve
    url.searchParams.set('thBG', '000000'); //titulos
    url.searchParams.set('thTxColor', 'FFD900'); //bg titulos
    return url.toString();
  }

  private buildCountryUrl(country: keyof IframeCountryType): string {
    const iframe: CountryType = this.iframesURLS[country];

    if (!iframe) {
      return '';
    }

    const url = new URL(iframe.url);
    url.searchParams.set('txtColor', '000000');//Texto
    url.searchParams.set('lblTPaq', '6B92E5'); //No sirve
    url.searchParams.set('lblTRange', '6B92E5'); //slides de rangos y labels
    url.searchParams.set('lblNumRange', '6B92E5');//rangos txt
    url.searchParams.set('itemBack', 'FFFFFF'); //fondo tablas
    url.searchParams.set('ItemHov', 'FFD900'); // hover fila tabla
    url.searchParams.set('txtColorHov', '000000');// precio e impuesto hover
    url.searchParams.set('thBG', '6B92E5'); //titulos
    url.searchParams.set('thTxColor', '000000'); //bg titulos

    this.titleIframe.set(iframe.title);
    this.descriptionIframe.set(iframe.description);

    const urlString = url.toString();

    console.log(urlString);

    return urlString
  }
  
  protected redirectWhatsApp() {
    window.open('https://wa.me/525561854542?text=%C2%A1Hola%20Magic%20Travel!%20Estoy%20listo%20para%20planear%20mi%20siguiente%20aventura.%20Me%20gustar%C3%ADa%20recibir%20informaci%C3%B3n%20sobre%20sus%20paquetes%20disponibles.', '_blank');
  }
}
