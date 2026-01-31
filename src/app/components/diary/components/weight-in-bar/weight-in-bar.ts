import { Component, computed, inject, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import dayjs from 'dayjs';
import { DiaryLogService } from '../../../../shared/services/diary-log.service';
import { IconifyComponent } from '../../../../shared/components/iconify.component';
import { OptionsService } from '../../../../shared/services/options/options.service';

@Component({
  selector: 'weight-in-bar',
  imports: [IconifyComponent, DatePipe],
  templateUrl: './weight-in-bar.html',
  styles: `
    input {
      color: var(--bs-info-text-emphasis);
    }
    ::placeholder {
      color: var(--bs-info-text-emphasis);
      font-style: italic;
      opacity: 0.4;
    }
  `,
})
export class WeightInBar {
  Math = Math;

  protected readonly diaryLogService = inject(DiaryLogService);
  protected readonly optionsService = inject(OptionsService);
  readonly isoDate = input('');

  weights() {
    if (!this.isoDate()) {
      return [];
    }

    return this.diaryLogService.getWeights(
      this.isoDate(),
      this.optionsService.options().weightFormulaBackDays,
    );
  }

  weightsMax = computed(() => Math.max(...this.weights()));
  weightsMin = computed(() => Math.min(...this.weights()));
  weightsRange = computed(() => this.weightsMax() - this.weightsMin());

  weightInputDisabled() {
    return dayjs().utc().startOf('day').isBefore(dayjs(this.isoDate()).utc());
  }
}
