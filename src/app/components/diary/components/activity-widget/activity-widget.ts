import { Component, inject, input } from '@angular/core';
import { NgbTimepicker } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ButtonIconDirective } from '../../../../shared/directives/button-icon.directive';
import { DiaryLogService } from '../../../../shared/services/diary-log.service';
import { ActivityType, ActivityTypeIconMap } from '../../../../shared/entities/activity.entity';
import { IconifyComponent } from '../../../../shared/components/iconify.component';

@Component({
  selector: 'activity-widget',
  imports: [ButtonIconDirective, NgbTimepicker, FormsModule, IconifyComponent],
  templateUrl: './activity-widget.html',
})
export class ActivityWidget {
  protected readonly diaryLogService = inject(DiaryLogService);

  readonly isoDate = input('');

  readonly activityTypeIconMap = ActivityTypeIconMap;
  protected readonly activitiesTypes = Object.keys(ActivityType)
    .filter((value) => !isNaN(Number(value)))
    .map((value) => ({
      label: ActivityType[value as keyof typeof ActivityType],
      value: +value as ActivityType,
    }));
}
