/* eslint-disable max-lines */
import { Injectable, signal } from '@angular/core';
import { v7 } from 'uuid';
import dayjs from 'dayjs';
import { DiaryLog } from '../entities/diary-log.entity';
import { DiaryDay } from '../entities/diary-day.entity';
import { DayTemplate, DayTemplateEntry } from '../entities/day-template.entity';
import { Meal } from '../entities/meal.entity';
import { MealPosition, MealPositionMap } from '../entities/meal-position.enum';
import { Food } from '../entities/food.entity';
import { Recipe } from '../entities/recipe.entity';
import { Stats } from '../entities/stats.class';
import { Activity, ActivityType } from '../entities/activity.entity';

@Injectable({ providedIn: 'root' })
export class DiaryLogService {
  readonly diaryLog = signal<DiaryLog | undefined>(undefined);

  constructor() {
    this.setDiaryLog();
    this.loadDiaryLog();
  }

  private setDiaryLog() {
    const diaryLogRaw = localStorage.getItem('diaryLog');
    if (!diaryLogRaw) {
      const diaryLog = new DiaryLog();
      localStorage.setItem('diaryLog', JSON.stringify(diaryLog));
    }
  }

  private loadDiaryLog() {
    this.diaryLog.set(JSON.parse(localStorage.getItem('diaryLog')));
  }

  getRespectiveDayTemplate(isoDate: string) {
    return this.diaryLog()?.diaryDays.find((day) => day.date === isoDate)?.dayTemplate;
  }
  getRespectiveMeal(isoDate: string, mealPosition: MealPosition) {
    return this.getRespectiveDayTemplate(isoDate)?.entries.find(
      (entry) => entry.position === mealPosition,
    )?.meal;
  }
  updateMealTime(isoDate: string, mealPosition: MealPosition) {
    mealPosition = Number(mealPosition);
    this.diaryLog.update((diaryLog) => {
      const diaryLogCopy = { ...diaryLog };

      const respectiveDay = diaryLogCopy.diaryDays.find((day) => day.date === isoDate);
      if (!respectiveDay) {
        return diaryLog;
      }

      const respectiveEntry = respectiveDay.dayTemplate.entries.find(
        (entry) => entry.position === mealPosition,
      );
      if (!respectiveEntry) {
        return diaryLog;
      }

      const today = dayjs();
      respectiveEntry.meal.time = { hour: today.hour(), minute: today.minute(), second: 0 };

      return diaryLogCopy;
    });

    this.saveDiaryLog();
  }

  getRespectiveRecipes(isoDate: string, mealPosition: MealPosition) {
    return this.diaryLog()
      ?.diaryDays.find((day) => day.date === isoDate)
      ?.dayTemplate.entries.find((entry) => entry.position === mealPosition)?.recipes;
  }

  addFood(isoDate: string, mealPosition: MealPosition, food: Food) {
    food = { ...food };
    mealPosition = Number(mealPosition);
    this.diaryLog.update((diaryLog) => {
      const diaryLogCopy = { ...diaryLog };

      let respectiveDay = diaryLogCopy.diaryDays.find((day) => day.date === isoDate);
      if (!respectiveDay) {
        const newDay = new DiaryDay(isoDate, new DayTemplate());
        diaryLogCopy.diaryDays.push(newDay);
        respectiveDay = newDay;
      }

      let respectiveEntry = respectiveDay.dayTemplate.entries.find(
        (entry) => entry.position === mealPosition,
      );
      if (!respectiveEntry) {
        respectiveEntry = new DayTemplateEntry(
          mealPosition,
          new Meal(v7(), MealPositionMap[mealPosition], [food]),
          [],
        );

        respectiveDay.dayTemplate.entries.push(respectiveEntry);
      } else {
        respectiveEntry.meal.foods.push(food);
      }

      return diaryLogCopy;
    });

    this.saveDiaryLog();
  }

