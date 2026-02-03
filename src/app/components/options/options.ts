import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FoodsService } from '../../shared/services/my-foods.service';
import { ToastsService } from '../../shared/services/toasts.service';
import { ButtonIconDirective } from '../../shared/directives/button-icon.directive';
import { isValidFood } from '../../shared/entities/food.entity';
import { RoutePaths } from '../../shared/routes/route-paths';
import { isValidRecipe } from '../../shared/entities/recipe.entity';
import { RecipesService } from '../../shared/services/recipes.service';
import { DiaryLogService } from '../../shared/services/diary-log.service';

@Component({
  selector: 'app-options',
  imports: [ButtonIconDirective],
  templateUrl: './options.html',
})
export class Options {
  protected readonly toastsService = inject(ToastsService);
  protected readonly foodsService = inject(FoodsService);
  protected readonly recipesService = inject(RecipesService);
  protected readonly diaryLogService = inject(DiaryLogService);

  protected readonly jsonUploadFoodsInput =
    viewChild<ElementRef<HTMLInputElement>>('jsonUploadFoods');
  onLoadFoodsFromFile(fileEvent) {
    const target = fileEvent.target as DataTransfer;
    if (target.files?.length !== 1) {
      this.jsonUploadFoodsInput().nativeElement.value = '';

      return;
    }
    const file = target.files?.[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const contents = e.target?.result as string;
      if (contents) {
        const foods = JSON.parse(contents);
        if (!Array.isArray(foods) || !foods.every((food) => isValidFood(food))) {
          this.toastsService.showAsWarning(`Wrong food data`, {
            headerText: null,
            delayMs: 5000,
          });
          console.warn('Wrong food data');
          return;
        }
        this.foodsService.setFoods(foods);

        if (this.foodsService.foods()?.length === 1) {
          this.toastsService.showAsInformation('Loaded 1 food', {
            headerText: null,
            delayMs: 5000,
          });

          return;
        }

        this.toastsService.showAsInformation(`Loaded ${this.foodsService.foods()?.length} foods`, {
          headerText: null,
          delayMs: 5000,
        });
      }
    };
    reader.readAsText(file);
    this.jsonUploadFoodsInput().nativeElement.value = '';
  }

  protected readonly jsonUploadRecipesInput =
    viewChild<ElementRef<HTMLInputElement>>('jsonUploadRecipes');
  onLoadRecipesFromFile(fileEvent) {
    const target = fileEvent.target as DataTransfer;
    if (target.files?.length !== 1) {
      this.jsonUploadRecipesInput().nativeElement.value = '';

      return;
    }
    const file = target.files?.[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const contents = e.target?.result as string;
      if (contents) {
        const recipes = JSON.parse(contents);
        if (!Array.isArray(recipes) || !recipes.every((recipe) => isValidRecipe(recipe))) {
          this.toastsService.showAsWarning(`Wrong recipes data`, {
            headerText: null,
            delayMs: 5000,
          });
          console.warn('Wrong recipes data');
          return;
        }

        this.recipesService.setRecipes(recipes);
        if (this.recipesService.recipes()?.length === 1) {
          this.toastsService.showAsInformation('Loaded 1 recipe', {
            headerText: null,
            delayMs: 5000,
          });
          return;
        }

        this.toastsService.showAsInformation(
          `Loaded ${this.recipesService.recipes()?.length} recipes`,
          {
            headerText: null,
            delayMs: 5000,
          },
        );
      }
    };
    reader.readAsText(file);
    this.jsonUploadRecipesInput().nativeElement.value = '';
  }

  protected readonly jsonUploadDiaryInput =
    viewChild<ElementRef<HTMLInputElement>>('jsonUploadDiary');
  onLoadDiaryFromFile(fileEvent) {
    const target = fileEvent.target as DataTransfer;
    if (target.files?.length !== 1) {
      this.jsonUploadDiaryInput().nativeElement.value = '';

      return;
    }
    const file = target.files?.[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const contents = e.target?.result as string;
      if (contents) {
        const diary = JSON.parse(contents);
        if (!Array.isArray(diary.diaryDays)) {
          this.toastsService.showAsWarning(`Wrong diary data`, {
            headerText: null,
            delayMs: 5000,
          });
          console.warn('Wrong diary data');
          return;
        }

        this.diaryLogService.setDiary(diary);
        if (this.diaryLogService.diaryLog()?.diaryDays?.length === 1) {
          this.toastsService.showAsInformation('Loaded 1 diary day', {
            headerText: null,
            delayMs: 5000,
          });
          return;
        }

        this.toastsService.showAsInformation(
          `Loaded ${this.diaryLogService.diaryLog()?.diaryDays?.length} diary days`,
          {
            headerText: null,
            delayMs: 5000,
          },
        );
      }
    };
    reader.readAsText(file);
    this.jsonUploadDiaryInput().nativeElement.value = '';
  }

  private readonly router = inject(Router);
  clearAllMemory() {
    localStorage.clear();
    void this.router.navigate([RoutePaths.home]);
    setTimeout(() => {
      window.location.reload();
    }, 50);
  }
}
