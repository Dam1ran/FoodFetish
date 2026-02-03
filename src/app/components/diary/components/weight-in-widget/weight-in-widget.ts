import { Component, computed, inject, input } from '@angular/core';
import dayjs from 'dayjs';
import { DiaryLogService } from '../../../../shared/services/diary-log.service';
import { IconifyComponent } from '../../../../shared/components/iconify.component';
import { OptionsService } from '../../../../shared/services/options/options.service';

@Component({
  selector: 'weight-in-widget',
  imports: [IconifyComponent],
  templateUrl: './weight-in-widget.html',
  styleUrl: './weight-in-widget.scss',
})
export class WeightInWidget {
  protected readonly Math = Math;

  protected readonly diaryLogService = inject(DiaryLogService);
  protected readonly optionsService = inject(OptionsService);
  readonly isoDate = input('');

  weights() {
    if (!this.isoDate()) {
      return [];
    }

    return this.diaryLogService.getWeights(this.isoDate(), 11);
  }

  weightsMax = computed(() => Math.max(...this.weights()));
  weightsMin = computed(() => Math.min(...this.weights()));
  weightsRange = computed(() => this.weightsMax() - this.weightsMin());

  weightInputDisabled() {
    return dayjs().utc().startOf('day').isBefore(dayjs(this.isoDate()).utc());
  }
}
