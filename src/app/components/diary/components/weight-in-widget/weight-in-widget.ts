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

  protected readonly weightsMax = computed(() => Math.max(...this.weights()));
  protected readonly weightsMin = computed(() => Math.min(...this.weights()));
  protected readonly weightsRange = computed(() => this.weightsMax() - this.weightsMin());

  weightInputDisabled() {
    return dayjs().utc().startOf('day').isBefore(dayjs(this.isoDate()).utc());
  }

  calories() {
    if (!this.isoDate()) {
      return [];
    }

    return this.diaryLogService.getCalories(this.isoDate(), 11);
  }

  protected readonly caloriesMax = computed(() => Math.max(...this.calories()));
  protected readonly caloriesMin = computed(() => Math.min(...this.calories()));
  protected readonly caloriesRange = computed(() => this.caloriesMax() - this.caloriesMin());
}
