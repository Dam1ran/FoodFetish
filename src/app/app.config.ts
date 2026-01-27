import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withRouterConfig,
  withViewTransitions,
} from '@angular/router';
import { routes } from './shared/routes/app.routes';
import { CustomModalService } from './shared/services/custom-modal.service';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: NgbModal, useClass: CustomModalService },
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withRouterConfig({
        canceledNavigationResolution: 'computed',
        paramsInheritanceStrategy: 'always',
      }),
      withViewTransitions(),
      withInMemoryScrolling(),
      withComponentInputBinding(),
    ),
  ],
};
