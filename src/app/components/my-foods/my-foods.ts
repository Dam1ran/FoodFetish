import { Component, computed, input, signal } from '@angular/core';
import { inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AddEditFood } from './components/add-edit-food/add-edit-food-modal';
import { FoodsService } from '../../shared/services/my-foods.service';
import { ButtonIconDirective } from '../../shared/directives/button-icon.directive';
import {
  FoodMacroCategoryMap,
  FoodMacroCategory,
} from '../../shared/entities/food-macro-category.enum';
import { Food } from '../../shared/entities/food.entity';
import { MealPosition } from '../../shared/entities/meal-position.enum';
import { DiaryLogService } from '../../shared/services/diary-log.service';
import { RoutePaths } from '../../shared/routes/route-paths';
import { RecipesService } from '../../shared/services/recipes.service';
import { IconifyComponent } from '../../shared/components/iconify.component';

@Component({
  imports: [ButtonIconDirective, FormsModule, IconifyComponent],
  templateUrl: './my-foods.html',
  styleUrl: './my-foods.scss',
})
export class MyFoods {
  private readonly modalService = inject(NgbModal);

  protected readonly myFoodsService = inject(FoodsService);
  protected readonly recipesService = inject(RecipesService);

  protected readonly foodMacroCategoryMap = FoodMacroCategoryMap;
  protected readonly macroCategories = Object.keys(FoodMacroCategory)
    .filter((value) => !isNaN(Number(value)))
    .map((value) => ({
      label: FoodMacroCategory[value as keyof typeof FoodMacroCategory],
      value: +value as FoodMacroCategory,
    }));

  protected selectedMacroCategory = signal(this.macroCategories[0]);
  protected nameFilter = signal('');

  protected foods = computed(() => {
    return this.myFoodsService
      .foods()
      .filter(
        (f) =>
          f.macroCategory === this.selectedMacroCategory().value ||
          this.selectedMacroCategory().value === FoodMacroCategory.None,
      )
      .filter((f) => f.name?.toLowerCase().includes(this.nameFilter().toLowerCase()))
      .sort((a, b) => a.macroCategory - b.macroCategory || a.name?.localeCompare(b.name));
  });

  protected readonly diaryDate = input<string>('');
  protected readonly mealPosition = input<MealPosition>(0);
  protected readonly recipeId = input<string>('');

  protected addFood() {
    const modal = this.modalService.open(AddEditFood);
    modal.componentInstance.food.set(new Food(undefined, this.nameFilter().capitalize()));
  }

  protected addFoodAndGoogle() {
    window.open(this.getProductLink(), '_blank');
    this.addFood();
  }

  private readonly diaryLogService = inject(DiaryLogService);
  private readonly router = inject(Router);
  protected addFoodToDiaryOrRecipe(food: Food) {
    if (this.diaryDate() && this.mealPosition()) {
      this.diaryLogService.addFood(this.diaryDate(), +this.mealPosition(), food);
      this.diaryLogService.updateMealTime(this.diaryDate(), this.mealPosition());
      void this.router.navigate([RoutePaths.diary], {
        queryParams: { diaryDate: this.diaryDate() },
      });
    } else if (this.recipeId()) {
      this.recipesService.addFood(this.recipeId(), food.id);
      void this.router.navigate([RoutePaths.recipes]);
    }
  }

  protected editFood(food: Food) {
    const modal = this.modalService.open(AddEditFood);
    modal.componentInstance.food.set({ barcode: null, ...food });
  }

  protected deleteFood(food: Food) {
    this.myFoodsService.deleteFood(food);
  }

  getProductLink() {
    return `https://www.google.com/search?q=show+me+data+for+${encodeURI(this.nameFilter())}+100g+of+product+with+macro+order+list+protein+-+carbs+-+fats+-+fiber+-+Kcal+as+table+header`;
  }
}
