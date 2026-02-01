import {
  booleanAttribute,
  Component,
  input,
  output,
  AfterViewInit,
  viewChild,
  ElementRef,
} from '@angular/core';
import { Food } from '../../../../shared/entities/food.entity';
import { ButtonIconDirective } from '../../../../shared/directives/button-icon.directive';

@Component({
  selector: 'food-row',
  imports: [ButtonIconDirective],
  templateUrl: './food-row.html',
})
export class FoodRow implements AfterViewInit {
  readonly food = input.required<Food>();
  readonly isOdd = input(false);
  readonly removeFood = output();
  readonly updateFoodWeight = output<string>();
  readonly noRemove = input(false, { transform: booleanAttribute });
  readonly focusWeight = input(false);

  protected readonly weightInput = viewChild<ElementRef<HTMLInputElement>>('weightInput');
  ngAfterViewInit() {
    if (this.focusWeight()) {
      this.weightInput().nativeElement.focus();
    }
  }
}
