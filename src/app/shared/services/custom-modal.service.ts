import { Injectable } from '@angular/core';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Injectable({ providedIn: 'root' })
export class CustomModalService extends NgbModal {
  override open(content: unknown, options?: NgbModalOptions): NgbModalRef {
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement) {
      activeElement.blur();
    }

    return super.open(content, options);
  }
}