  saveDiaryLog() {
    localStorage.setItem(
      'diaryLog',
      JSON.stringify(this.diaryLog(), (key, value) => {
        if (key === 'position' && typeof value === 'string') {
          return MealPosition[value as keyof typeof MealPosition];
        }
        return value;
      }),
    );
  }

  updateMealName(isoDate: string, mealPosition: MealPosition, value: string) {
    this.diaryLog.update((diaryLog) => {
      const diaryLogCopy = { ...diaryLog };

      const respectiveDay = diaryLogCopy.diaryDays.find((day) => day.date === isoDate);
      if (!respectiveDay) {
        return diaryLog;
      }

      const respectiveEntry = respectiveDay.dayTemplate.entries.find(
        (entry) => entry.position === mealPosition,
      );
      if (!respectiveEntry) {
        return diaryLog;
      }

      respectiveEntry.meal.name = value;

      return diaryLogCopy;
    });

    this.saveDiaryLog();
  }

  removeFood(isoDate: string, mealPosition: MealPosition, foodIndex: number) {
    this.diaryLog.update((diaryLog) => {
      const diaryLogCopy = { ...diaryLog };

      const respectiveDay = diaryLogCopy.diaryDays.find((day) => day.date === isoDate);
      if (!respectiveDay) {
        return diaryLog;
      }

      const respectiveEntry = respectiveDay.dayTemplate.entries.find(
        (entry) => entry.position === mealPosition,
      );
      if (!respectiveEntry) {
        return diaryLog;
      }

      respectiveEntry.meal.foods = respectiveEntry.meal.foods.filter(
        (_, index) => index !== foodIndex,
      );

      return diaryLogCopy;
    });

    this.saveDiaryLog();
  }

  removeRecipeFromPosition(isoDate: string, mealPosition: MealPosition, recipeIndex: number) {
    this.diaryLog.update((diaryLog) => {
      const diaryLogCopy = { ...diaryLog };

      const respectiveDay = diaryLogCopy.diaryDays.find((day) => day.date === isoDate);
      if (!respectiveDay) {
        return diaryLog;
      }

      const respectiveEntry = respectiveDay.dayTemplate.entries.find(
        (entry) => entry.position === mealPosition,
      );
      if (!respectiveEntry) {
        return diaryLog;
      }

      respectiveEntry.recipes = respectiveEntry.recipes.filter((_, index) => index !== recipeIndex);

      return diaryLogCopy;
    });

    this.saveDiaryLog();
  }

  updateRecipeFoodWeight(
    isoDate: string,
    mealPosition: MealPosition,
    recipeIndex: number,
    foodIndex: number,
    weight: number,
  ) {
    this.diaryLog.update((diaryLog) => {
      const diaryLogCopy = { ...diaryLog };

      const respectiveDay = diaryLogCopy.diaryDays.find((day) => day.date === isoDate);
      if (!respectiveDay) {
        return diaryLog;
      }

      const respectiveEntry = respectiveDay.dayTemplate.entries.find(
        (entry) => entry.position === mealPosition,
      );
      if (!respectiveEntry) {
        return diaryLog;
      }

      const respectiveRecipe = respectiveEntry.recipes?.[recipeIndex];
      if (!respectiveRecipe) {
        return diaryLog;
      }

      const respectiveFood = respectiveRecipe.foods?.[foodIndex];
      if (!respectiveFood) {
        return diaryLog;
      }

      respectiveFood.weight = Number(weight);

      return diaryLogCopy;
    });

    this.saveDiaryLog();
  }

  removeFoodFromRecipe(
    isoDate: string,
    mealPosition: MealPosition,
    recipeIndex: number,
    foodIndex: number,
  ) {
    this.diaryLog.update((diaryLog) => {
      const diaryLogCopy = { ...diaryLog };

      const respectiveDay = diaryLogCopy.diaryDays.find((day) => day.date === isoDate);
      if (!respectiveDay) {
        return diaryLog;
      }

      const respectiveEntry = respectiveDay.dayTemplate.entries.find(
        (entry) => entry.position === mealPosition,
      );
      if (!respectiveEntry) {
        return diaryLog;
      }

      const respectiveRecipe = respectiveEntry.recipes?.[recipeIndex];
      if (!respectiveRecipe) {
        return diaryLog;
      }

      const respectiveFood = respectiveRecipe.foods?.[foodIndex];
      if (!respectiveFood) {
        return diaryLog;
      }

      respectiveRecipe.foods = respectiveRecipe.foods.filter((_, index) => index !== foodIndex);

      return diaryLogCopy;
    });

    this.saveDiaryLog();
  }

