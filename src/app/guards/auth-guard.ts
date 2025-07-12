import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = sessionStorage.getItem('TOKEN');
    // Si no hay token, redirige al login
    if (!token) {
      this.router.navigate(['/log-in']);
      return false;
    }
    // Si tienes expiración, verifica aquí (ejemplo simple)
    const exp = sessionStorage.getItem('TOKEN_EXP');
    if (exp && Date.now() > Number(exp)) {
      sessionStorage.clear();
      this.router.navigate(['/log-in']);
      return false;
    }
    return true;
  }
}