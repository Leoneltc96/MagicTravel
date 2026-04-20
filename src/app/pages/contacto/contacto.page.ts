import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormField, email, form, required, submit } from '@angular/forms/signals';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFacebook, faInstagram, faTiktok, faWhatsapp } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-contacto-page',
  imports: [FormField, FontAwesomeModule],
  templateUrl: './contacto.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactoPage {
  protected readonly faWhatsapp = faWhatsapp;
  protected readonly faInstagram = faInstagram;
  protected readonly faFacebook = faFacebook;
  protected readonly faTiktok = faTiktok;

  protected readonly model = signal({
    nombre: '',
    correo: '',
    mensaje: '',
  });

  protected readonly contactoForm = form(this.model, (path) => {
    required(path.nombre, { message: 'El nombre es obligatorio.' });
    required(path.correo, { message: 'El correo es obligatorio.' });
    email(path.correo, { message: 'Ingresa un correo válido.' });
    required(path.mensaje, { message: 'El mensaje es obligatorio.' });
  });

  protected readonly enviado = signal(false);

  protected async onSubmit(event: Event) {
    event.preventDefault();

    const ok = await submit(this.contactoForm, {
      action: async () => undefined,
    });

    if (!ok) return;

    this.enviado.set(true);
    this.model.set({ nombre: '', correo: '', mensaje: '' });
    this.contactoForm().reset();
  }
}
