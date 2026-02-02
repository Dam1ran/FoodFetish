import { Component, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DiaryLogService } from '../../../../shared/services/diary-log.service';
import { OptionsService } from '../../../../shared/services/options/options.service';
import { Stats } from '../../../../shared/entities/stats.class';

@Component({
  selector: 'macros-widget',
  imports: [FormsModule],
  templateUrl: './macros-widget.html',
})
export class MacrosWidget {
  readonly isoDate = input('');
  readonly stats = input.required<Stats>();

  protected readonly diaryLogService = inject(DiaryLogService);
  protected readonly optionsService = inject(OptionsService);

  protected getProteinScrollbarBg(grams: number, weightKg: number) {
    if (!weightKg) {
      return 'rgba(120, 120, 120, 0.5)'
    }
    const minMidThresholdGr = weightKg * 1.5;
    const maxMidThresholdGr = weightKg * 2.5;
    const minMedThresholdGr = weightKg * 0.8;
    const maxMedThresholdGr = weightKg * 3.2;

    if (grams >= minMidThresholdGr && grams <= maxMidThresholdGr) {
      return 'rgba(70, 170, 100, 0.6)';
    } else if (grams >= minMedThresholdGr && grams <= maxMedThresholdGr) {
      return 'rgba(180, 150, 50, 0.6)';
    } else {
      return 'rgba(240, 120, 20, 0.5)';
    }
  }

  protected getCarbScrollbarBg(grams: number, weightKg: number) {
    if (!weightKg) {
      return 'rgba(120, 120, 120, 0.5)'
    }
    const minMidThresholdGr = weightKg * 1.6;
    const maxMidThresholdGr = weightKg * 3.2;
    const minMedThresholdGr = weightKg * 0.7;
    const maxMedThresholdGr = weightKg * 3.7;

    if (grams >= minMidThresholdGr && grams <= maxMidThresholdGr) {
      return 'rgba(70, 170, 100, 0.6)';
    } else if (grams >= minMedThresholdGr && grams <= maxMedThresholdGr) {
      return 'rgba(180, 150, 50, 0.6)';
    } else {
      return 'rgba(240, 120, 20, 0.5)';
    }
  }

  protected getFatScrollbarBg(grams: number, weightKg: number) {
    if (!weightKg) {
      return 'rgba(120, 120, 120, 0.5)';
    }
    const minMidThresholdGr = weightKg * 0.6;
    const maxMidThresholdGr = weightKg * 1.2;
    const minMedThresholdGr = weightKg * 0.4;
    const maxMedThresholdGr = weightKg * 1.4;

    if (grams >= minMidThresholdGr && grams <= maxMidThresholdGr) {
      return 'rgba(70, 170, 100, 0.6)';
    } else if (grams >= minMedThresholdGr && grams <= maxMedThresholdGr) {
      return 'rgba(180, 150, 50, 0.6)';
    } else {
      return 'rgba(240, 120, 20, 0.5)';
    }
  }
}
