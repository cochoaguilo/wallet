import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SlidesComponent } from './slides.component';

describe('SlidesComponent', () => {
  let component: SlidesComponent;
  let fixture: ComponentFixture<SlidesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), SlidesComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(SlidesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should accept slides from the parent component', () => {
    component.slides = [{ title: 'Demo', description: 'Contenido de prueba' }];
    fixture.detectChanges();

    expect(component.slides.length).toBe(1);
  });
});
