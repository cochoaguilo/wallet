import { AfterViewInit, Component, ElementRef, inject, input, output, signal, viewChild } from '@angular/core';
import { GoogleAuthService } from '../../services/google-auth.service';

/** Botón oficial "Continuar con Google" (Google Identity Services). Emite el ID token recibido. */
@Component({
  selector: 'app-google-button',
  standalone: true,
  template: `
    @if (enabled) {
      <div class="separator"><span>o</span></div>
      <div #container class="google-button"></div>
      @if (loadError()) {
        <span class="text-danger">{{ loadError() }}</span>
      }
    }
  `,
  styles: [`
    :host { display: block; margin-top: 1rem; }
    .separator { display: flex; align-items: center; gap: .5rem; color: var(--ion-color-medium); margin-bottom: 1rem; }
    .separator::before, .separator::after { content: ''; flex: 1; border-bottom: 1px solid var(--ion-color-light-shade); }
    .google-button { display: flex; justify-content: center; min-height: 44px; }
  `]
})
export class GoogleButtonComponent implements AfterViewInit {
  private googleAuth = inject(GoogleAuthService);

  text = input<'signin_with' | 'signup_with' | 'continue_with'>('continue_with');
  credential = output<string>();

  container = viewChild<ElementRef<HTMLElement>>('container');
  loadError = signal('');
  readonly enabled = this.googleAuth.enabled;

  ngAfterViewInit(): void {
    const el = this.container()?.nativeElement;
    if (!el) return;
    this.googleAuth
      .renderButton(el, (credential) => this.credential.emit(credential), this.text())
      .catch(() => this.loadError.set('No se pudo cargar el inicio de sesión con Google'));
  }
}
