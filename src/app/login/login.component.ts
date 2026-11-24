import { Component, inject, signal } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormComponent } from '../components/form/form.component';
import { GoogleButtonComponent } from '../components/google-button/google-button.component';
import { AuthService } from '../services/auth.service';
import { Login, User } from 'src/interfaces/users';
import { HttpResponse } from 'src/interfaces/http-response';
import { catchError, take } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Forms } from 'src/interfaces/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormComponent, RouterLink, GoogleButtonComponent]
})
export class LoginComponent {
  isLoading = signal(false);
  errors: string[] = []
  private authService = inject(AuthService);
  private router = inject(Router);

  loginFields: Forms[] = [
    { name: 'mail', label: 'Email', type: 'text', required: true },
    { name: 'password', label: 'Contraseña', type: 'password', required: true }
  ];

  onLogin(data: User) {
    this.errors = [];
    if (!data.mail || !data.password) {
      alert('Por favor, ingresa tu email y contraseña.');
      return;
    }

    this.isLoading.set(true);
    this.authService.login(data)
      .pipe(
        take(1),
        catchError((err) => {
          this.isLoading.set(false);
          this.errors = [err?.error?.message || 'Error de autenticación']
          return [];
        })
      )
      .subscribe(response => this.handleLoginResponse(response, 'Credenciales incorrectas'));
  }

  onGoogleLogin(credential: string) {
    this.errors = [];
    this.isLoading.set(true);
    this.authService.loginWithGoogle(credential)
      .pipe(
        take(1),
        catchError((err) => {
          this.isLoading.set(false);
          this.errors = [err?.error?.message || 'No se pudo iniciar sesión con Google'];
          return [];
        })
      )
      .subscribe(response => this.handleLoginResponse(response, 'No se pudo iniciar sesión con Google'));
  }

  private handleLoginResponse(response: HttpResponse<Login>, fallbackError: string) {
    this.isLoading.set(false);
    if (response && response.data?.access_token) {
      this.errors = [];
      this.authService.saveSession(response.data);
      this.router.navigate(["tabs", "home"]);
    } else {
      this.errors = [response?.message || fallbackError];
    }
  }
}
