import { DayTemplate } from './day-template.entity';

export class DiaryDay {
  constructor(
    public date: string,
    public dayTemplate = new DayTemplate(),
  ) {}
}
