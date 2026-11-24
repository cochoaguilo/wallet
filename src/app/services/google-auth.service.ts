import { Injectable, NgZone, inject } from '@angular/core';
import { environment } from '../../environments/environment';

/** Tipos mínimos de Google Identity Services (https://developers.google.com/identity/gsi/web/reference/js-reference). */
interface GoogleCredentialResponse {
  credential: string;
  select_by?: string;
}

interface GoogleAccountsId {
  initialize(config: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
    auto_select?: boolean;
    cancel_on_tap_outside?: boolean;
    ux_mode?: 'popup' | 'redirect';
  }): void;
  renderButton(parent: HTMLElement, options: Record<string, unknown>): void;
  disableAutoSelect(): void;
}

declare global {
  interface Window {
    google?: { accounts: { id: GoogleAccountsId } };
  }
}

const GIS_SCRIPT_URL = 'https://accounts.google.com/gsi/client';

@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {
  private zone = inject(NgZone);
  private scriptPromise?: Promise<GoogleAccountsId>;
  private credentialHandler?: (credential: string) => void;
  private initialized = false;

  get enabled(): boolean {
    return !!environment.googleClientId;
  }

  /**
   * Dibuja el botón "Continuar con Google" dentro de `parent`.
   * `onCredential` recibe el ID token (JWT) firmado por Google, que debe validarse en el backend.
   */
  async renderButton(
    parent: HTMLElement,
    onCredential: (credential: string) => void,
    text: 'signin_with' | 'signup_with' | 'continue_with' = 'continue_with'
  ): Promise<void> {
    if (!this.enabled) return;
    const gis = await this.load();
    this.credentialHandler = onCredential;

    if (!this.initialized) {
      gis.initialize({
        client_id: environment.googleClientId,
        ux_mode: 'popup',
        cancel_on_tap_outside: true,
        // El callback de GIS corre fuera de la zona de Angular
        callback: (response) =>
          this.zone.run(() => this.credentialHandler?.(response.credential))
      });
      this.initialized = true;
    }

    gis.renderButton(parent, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      shape: 'rectangular',
      text,
      logo_alignment: 'left',
      width: Math.min(parent.clientWidth || 320, 400),
      locale: 'es'
    });
  }

  /** Evita que Google vuelva a iniciar sesión automáticamente después de cerrar sesión. */
  signOut(): void {
    window.google?.accounts.id.disableAutoSelect();
  }

  private load(): Promise<GoogleAccountsId> {
    if (window.google?.accounts?.id) {
      return Promise.resolve(window.google.accounts.id);
    }
    if (!this.scriptPromise) {
      this.scriptPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = GIS_SCRIPT_URL;
        script.async = true;
        script.defer = true;
        script.onload = () =>
          window.google?.accounts?.id
            ? resolve(window.google.accounts.id)
            : reject(new Error('Google Identity Services no disponible'));
        script.onerror = () => {
          this.scriptPromise = undefined;
          reject(new Error('No se pudo cargar Google Identity Services'));
        };
        document.head.appendChild(script);
      });
    }
    return this.scriptPromise;
  }
}
