import { Injectable, signal } from '@angular/core';
import { DayTemplate } from '../entities/day-template.entity';
import { Meal } from '../entities/meal.entity';
import { MealPosition, MealPositionMap } from '../entities/meal-position.enum';

@Injectable({ providedIn: 'root' })
export class DayTemplateService {
  readonly dayTemplate = signal<DayTemplate | undefined>(undefined);

  constructor() {
    this.setTemplate();
  }

  private setTemplate() {
    localStorage.removeItem('dayTemplate');

    const mealPositions = Object.keys(MealPosition)
      .filter((value) => !isNaN(Number(value)))
      .map((value) => Number(value))
      .filter((value) => (value as unknown) !== MealPosition.None)
      .map((value) => ({
        label: MealPositionMap[value],
        value: +value as MealPosition,
      }));

    const dayTemplate = new DayTemplate();
    mealPositions.forEach((mp) => {
      dayTemplate.entries.push({
        position: mp.value,
        meal: new Meal('', mp.label),
        recipes: [],
      });
    });

    this.dayTemplate.set(dayTemplate);
  }

  getDayTemplate() {
    return this.dayTemplate();
  }
}