  clearMeal(isoDate: string, mealPosition: MealPosition) {
    this.diaryLog.update((diaryLog) => {
      const diaryLogCopy = { ...diaryLog };

      const respectiveDay = diaryLogCopy.diaryDays.find((day) => day.date === isoDate);
      if (!respectiveDay) {
        return diaryLog;
      }

      const respectiveEntry = respectiveDay.dayTemplate.entries.find(
        (entry) => entry.position === mealPosition,
      );
      if (!respectiveEntry) {
        return diaryLog;
      }

      respectiveDay.dayTemplate.entries = respectiveDay.dayTemplate.entries.filter(
        (entry) => entry.position !== mealPosition,
      );

      return diaryLogCopy;
    });

    this.saveDiaryLog();
  }

  updateFoodWeight(isoDate: string, mealPosition: MealPosition, foodIndex: number, weight: number) {
    this.diaryLog.update((diaryLog) => {
      const diaryLogCopy = { ...diaryLog };

      const respectiveDay = diaryLogCopy.diaryDays.find((day) => day.date === isoDate);
      if (!respectiveDay) {
        return diaryLog;
      }

      const respectiveEntry = respectiveDay.dayTemplate.entries.find(
        (entry) => entry.position === mealPosition,
      );
      if (!respectiveEntry) {
        return diaryLog;
      }

      respectiveEntry.meal.foods[foodIndex].weight = Number(weight);

      return diaryLogCopy;
    });

    this.saveDiaryLog();
  }

  getDayStats(isoDate: string) {
    const respectiveDay = this.diaryLog()?.diaryDays.find((day) => day.date === isoDate);
    const stats = new Stats();
    if (!respectiveDay) {
      return stats;
    }

    for (const entry of respectiveDay.dayTemplate.entries) {
      const allFoods = [...entry.meal.foods, ...entry.recipes.flatMap((r) => r.foods)];
      stats.proteins += allFoods.reduce((acc, food) => acc + food.protein * food.weight * 0.01, 0);
      stats.carbs += allFoods.reduce((acc, food) => acc + food.carbs * food.weight * 0.01, 0);
      stats.fats += allFoods.reduce((acc, food) => acc + food.fats * food.weight * 0.01, 0);
      stats.fiber += allFoods.reduce((acc, food) => acc + food.fiber * food.weight * 0.01, 0);
      stats.calories += allFoods.reduce((acc, food) => acc + food.calories * food.weight * 0.01, 0);
      stats.weight += allFoods.reduce((acc, food) => acc + food.weight, 0);
    }

    return stats;
  }

  getDayNote(isoDate: string) {
    return (
      this.diaryLog()?.diaryDays?.find((day) => day.date === isoDate)?.dayTemplate?.note ?? null
    );
  }
  updateDayNote(isoDate: string, value: string) {
    this.diaryLog.update((diaryLog) => {
      const diaryLogCopy = { ...diaryLog };

      let respectiveDay = diaryLogCopy.diaryDays.find((day) => day.date === isoDate);
      if (!respectiveDay) {
        const newDay = new DiaryDay(isoDate, new DayTemplate());
        diaryLogCopy.diaryDays.push(newDay);
        respectiveDay = newDay;
      }

      respectiveDay.dayTemplate.note = value;

      return diaryLogCopy;
    });

    this.saveDiaryLog();
  }

  getDayWater(isoDate: string) {
    return (
      this.diaryLog()?.diaryDays?.find((day) => day.date === isoDate)?.dayTemplate?.waterMl ?? null
    );
  }

