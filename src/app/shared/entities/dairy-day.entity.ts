import { DayTemplate } from './day-template.entity';

export class DairyDay {
  constructor(
    public date: string,
    public dayTemplate = new DayTemplate(),
  ) {}
}
