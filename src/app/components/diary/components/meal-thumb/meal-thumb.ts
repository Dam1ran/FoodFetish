import {
  booleanAttribute,
  ChangeDetectorRef,
  Component,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { ImageStoreService } from '../../../../shared/services/image-store.service';
import { IconifyComponent } from '../../../../shared/components/iconify.component';
import { DiaryLogService } from '../../../../shared/services/diary-log.service';

@Component({
  selector: 'meal-thumb',
  imports: [IconifyComponent],
  template: `
    @if (imageDataUrl()) {
      <div class="d-flex justify-content-center">
        <img
          [width]="stretched() ? 320 : 160"
          [height]="stretched() ? 160 : 160"
          [src]="imageDataUrl()"
          alt="meal thumb"
          style="object-fit: cover;"
          [style]="{
            filter: stretched() ? 'blur(4px) grayscale(25%)' : 'unset',
            opacity: stretched() ? 0.2 : 1,
          }"
        />
      </div>
    } @else if (!stretched()) {
      <div
        class="d-flex justify-content-center align-items-center"
        style="width: 160px; height: 160px;"
      >
        <iconify class="opacity-50" icon="streamline:broken-link-2" />
      </div>
    }
  `,
})
export class MealThumb {
  readonly imageId = input.required<string>();
  readonly stretched = input(false, { transform: booleanAttribute });

  private readonly imageStoreService = inject(ImageStoreService);
  protected readonly imageDataUrl = signal<string | null>(null);
  protected readonly diaryLogService = inject(DiaryLogService);
  readonly deleteChange = output<string>();
  private readonly cdr = inject(ChangeDetectorRef);

  constructor() {
    effect(() => {
      const imageId = this.imageId();
      if (imageId) {
        void this.imageStoreService.get(imageId).then((dataUrl) => {
          this.imageDataUrl.set(dataUrl);
          if (!dataUrl) {
            this.deleteChange.emit(imageId);
            this.cdr.detectChanges();
          }
        });
      } else {
        this.imageDataUrl.set(null);
      }
    });
  }
}
