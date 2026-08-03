import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, input, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Forms } from 'src/interfaces/forms';

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
export class FormComponent implements OnInit, OnChanges {

  @Input() fields: Forms[] = [];
  @Input() errors!: string[];
  @Input() includeId = true;
  @Input() idValue: number | null = null;
  @Input() initialData: Record<string, any> | null = null;
  defaultButton = input(true);
  submitText = input("Guardar")
  @Output() submitForm = new EventEmitter<any>()
  @Output() cancelar = new EventEmitter<void>();

  
  private fb = inject(FormBuilder);
  categoriaForm: FormGroup= this.fb.group({});;
  constructor() {}

  ngOnInit() {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.categoriaForm) {
      this.buildForm();
      return;
    }

    if (changes['idValue'] && this.categoriaForm.get('id')) {
      this.categoriaForm.get('id')?.setValue(this.idValue ?? null);
    }

    if (changes['initialData'] || changes['fields']) {
      this.patchFormValues(this.initialData);
    }
  }

  private buildForm(): void {
    const group: any = {};
    this.fields.forEach(field => {
      group[field.name] = [field.type == 'text' ? '' : null, field.required && Validators.required];
    });

    group.id = [this.idValue ?? null];
    this.categoriaForm = this.fb.group(group);
    this.patchFormValues(this.initialData);
  }

  private patchFormValues(data: Record<string, any> | null): void {
    if (!this.categoriaForm) return;

    const values = data ?? {};

    if (this.categoriaForm.get('id')) {
      this.categoriaForm.get('id')?.setValue(values['id'] ?? this.idValue ?? null);
    }

    this.fields.forEach(field => {
      const control = this.categoriaForm.get(field.name);
      if (!control) return;

      const value = values[field.name];
      control.setValue(value ?? (field.type === 'text' ? '' : null));
    });
  }

  submit() {
    if (this.categoriaForm.valid) {
      const formValue = { ...this.categoriaForm.value };
      const hiddenId = this.categoriaForm.get('id')?.value;

      if (this.includeId && (hiddenId ?? this.idValue) !== null) {
        formValue.id = hiddenId ?? this.idValue;
      } else {
        delete formValue.id;
      }
      
      this.submitForm.emit(formValue);
      this.categoriaForm.reset();
    }
  }

  onCancel() {
    this.categoriaForm.reset();
    this.cancelar.emit();
  }

}


