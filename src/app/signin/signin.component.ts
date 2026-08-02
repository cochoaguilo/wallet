import { Component, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormComponent } from '../components/form/form.component';
import { AuthService } from '../services/auth.service';
import { User } from 'src/interfaces/users';
import { catchError, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Forms } from 'src/interfaces/forms';
import { themeColor } from '../components/notification/notification.component';
import { ToastController } from '@ionic/angular';

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
  public toastMessage = signal('');
  public colorType: themeColor ="primary";

  //@ViewChild(NotificationComponent) notificationComponent!: NotificationComponent;

  constructor(private toastController: ToastController) {}
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
      this.authService.register(data).pipe(
        catchError(() => this.mostrarToast("Error al crear el usuario", "danger")) 
      )
      .subscribe(async data => {
        if(data?.success) {
          await this.mostrarToast("Usuario creado con exito", "success")
          setTimeout(() => {
            this.router.navigate(["log-in"]);
          }, 2000);
        } else await this.mostrarToast("Error al crear el usuario", "danger")
      })
    )
  }

  async mostrarToast(message:string, color: themeColor) {
    
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'bottom', // 'top' | 'middle' | 'bottom'
      color: color,   // 'primary' | 'danger' | 'warning' | etc.
    });

    await toast.present();
  }


  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }

}