  updateDayWater(isoDate: string, value: string) {
    this.diaryLog.update((diaryLog) => {
      const diaryLogCopy = { ...diaryLog };

      let respectiveDay = diaryLogCopy.diaryDays.find((day) => day.date === isoDate);
      if (!respectiveDay) {
        const newDay = new DiaryDay(isoDate, new DayTemplate());
        diaryLogCopy.diaryDays.push(newDay);
        respectiveDay = newDay;
      }

      if (value) {
        respectiveDay.dayTemplate.waterMl = Number(value);
      } else {
        delete respectiveDay.dayTemplate.waterMl;
      }

      return diaryLogCopy;
    });

    this.saveDiaryLog();
  }

  addDayWater(isoDate: string, value: number) {
    this.updateDayWater(isoDate, (this.getDayWater(isoDate) + value).toString());
  }
  subtractDayWater(isoDate: string, value: number) {
    const currentWaterMl = this.getDayWater(isoDate);
    if (currentWaterMl <= value) {
      this.updateDayWater(isoDate, '');
    } else {
      this.updateDayWater(isoDate, (currentWaterMl - value).toString());
    }
  }

  getPositionStats(isoDate: string, mealPosition: MealPosition) {
    const respectiveDay = this.diaryLog()?.diaryDays.find((day) => day.date === isoDate);
    const stats = new Stats();
    if (!respectiveDay) {
      return stats;
    }

    const respectiveEntry = respectiveDay.dayTemplate.entries.find(
      (entry) => entry.position === mealPosition,
    );
    if (!respectiveEntry) {
      return stats;
    }

    const allFoods = [
      ...respectiveEntry.meal.foods,
      ...respectiveEntry.recipes.flatMap((r) => r.foods),
    ];
    return {
      proteins: allFoods.reduce((acc, food) => acc + food.protein * food.weight * 0.01, 0),
      carbs: allFoods.reduce((acc, food) => acc + food.carbs * food.weight * 0.01, 0),
      fats: allFoods.reduce((acc, food) => acc + food.fats * food.weight * 0.01, 0),
      fiber: allFoods.reduce((acc, food) => acc + food.fiber * food.weight * 0.01, 0),
      calories: allFoods.reduce((acc, food) => acc + food.calories * food.weight * 0.01, 0),
      weight: allFoods.reduce((acc, food) => acc + food.weight, 0),
    };
  }

  updateMealNote(isoDate: string, mealId: string, note: string) {
    this.diaryLog.update((diaryLog) => {
      const diaryLogCopy = { ...diaryLog };

      const respectiveDay = diaryLogCopy.diaryDays.find((day) => day.date === isoDate);
      if (!respectiveDay) {
        return diaryLog;
      }

      const respectiveEntry = respectiveDay.dayTemplate.entries.find(
        (entry) => entry.meal.id === mealId,
      );

      if (!respectiveEntry) {
        return diaryLog;
      }

      respectiveEntry.meal.note = note;

      return diaryLogCopy;
    });

    this.saveDiaryLog();
  }

  getExpandedMeal() {
    const currentExpandedMealRaw = localStorage.getItem('expandedMeal');
    const currentExpandedMeal = currentExpandedMealRaw ? JSON.parse(currentExpandedMealRaw) : null;
    return currentExpandedMeal;
  }

  toggleExpandedMeal(isoDate: string, mealPosition: MealPosition) {
    const currentExpandedMeal = this.getExpandedMeal();

    localStorage.setItem(
      'expandedMeal',
      JSON.stringify({
        isoDate:
          currentExpandedMeal?.isoDate === isoDate &&
          currentExpandedMeal?.mealPosition === mealPosition
            ? ''
            : isoDate,
        mealPosition:
          currentExpandedMeal?.isoDate === isoDate &&
          currentExpandedMeal?.mealPosition === mealPosition
            ? MealPosition.None
            : mealPosition,
      }),
    );
  }

  expandMeal(isoDate: string, mealPosition: MealPosition) {
    localStorage.setItem('expandedMeal', JSON.stringify({ isoDate, mealPosition }));
  }

