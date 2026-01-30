import { Food, isValidFood } from './food.entity';
import { Meal } from './meal.entity';

export class Recipe extends Meal {
  constructor(
    id = '',
    name = '',
    foods: Food[] = [],
    public portions = 1,
    note = '',
  ) {
    super(id, name, foods, note);
  }
}

export function isValidRecipe(obj): obj is Recipe {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.portions === 'number' &&
    typeof obj.note === 'string' &&
    Array.isArray(obj.foods) &&
    obj.foods.every((food) => isValidFood(food))
  );
}
