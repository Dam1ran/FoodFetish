import { booleanAttribute, Component, input, output } from '@angular/core';
import { Food } from '../../../../shared/entities/food.entity';
import { ButtonIconDirective } from '../../../../shared/directives/button-icon.directive';

@Component({
  selector: 'food-row',
  imports: [ButtonIconDirective],
  templateUrl: './food-row.html',
})
export class FoodRow {
  readonly food = input.required<Food>();
  readonly isOdd = input(false);
  readonly removeFood = output();
  readonly updateFoodWeight = output<string>();
  readonly noRemove = input(false, { transform: booleanAttribute });
}
