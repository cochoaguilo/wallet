import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Forms } from 'src/interfaces/forms';
import { Savings } from 'src/interfaces/savings';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class FormComponent implements OnInit {

  @Input() fields: Forms[] = [];
  @Input() errors!: string[];
  @Output() submitForm = new EventEmitter<any>()
  @Output() cancelar = new EventEmitter<void>();

  
  private fb = inject(FormBuilder);
  categoriaForm: FormGroup= this.fb.group({});;
  constructor() {}

  ngOnInit() {
    const group: any = {};
    this.fields.forEach(field => {
      
      group[field.name] = [field.type == 'text' ?  '' :  null, field.required && Validators.required]/* field.required
        ? [field.default || '', Validators.required]
        : [field.default || '']; */
    });
    console.log('Formulario generado:', group);
    this.categoriaForm = this.fb.group(group);
  }

  submit() {
    console.log('Formulario enviado:', this.categoriaForm.value);
    if (this.categoriaForm.valid) {
      this.submitForm.emit(this.categoriaForm.value);
      this.categoriaForm.reset();
    }
  }

  onCancel() {
    this.categoriaForm.reset();
    this.cancelar.emit();
  }

}


