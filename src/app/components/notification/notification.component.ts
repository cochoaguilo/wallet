import { Component, input, OnInit } from '@angular/core';
import { IonToast } from '@ionic/angular/standalone';
export type themeColor ="danger" | "dark" | "light" | "medium" | "primary" | "secondary" | "success" | "tertiary" | "warning" | string | undefined
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  imports: [IonToast]
})
export class NotificationComponent {

  message = input.required<string>();
  duration = input<number>(5000);
  colorType = input<themeColor>("primary")

  isToastOpen = false;

  setOpen(isOpen: boolean) {    
    this.isToastOpen = isOpen;
  }
}
