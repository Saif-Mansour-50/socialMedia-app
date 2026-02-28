import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import {
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  ApplicationConfig,
} from '@angular/core';

import { headerInterceptor } from './core/interceptors/header/header-interceptor';
import { erorrInterceptor } from './core/interceptors/erorr/erorr-interceptor';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch(), withInterceptors([headerInterceptor, erorrInterceptor])),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
  ],
};
