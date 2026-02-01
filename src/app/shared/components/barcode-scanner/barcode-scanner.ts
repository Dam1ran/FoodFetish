/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, model, signal, viewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BarcodeFormat } from '@zxing/library';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'barcode-scanner',
  imports: [ZXingScannerModule, FormsModule],
  templateUrl: './barcode-scanner.html',
  styleUrl: './barcode-scanner.scss',
})
export class BarcodeScanner implements OnDestroy {
  protected readonly activeModal = inject(NgbActiveModal);
  formats = [BarcodeFormat.EAN_13];
  isScanning = signal(true);

  protected readonly codeInputRef = viewChild<ElementRef<HTMLInputElement>>('codeInput');

  code = model<string>('');
  onCodeResult(code: string) {
    this.code.set(code);
    this.isScanning.set(false);
    this.activeModal.close(this.code());
  }

  ngOnDestroy() {
    if (navigator.mediaDevices && (navigator.mediaDevices as any).stop) {
      (navigator.mediaDevices as any).stop();
    }
  }
}
