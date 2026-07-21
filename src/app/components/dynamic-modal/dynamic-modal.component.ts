import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-dynamic-modal',
  templateUrl: './dynamic-modal.component.html',
  styleUrls: ['./dynamic-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class DynamicModalComponent  {

  constructor() { }
  @Input() show = false;
  @Input() title = '';
  @Input() template!: TemplateRef<any>;
  footerButton = input(false);
  @Output() aceptar = new EventEmitter<void>();
  @Output() cerrar = new EventEmitter<void>();

  onAceptar() {
    this.aceptar.emit();
  }

  onCerrar() {
    this.cerrar.emit();
  }

}
