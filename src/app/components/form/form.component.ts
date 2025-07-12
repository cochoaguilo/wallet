import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
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

  @Input() fields: any[] = [];
  @Input() errors!: string[];
  @Output() submitForm = new EventEmitter<any>()
  @Output() cancelar = new EventEmitter<void>();

  categoriaForm: FormGroup= this.fb.group({});;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    const group: any = {};
    this.fields.forEach(field => {
      group[field.name] = field.required
        ? [field.default || '', Validators.required]
        : [field.default || ''];
    });
    this.categoriaForm = this.fb.group(group);
  }

  submit() {
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


