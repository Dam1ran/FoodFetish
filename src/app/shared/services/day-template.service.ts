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
        recipes: [],
      });
      dayTemplate.entries.push({
        position: 2,
        meal: new Meal('', 'Meal II'),
        recipes: [],
      });
      dayTemplate.entries.push({
        position: 3,
        meal: new Meal('', 'Meal III'),
        recipes: [],
      });
      dayTemplate.entries.push({
        position: 4,
        meal: new Meal('', 'Meal IV'),
        recipes: [],
      });
      dayTemplate.entries.push({
        position: 5,
        meal: new Meal('', 'Snacks'),
        recipes: [],
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
