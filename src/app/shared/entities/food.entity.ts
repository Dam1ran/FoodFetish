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
