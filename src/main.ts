/// <reference types="@angular/localize" />

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

  // main.ts
if (typeof global !== 'undefined' && typeof self === 'undefined') {
  (global as any).self = global;
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