  addRecipe(isoDate: string, mealPosition: MealPosition, portions: number, recipe: Recipe) {
    this.diaryLog.update((diaryLog) => {
      const diaryLogCopy = { ...diaryLog };

      let respectiveDay = diaryLogCopy.diaryDays.find((day) => day.date === isoDate);
      if (!respectiveDay) {
        const newDay = new DiaryDay(isoDate, new DayTemplate());
        diaryLogCopy.diaryDays.push(newDay);
        respectiveDay = newDay;
      }

      let respectiveEntry = respectiveDay.dayTemplate.entries.find(
        (entry) => entry.position === mealPosition,
      );
      const recipeCopy = new Recipe(
        v7(),
        recipe.name,
        recipe.foods.map((food) => {
          return new Food(
            food.id,
            food.name,
            food.macroCategory,
            food.protein,
            food.carbs,
            food.fats,
            food.fiber,
            food.calories,
            food.weight * (portions / recipe.portions),
            food.note,
          );
        }),
        portions,
        recipe.note,
      );
      if (!respectiveEntry) {
        respectiveEntry = new DayTemplateEntry(
          mealPosition,
          new Meal(v7(), MealPositionMap[mealPosition], []),
          [recipeCopy],
        );
        respectiveDay.dayTemplate.entries.push(respectiveEntry);
      } else {
        respectiveEntry.recipes.push(recipeCopy);
      }

      return diaryLogCopy;
    });

    this.saveDiaryLog();
  }

  hasFoodOnDate(isoDate: string) {
    const respectiveDay = this.diaryLog()?.diaryDays.find((day) => day.date === isoDate);
    if (!respectiveDay) {
      return false;
    }

    for (const entry of respectiveDay.dayTemplate.entries) {
      if (entry.meal.foods.length > 0 || entry.recipes.length > 0) {
        return true;
      }
    }
    return false;
  }

  hasWeightInOnDate(isoDate: string) {
    return !!this.diaryLog()?.diaryDays.find((day) => day.date === isoDate)?.dayTemplate?.weight;
  }
  hasWaterOnDate(isoDate: string) {
    return !!this.diaryLog()?.diaryDays.find((day) => day.date === isoDate)?.dayTemplate?.waterMl;
  }
  hasActivitiesOnDate(isoDate: string) {
    return !!this.diaryLog()
      ?.diaryDays.find((day) => day.date === isoDate)
      ?.dayTemplate?.activities?.some((a) => !!a.durationMinutes && a.type !== ActivityType.None);
  }

  getCurrentWeight(isoDate: string) {
    const respectiveDay = this.diaryLog()?.diaryDays.find((day) => day.date === isoDate);
    if (!respectiveDay) {
      return null;
    }

    return respectiveDay.dayTemplate.weight ?? null;
  }

  updateCurrentWeight(isoDate: string, value: string) {
    this.diaryLog.update((diaryLog) => {
      const diaryLogCopy = { ...diaryLog };

      let respectiveDay = diaryLogCopy.diaryDays.find((day) => day.date === isoDate);
      if (!respectiveDay) {
        const newDay = new DiaryDay(isoDate, new DayTemplate());
        diaryLogCopy.diaryDays.push(newDay);
        respectiveDay = newDay;
      }

      if (value) {
        respectiveDay.dayTemplate.weight = Number(value);
      } else {
        delete respectiveDay.dayTemplate.weight;
      }

      return diaryLogCopy;
    });

    this.saveDiaryLog();
  }

  getWeightByFormula(isoDate: string, weightFormulaBackDays: number) {
    const currentDate = dayjs(isoDate).utc().startOf('day');
    const weights: number[] = [];
    for (let i = 0; i < weightFormulaBackDays; i++) {
      const checkDate = currentDate.subtract(i, 'day').toISOString();
      const weight = this.getCurrentWeight(checkDate);
      if (weight) {
        weights.push(weight);
      }
    }

    if (!weights.length) {
      return 0;
    }

    weights.sort();
    if (weights.length <= 3) {
      return weights.reduce((acc, w) => acc + w, 0) / weights.length;
    }

    const midIndex = Math.floor(weights.length / 2);
    if (weights.length % 2 === 0) {
      return (weights[midIndex - 1] + weights[midIndex]) / 2;
    } else {
      return (weights[midIndex - 1] + weights[midIndex] + weights[midIndex + 1]) / 3;
    }
  }

