import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';

import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS, withInterceptors } from '@angular/common/http';
import { HttpLogInterceptor } from './services/http-log-interceptor';
import { authInterceptor } from './services/authInteceptorFn';



export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authInterceptor])),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpLogInterceptor,
      multi: true,
    },
  ]
};
