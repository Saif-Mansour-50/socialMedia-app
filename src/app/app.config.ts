import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import {
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  ApplicationConfig,
  importProvidersFrom,
} from '@angular/core';

import { headerInterceptor } from './core/interceptors/header/header-interceptor';
import { erorrInterceptor } from './core/interceptors/erorr/erorr-interceptor';
import { routes } from './app.routes';
import { loadingInterceptor } from './core/interceptors/Loading/loading-interceptor';

import { provideAnimations } from '@angular/platform-browser/animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { provideToastr } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withFetch(),
      withInterceptors([headerInterceptor, erorrInterceptor, loadingInterceptor]),
    ),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideToastr(),
    importProvidersFrom(BrowserAnimationsModule, NgxSpinnerModule),
  ],
};
