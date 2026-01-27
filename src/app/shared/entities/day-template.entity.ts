import { MealPosition } from './meal-position.enum';
import { Meal } from './meal.entity';

export class DayTemplate {
  entries: {
    position: MealPosition;
    meal: Meal;
  }[] = [];
}

export class DayTemplateEntry {
  constructor(
    public position = MealPosition.None,
    public meal = new Meal(),
  ) {}
}
