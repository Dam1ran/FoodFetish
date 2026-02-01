import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

export class Activity {
  constructor(
    public time: NgbTimeStruct,
    public type = ActivityType.None,
    public durationMinutes = 15,
    public note?: string,
  ) {}
}

export enum ActivityType {
  None,
  Walk,
  Aerobics,
  Cardio,
  Sports,
  Workout,
  Other,
}

export const ActivityTypeIconMap: Record<ActivityType, { icon: string }> = {
  [ActivityType.None]: { icon: 'fluent:border-none-24-filled' },
  [ActivityType.Walk]: { icon: 'fa-solid:walking' },
  [ActivityType.Aerobics]: { icon: 'icon-park-solid:sport' },
  [ActivityType.Cardio]: { icon: 'tabler:run' },
  [ActivityType.Sports]: { icon: 'icon-park-solid:sporting' },
  [ActivityType.Workout]: { icon: 'streamline-plump:dumbell-solid' },
  [ActivityType.Other]: { icon: 'hugeicons:activity-01' },
};
