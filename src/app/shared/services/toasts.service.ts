import { Injectable, signal } from '@angular/core';
import { v7 } from 'uuid';
import { Toast, ToastType } from '../components/toasts.component';

export type TextOrTpl = Toast['textOrTpl'];
export type ToastOptions = Omit<Toast, 'textOrTpl'>;

@Injectable({ providedIn: 'root' })
export class ToastsService {
  readonly toasts = signal<Toast[]>([]);

  private readonly toastMessageTypeDefinitions: Record<ToastType, { className: string }> = {
    error: {
      className: 'bg-danger-subtle',
    },
    warning: {
      className: 'bg-warning-subtle',
    },
    success: {
      className: 'bg-success-subtle',
    },
    information: {
      className: 'bg-info-subtle',
    },
  } as const;

  showAsError(textOrTpl: TextOrTpl, options?: ToastOptions) {
    this.show({
      id: v7(),
      textOrTpl,
      toastType: 'error',
      ...options,
    });
  }

  showAsWarning(textOrTpl: TextOrTpl, options?: ToastOptions) {
    this.show({
      id: v7(),
      textOrTpl,
      toastType: 'warning',
      ...options,
    });
  }

  showAsSuccess(textOrTpl: TextOrTpl, options?: ToastOptions) {
    this.show({
      id: v7(),
      textOrTpl,
      toastType: 'success',
      ...options,
    });
  }

  showAsInformation(textOrTpl: TextOrTpl, options?: ToastOptions) {
    this.show({
      id: v7(),
      textOrTpl,
      toastType: 'information',
      ...options,
    });
  }

  show(toast: Toast) {
    if (!toast.textOrTpl) {
      return;
    }

    const toastType = toast.toastType ?? 'information';
    this.toasts.update((toasts) => [
      ...toasts,
      {
        id: v7(),
        className: this.toastMessageTypeDefinitions[toastType].className,
        headerText: toastType,
        ...toast,
      },
    ]);
  }

  remove(toast: Toast) {
    this.toasts.update((toasts) => toasts.filter((t) => t !== toast));
  }

  clear() {
    this.toasts.update((toasts) => toasts.filter((t) => t?.isClearIgnored));
  }
}
