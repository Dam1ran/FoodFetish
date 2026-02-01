import { MealPosition } from './meal-position.enum';
import { Meal } from './meal.entity';
import { Recipe } from './recipe.entity';

export class DayTemplate {
  entries: DayTemplateEntry[] = [];
  weight: number;
  note: string;
  waterMl: number;
}

export class DayTemplateEntry {
  constructor(
    public position = MealPosition.None,
    public meal = new Meal(),
    public recipes: Recipe[] = [],
  ) {}
}
