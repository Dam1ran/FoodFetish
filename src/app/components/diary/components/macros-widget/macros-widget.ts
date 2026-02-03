import { Component, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DiaryLogService } from '../../../../shared/services/diary-log.service';
import { OptionsService } from '../../../../shared/services/options/options.service';
import { Stats } from '../../../../shared/entities/stats.class';

@Component({
  selector: 'macros-widget',
  imports: [FormsModule],
  templateUrl: './macros-widget.html',
  styleUrl: './macros-widget.scss',
})
export class MacrosWidget {
  readonly isoDate = input('');
  readonly stats = input.required<Stats>();

  protected readonly diaryLogService = inject(DiaryLogService);
  protected readonly optionsService = inject(OptionsService);

  protected getProteinScrollbarBg(grams: number, weightKg: number) {
    if (!weightKg) {
      return 'rgba(120, 120, 120, 0.5)';
    }
    const minMidThresholdGr = weightKg * 1.5;
    const maxMidThresholdGr = weightKg * 2.5;
    const minMedThresholdGr = weightKg * 0.8;
    const maxMedThresholdGr = weightKg * 3.2;

    if (grams >= minMidThresholdGr && grams <= maxMidThresholdGr) {
      return 'rgba(60, 160, 70, 0.6)';
    } else if (grams >= minMedThresholdGr && grams <= maxMedThresholdGr) {
      return 'rgba(180, 150, 50, 0.6)';
    } else {
      return 'rgba(220, 140, 40, 0.5)';
    }
  }

  protected getCarbScrollbarBg(grams: number, weightKg: number) {
    if (!weightKg) {
      return 'rgba(120, 120, 120, 0.5)';
    }
    const minMidThresholdGr = weightKg * 1.6;
    const maxMidThresholdGr = weightKg * 3.2;
    const minMedThresholdGr = weightKg * 0.7;
    const maxMedThresholdGr = weightKg * 3.7;

    if (grams >= minMidThresholdGr && grams <= maxMidThresholdGr) {
      return 'rgba(60, 160, 70, 0.6)';
    } else if (grams >= minMedThresholdGr && grams <= maxMedThresholdGr) {
      return 'rgba(180, 150, 50, 0.6)';
    } else {
      return 'rgba(220, 140, 40, 0.5)';
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
      return 'rgba(60, 160, 70, 0.6)';
    } else if (grams >= minMedThresholdGr && grams <= maxMedThresholdGr) {
      return 'rgba(180, 150, 50, 0.6)';
    } else {
      return 'rgba(220, 140, 40, 0.5)';
    }
  }

  protected getKCalScrollbarBg(calories: number, weightKg: number) {
    if (!weightKg) {
      return 'rgba(120, 120, 120, 0.5)';
    }
    const minMidThresholdCalories = weightKg * 25;
    const maxMidThresholdCalories = weightKg * 30;
    const minMedThresholdCalories = weightKg * 18;
    const maxMedThresholdCalories = weightKg * 37;

    if (calories >= minMidThresholdCalories && calories <= maxMidThresholdCalories) {
      return 'rgba(60, 160, 70, 0.6)';
    } else if (calories >= minMedThresholdCalories && calories <= maxMedThresholdCalories) {
      return 'rgba(180, 150, 50, 0.6)';
    } else {
      return 'rgba(220, 140, 40, 0.5)';
    }
  }

  protected darkenColor(rgbaColor: string): string {
    const match = rgbaColor.match(/\d+/g);
    if (!match || match.length < 3) return rgbaColor;

    const r = Math.max(0, parseInt(match[0]) - 50);
    const g = Math.max(0, parseInt(match[1]) - 50);
    const b = Math.max(0, parseInt(match[2]) - 50);
    const a = match[3] ? parseInt(match[3]) / 255 : 1;

    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }
}
