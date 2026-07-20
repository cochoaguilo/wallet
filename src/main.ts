import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app/app.component';
import { AuthInterceptorService } from './app/services/auth-interceptor.service';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module'

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));

/*   bootstrapApplication(AppModule, {
  providers: [provideCharts(withDefaultRegisterables())],
}).catch((err) => console.error(err)); */