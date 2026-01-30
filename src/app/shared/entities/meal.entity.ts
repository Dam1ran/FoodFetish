import { Food } from './food.entity';
import { Stats } from './stats.class';

export class Meal {
  constructor(
    public id = '',
    public name = '',
    public foods: Food[] = [],
    public note = '',
  ) {}
}

export function getMealProtein(meal?: Meal) {
  if (!meal?.foods?.length) {
    return 0;
  }

  return meal.foods.reduce((acc, food) => acc + food.protein * food.weight * 0.01, 0);
}

export function getMealCarbs(meal?: Meal) {
  if (!meal?.foods?.length) {
    return 0;
  }

  return meal.foods.reduce((acc, food) => acc + food.carbs * food.weight * 0.01, 0);
}

export function getMealFats(meal?: Meal) {
  if (!meal?.foods?.length) {
    return 0;
  }

  return meal.foods.reduce((acc, food) => acc + food.fats * food.weight * 0.01, 0);
}

export function getMealFiber(meal?: Meal) {
  if (!meal?.foods?.length) {
    return 0;
  }

  return meal.foods.reduce((acc, food) => acc + food.fiber * food.weight * 0.01, 0);
}

export function getMealCalories(meal?: Meal) {
  if (!meal?.foods?.length) {
    return 0;
  }

  return meal.foods.reduce((acc, food) => acc + food.calories * food.weight * 0.01, 0);
}

export function getMealWeight(meal?: Meal) {
  if (!meal?.foods?.length) {
    return 0;
  }

  return meal.foods.reduce((acc, food) => acc + food.weight, 0);
}

export function getMealStats(meal: Meal) {
  return new Stats(
    getMealProtein(meal),
    getMealCarbs(meal),
    getMealFats(meal),
    getMealFiber(meal),
    getMealCalories(meal),
    getMealWeight(meal),
  );
}
