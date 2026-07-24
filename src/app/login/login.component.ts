import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormComponent } from '../components/form/form.component';
import { AuthService } from '../services/auth.service';
import { User } from 'src/interfaces/users';
import { catchError, Subscription, take, tap } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Forms } from 'src/interfaces/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormComponent, RouterLink]
})
export class LoginComponent {
  isLoading = false;
  errors: string[] = []
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

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

    this.isLoading = true;
    this.authService.login(data)
      .pipe(
        take(1),
        catchError((err) => {
          this.isLoading = false;
          this.errors = [err?.error.message || 'Error de autenticación']
          return [];
        })
      )
      .subscribe(response => {
        this.isLoading = false;
        if (response && response.data?.access_token) {
          this.errors = [];
          const expiresIn = response.data.expires_in || 200;
          const expTimestamp = Date.now() + expiresIn * 1000;
          sessionStorage.setItem("TOKEN_EXP", expTimestamp.toString());
          sessionStorage.setItem("USER", JSON.stringify(response.data.user));
          sessionStorage.setItem("TOKEN", response.data.access_token);
          this.router.navigate(["tabs", "home"]);
        } else {
          this.errors = [response?.message || 'Credenciales incorrectas']
        }
      });

    
  }


}