  getWeights(isoDate: string, weightFormulaBackDays: number) {
    const currentDate = dayjs.min(
      dayjs(isoDate).utc().startOf('day'),
      dayjs().utc().startOf('day'),
    );
    const weights: number[] = [];
    let weight = 0;
    for (let i = 0; i < weightFormulaBackDays; i++) {
      const checkDate = currentDate.subtract(i, 'day').toISOString();
      weight = this.getCurrentWeight(checkDate);
      if (weight) {
        weights.push(weight);
      }
    }
    weights.reverse();

    return weights;
  }

  getCalorie(isoDate: string) {
    return this.getDayStats(isoDate).calories;
  }
  getCalories(isoDate: string, weightFormulaBackDays: number) {
    const currentDate = dayjs.min(
      dayjs(isoDate).utc().startOf('day'),
      dayjs().utc().startOf('day'),
    );
    const calories: number[] = [];
    let calorie = 0;
    for (let i = 0; i < weightFormulaBackDays; i++) {
      const checkDate = currentDate.subtract(i, 'day').toISOString();
      calorie = this.getCalorie(checkDate);
      if (calorie) {
        calories.push(calorie);
      }
    }
    calories.reverse();

    return calories;
  }

  getActivities(isoDate: string) {
    return (
      this.diaryLog()?.diaryDays.find((day) => day.date === isoDate)?.dayTemplate.activities ?? []
    );
  }

  addActivity(isoDate: string) {
    this.diaryLog.update((diaryLog) => {
      const diaryLogCopy = { ...diaryLog };

      let respectiveDay = diaryLogCopy.diaryDays.find((day) => day.date === isoDate);
      if (!respectiveDay) {
        const newDay = new DiaryDay(isoDate, new DayTemplate());
        diaryLogCopy.diaryDays.push(newDay);
        respectiveDay = newDay;
      }

      const respectiveActivities = respectiveDay.dayTemplate.activities;
      const today = dayjs();
      const activity = new Activity({ hour: today.hour(), minute: today.minute(), second: 0 });
      if (respectiveActivities?.length) {
        respectiveActivities.push(activity);
      } else {
        respectiveDay.dayTemplate.activities = [activity];
      }

      return diaryLogCopy;
    });

    this.saveDiaryLog();
  }

  removeActivity(isoDate: string, activityIndex: number) {
    this.diaryLog.update((diaryLog) => {
      const diaryLogCopy = { ...diaryLog };

      const respectiveDay = diaryLogCopy.diaryDays.find((day) => day.date === isoDate);
      if (!respectiveDay) {
        return diaryLog;
      }

      respectiveDay.dayTemplate.activities = respectiveDay.dayTemplate.activities.filter(
        (_, index) => index !== activityIndex,
      );

      return diaryLogCopy;
    });

    this.saveDiaryLog();
  }

  setActivityType(isoDate: string, activityIndex: number, activityType: ActivityType) {
    this.diaryLog.update((diaryLog) => {
      const diaryLogCopy = { ...diaryLog };

      const respectiveDay = diaryLogCopy.diaryDays.find((day) => day.date === isoDate);
      if (!respectiveDay) {
        return diaryLog;
      }

      respectiveDay.dayTemplate.activities[activityIndex].type = activityType;

      return diaryLogCopy;
    });

    this.saveDiaryLog();
  }

  downloadDiary() {
    const json = JSON.stringify(this.diaryLog());
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'diary.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  setDiary(diary: DiaryLog) {
    localStorage.setItem('diaryLog', JSON.stringify(diary));
    this.loadDiaryLog();
  }
}
