import { NgTemplateOutlet, TitleCasePipe } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, TemplateRef } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastsService } from '../services/toasts.service';

export type ToastType = 'error' | 'warning' | 'success' | 'information';

export interface Toast {
  id?: string;
  headerText?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  textOrTpl: string | TemplateRef<any>;
  delayMs?: number;
  autoHide?: boolean;
  isClearIgnored?: boolean;
  toastType?: ToastType;
  className?: string;
  persistent?: boolean;
}

@Component({
  selector: 'toasts',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [NgbModule, NgTemplateOutlet, TitleCasePipe],
  template: `
    <div
      [style]="{
        position: 'fixed',
        bottom: 0,
        right: 0,
        margin: '0.25rem',
        zIndex: 1300,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
      }"
    >
      @for (toast of toastsService.toasts(); track toast.id) {
        @if (toast.persistent) {
          <ngb-toast
            [header]="toast?.headerText | titlecase"
            [class]="toast?.className"
            [autohide]="toast.autoHide ?? true"
            [delay]="toast.delayMs || 5000"
            (hide)="toastsService.remove(toast)"
            (hidden)="toastsService.remove(toast)"
            [attr.persistent]="toast.persistent ?? false"
          >
            @if (isTemplate(toast)) {
              <ng-template [ngTemplateOutlet]="toast.textOrTpl" />
            } @else {
              {{ toast.textOrTpl }}
            }
          </ngb-toast>
        }
      }
    </div>
    <div
      [style]="{
        position: 'fixed',
        top: 0,
        right: 0,
        margin: '0.5rem',
        zIndex: 1200,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
      }"
    >
      @for (toast of toastsService.toasts(); track toast.id) {
        @if (!toast.persistent) {
          <ngb-toast
            [header]="toast?.headerText | titlecase"
            [class]="toast?.className"
            [autohide]="toast.autoHide ?? true"
            [delay]="toast.delayMs || 3000"
            (hidden)="toastsService.remove(toast)"
            [attr.persistent]="toast.persistent ?? false"
          >
            @if (isTemplate(toast)) {
              <ng-template [ngTemplateOutlet]="toast.textOrTpl" />
            } @else {
              {{ toast.textOrTpl }}
            }
          </ngb-toast>
        }
      }
    </div>
  `,
})
export class ToastsComponent {
  protected readonly toastsService = inject(ToastsService);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected isTemplate(toast): toast is { textOrTpl: TemplateRef<any> } {
    return toast.textOrTpl instanceof TemplateRef;
  }
}
