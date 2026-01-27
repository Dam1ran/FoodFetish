import { Injectable, signal } from '@angular/core';
import { DairyLog } from '../entities/dairy-log.entity';
import { Dayjs } from 'dayjs';
import { DairyDay } from '../entities/dairy-day.entity';
import { DayTemplate, DayTemplateEntry } from '../entities/day-template.entity';
import { Meal } from '../entities/meal.entity';
import { v7 } from 'uuid';
import { FoodMacroCategory } from '../entities/food-macro-category.enum';
import { MealPosition, MealPositionMap } from '../entities/meal-position.enum';
import { Food } from '../entities/food.entity';

@Injectable({ providedIn: 'root' })
export class DairyLogService {
  readonly dairyLog = signal<DairyLog | undefined>(undefined);

  constructor() {
    this.setDairyLog();
    this.loadDairyLog();
  }

  private setDairyLog() {
    const dairyLogRaw = localStorage.getItem('dairyLog');
    if (!dairyLogRaw) {
      const dairyLog = new DairyLog();
      localStorage.setItem('dairyLog', JSON.stringify(dairyLog));
    }
  }

  private loadDairyLog() {
    this.dairyLog.set(JSON.parse(localStorage.getItem('dairyLog')!));
  }

  getRespectiveMeal(isoDate: string, mealPosition: MealPosition) {
    return this.dairyLog()
      ?.dairyDays.find((day) => day.date === isoDate)
      ?.dayTemplate.entries.find((entry) => entry.position === mealPosition)?.meal;
  }

  addFood(isoDate: string, mealPosition: MealPosition, food: Food) {
    food = { ...food };
    mealPosition = Number(mealPosition);
    this.dairyLog.update((dairyLog) => {
      const dairyLogCopy = { ...dairyLog! };

      let respectiveDay = dairyLogCopy.dairyDays.find((day) => day.date === isoDate);
      if (!respectiveDay) {
        const newDay = new DairyDay(isoDate, new DayTemplate());
        dairyLogCopy.dairyDays.push(newDay);
        respectiveDay = newDay;
      }

      let respectiveEntry = respectiveDay.dayTemplate.entries.find(
        (entry) => entry.position === mealPosition,
      );

      if (!respectiveEntry) {
        respectiveEntry = new DayTemplateEntry(
          mealPosition,
          new Meal(v7(), MealPositionMap[mealPosition], [food]),
        );

        respectiveDay.dayTemplate.entries.push(respectiveEntry);
      } else {
        respectiveEntry.meal.foods.push(food);
      }

      return dairyLogCopy;
    });

    this.saveDairyLog();
  }

  saveDairyLog() {
    localStorage.setItem(
      'dairyLog',
      JSON.stringify(this.dairyLog(), (key, value) => {
        if (key === 'position' && typeof value === 'string') {
          return MealPosition[value as keyof typeof MealPosition];
        }
        return value;
      }),
    );
  }

  updateMealName(isoDate: string, mealPosition: MealPosition, value: string) {
    this.dairyLog.update((dairyLog) => {
      const dairyLogCopy = { ...dairyLog! };

      const respectiveDay = dairyLogCopy.dairyDays.find((day) => day.date === isoDate);
      if (!respectiveDay) {
        return dairyLog;
      }

      const respectiveEntry = respectiveDay.dayTemplate.entries.find(
        (entry) => entry.position === mealPosition,
      );
      if (!respectiveEntry) {
        return dairyLog;
      }

      respectiveEntry.meal.name = value;

      return dairyLogCopy;
    });

    this.saveDairyLog();
  }

  removeFood(isoDate: string, mealPosition: MealPosition, foodIndex: number) {
    this.dairyLog.update((dairyLog) => {
      const dairyLogCopy = { ...dairyLog! };

      const respectiveDay = dairyLogCopy.dairyDays.find((day) => day.date === isoDate);
      if (!respectiveDay) {
        return dairyLog;
      }

      const respectiveEntry = respectiveDay.dayTemplate.entries.find(
        (entry) => entry.position === mealPosition,
      );
      if (!respectiveEntry) {
        return dairyLog;
      }

      respectiveEntry.meal.foods = respectiveEntry.meal.foods.filter(
        (_, index) => index !== foodIndex,
      );

      return dairyLogCopy;
    });

    this.saveDairyLog();
  }

  clearMeal(isoDate: string, mealPosition: MealPosition) {
    this.dairyLog.update((dairyLog) => {
      const dairyLogCopy = { ...dairyLog! };

      const respectiveDay = dairyLogCopy.dairyDays.find((day) => day.date === isoDate);
      if (!respectiveDay) {
        return dairyLog;
      }

      const respectiveEntry = respectiveDay.dayTemplate.entries.find(
        (entry) => entry.position === mealPosition,
      );
      if (!respectiveEntry) {
        return dairyLog;
      }

      respectiveDay.dayTemplate.entries = respectiveDay.dayTemplate.entries.filter(
        (entry) => entry.position !== mealPosition,
      );

      return dairyLogCopy;
    });

    this.saveDairyLog();
  }

  updateFoodWeight(isoDate: string, mealPosition: MealPosition, foodIndex: number, weight: number) {
    this.dairyLog.update((dairyLog) => {
      const dairyLogCopy = { ...dairyLog! };

      const respectiveDay = dairyLogCopy.dairyDays.find((day) => day.date === isoDate);
      if (!respectiveDay) {
        return dairyLog;
      }

      const respectiveEntry = respectiveDay.dayTemplate.entries.find(
        (entry) => entry.position === mealPosition,
      );

      if (!respectiveEntry) {
        return dairyLog;
      }

      respectiveEntry.meal.foods[foodIndex].weight = Number(weight);

      return dairyLogCopy;
    });

    this.saveDairyLog();
  }

  getDayStats(isoDate: string) {
    const respectiveDay = this.dairyLog()?.dairyDays.find((day) => day.date === isoDate);
    const emptyStats = {
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      calories: 0,
      weight: 0,
    };
    if (!respectiveDay) {
      return emptyStats;
    }

    return respectiveDay.dayTemplate.entries.reduce((acc, entry) => {
      return {
        protein:
          acc.protein +
          entry.meal.foods.reduce((acc, food) => acc + food.protein * food.weight * 0.01, 0),
        carbs:
          acc.carbs +
          entry.meal.foods.reduce((acc, food) => acc + food.carbs * food.weight * 0.01, 0),
        fat:
          acc.fat + entry.meal.foods.reduce((acc, food) => acc + food.fats * food.weight * 0.01, 0),
        fiber:
          acc.fiber +
          entry.meal.foods.reduce((acc, food) => acc + food.fiber * food.weight * 0.01, 0),
        calories:
          acc.calories +
          entry.meal.foods.reduce((acc, food) => acc + food.calories * food.weight * 0.01, 0),
        weight: acc.weight + entry.meal.foods.reduce((acc, food) => acc + food.weight, 0),
      };
    }, emptyStats);
  }

  updateMealNote(isoDate: string, mealPosition: MealPosition, mealId: string, note: string) {
    this.dairyLog.update((dairyLog) => {
      const dairyLogCopy = { ...dairyLog! };

      const respectiveDay = dairyLogCopy.dairyDays.find((day) => day.date === isoDate);
      if (!respectiveDay) {
        return dairyLog;
      }

      const respectiveEntry = respectiveDay.dayTemplate.entries.find(
        (entry) => entry.meal.id === mealId,
      );

      if (!respectiveEntry) {
        return dairyLog;
      }

      respectiveEntry.meal.note = note;

      return dairyLogCopy;
    });

    this.saveDairyLog();
  }
}
