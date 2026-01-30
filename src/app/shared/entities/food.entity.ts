import { FoodMacroCategory } from './food-macro-category.enum';

export class Food {
  constructor(
    public id = '',
    public name = '',
    public macroCategory = FoodMacroCategory.None,
    public protein = 0,
    public carbs = 0,
    public fats = 0,
    public fiber = 0,
    public calories = 0,
    public weight = 100,
    public note = '',
  ) {}
}

export function isValidFood(obj): obj is Food {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.macroCategory === 'number' &&
    typeof obj.protein === 'number' &&
    typeof obj.carbs === 'number' &&
    typeof obj.fats === 'number' &&
    typeof obj.fiber === 'number' &&
    typeof obj.calories === 'number' &&
    typeof obj.weight === 'number' &&
    typeof obj.note === 'string'
  );
}
