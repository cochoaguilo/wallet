import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormComponent } from '../components/form/form.component';
import { AuthService } from '../services/auth.service';
import { User } from 'src/interfaces/users';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [IonicModule, FormComponent]
})
export class LoginComponent implements OnDestroy{

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  private subscriptions: Subscription[] = [];
  loginFields = [
    { name: 'email', label: 'Email', type: 'text', required: true },
    { name: 'password', label: 'Contraseña', type: 'password', required: true }
  ];

  onLogin(data: User) {
    this.subscriptions.push(
      this.authService.login(data)
      .subscribe(data => {
        if (data) {
          sessionStorage.setItem("TOKEN", data.access_token);
          this.router.navigate(["tabs", "home"]);
        }
      })
    )
    
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }

}
