import { Injectable, signal } from '@angular/core';
import { DayTemplate } from '../entities/day-template.entity';
import { Meal } from '../entities/meal.entity';

@Injectable({ providedIn: 'root' })
export class DayTemplateService {
  readonly dayTemplate = signal<DayTemplate | undefined>(undefined);

  constructor() {
    this.setTemplate();
    this.loadDayTemplate();
  }

  private setTemplate() {
    const dayTemplateRaw = localStorage.getItem('dayTemplate');
    if (!dayTemplateRaw) {
      const dayTemplate = new DayTemplate();

      dayTemplate.entries.push({
        position: 1,
        meal: new Meal('', 'Meal I'),
      });
      dayTemplate.entries.push({
        position: 2,
        meal: new Meal('', 'Meal II'),
      });
      dayTemplate.entries.push({
        position: 3,
        meal: new Meal('', 'Meal III'),
      });
      dayTemplate.entries.push({
        position: 4,
        meal: new Meal('', 'Meal IV'),
      });
      dayTemplate.entries.push({
        position: 5,
        meal: new Meal('', 'Snacks'),
      });

      localStorage.setItem('dayTemplate', JSON.stringify(dayTemplate));
    }
  }

  private loadDayTemplate() {
    this.dayTemplate.set(JSON.parse(localStorage.getItem('dayTemplate')));
  }

  getDayTemplate() {
    return this.dayTemplate();
  }
}
