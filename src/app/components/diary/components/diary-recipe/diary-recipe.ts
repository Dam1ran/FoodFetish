import { Component, input, output, signal } from '@angular/core';
import { v7 } from 'uuid';
import { Recipe } from '../../../../shared/entities/recipe.entity';
import { FoodRow } from '../food-row/food-row';
import { TotalRow } from '../total-row/total-row';
import { getMealStats } from '../../../../shared/entities/meal.entity';
import { IconifyComponent } from '../../../../shared/components/iconify.component';
import { ButtonIconDirective } from '../../../../shared/directives/button-icon.directive';

@Component({
  selector: 'diary-recipe',
  imports: [FoodRow, TotalRow, IconifyComponent, ButtonIconDirective],
  templateUrl: './diary-recipe.html',
})
export class DiaryRecipe {
  protected readonly id = signal(v7());
  readonly recipe = input.required<Recipe>();
  readonly updateFoodWeight = output<{ foodIndex: number; newWeight: number }>();
  readonly removeFood = output<number>();

  readonly removeRecipe = output();
  protected recipeStats() {
    return getMealStats(this.recipe());
  }
}
