import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormComponent } from '../components/form/form.component';
import { AuthService } from '../services/auth.service';
import { User } from 'src/interfaces/users';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Forms } from 'src/interfaces/forms';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
  standalone: true,
  imports: [IonicModule, FormComponent]
})
export class SigninComponent implements OnDestroy{

  private subscriptions: Subscription[] = [];
  authService = inject(AuthService);
  router = inject(Router);

  constructor() {}
  registerFields: Forms[] = [
    { name: 'name', label: 'Nombre', type: 'text', required: true},
    { name: 'mail', label: 'Email', type: 'text', required: true },
    { name: 'password', label: 'Contraseña', type: 'password', required: true },
    { name: 'confirmPassword', label: 'Confirmar contraseña', type: 'password', required: true }
  ];

  async onRegister(data: User) {
    if (data.password !== data.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    this.subscriptions.push(
      this.authService.register(data)
      .subscribe(data => {
        if(data.success) {
          alert(`Usuario ${data.data?.name} registrado correctamente`)
          setTimeout(() => {
            this.router.navigate(["log-in"]);
          }, 1000);
        }
      })
    )
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }

}
