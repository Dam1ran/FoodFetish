import { Component, computed, ElementRef, inject, viewChild, linkedSignal } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FoodsService } from '../../shared/services/my-foods.service';
import { ToastsService } from '../../shared/services/toasts.service';
import { ButtonIconDirective } from '../../shared/directives/button-icon.directive';
import { isValidFood } from '../../shared/entities/food.entity';
import { RoutePaths } from '../../shared/routes/route-paths';
import { isValidRecipe } from '../../shared/entities/recipe.entity';
import { RecipesService } from '../../shared/services/recipes.service';
import { DiaryLogService } from '../../shared/services/diary-log.service';
import { ImageStoreService } from '../../shared/services/image-store.service';
import { GoogleDriveService } from '../../shared/services/google-drive.service';
import { IconifyComponent } from '../../shared/components/iconify.component';
import { DatePicker } from '../../shared/components/date-picker/date-picker';
import { DayJsHelper } from '../../shared/helpers/dayjs-helper';
import { OptionsService } from '../../shared/services/options/options.service';
import { ActivityLevel, ActivityLevelMap } from '../../shared/services/options/activity-level.enum';
import { WeightGoal, WeightGoalMap } from '../../shared/services/options/weight-goal.enum';

@Component({
  selector: 'app-options',
  imports: [ButtonIconDirective, IconifyComponent, DatePicker, DatePipe],
  templateUrl: './options.html',
})
export class Options {
  protected readonly toastsService = inject(ToastsService);
  protected readonly foodsService = inject(FoodsService);
  protected readonly recipesService = inject(RecipesService);
  protected readonly diaryLogService = inject(DiaryLogService);
  private readonly imageStoreService = inject(ImageStoreService);
  protected readonly googleDriveService = inject(GoogleDriveService);
  protected readonly optionsService = inject(OptionsService);

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
    void this.imageStoreService.deleteDatabase();
    void this.router.navigate([RoutePaths.home]);
    setTimeout(() => {
      window.location.reload();
    }, 50);
  }

  readonly selectedDate = linkedSignal(() => this.optionsService.options().dateOfBirth);

  readonly selectedDayJs = computed(
    () => this.selectedDate() && DayJsHelper.fromNgbDateStruct(this.selectedDate()),
  );
  readonly years = computed(() =>
    this.selectedDayJs() ? DayJsHelper.getStartOfToday().diff(this.selectedDayJs(), 'year') : 0,
  );

  activityLevelMap = ActivityLevelMap;
  protected readonly activityLevels = Object.keys(ActivityLevel)
    .filter((value) => !isNaN(Number(value)))
    .map((value) => ({
      label: ActivityLevelMap[value].description,
      value: +value as ActivityLevel,
    }));

  weightGoalMap = WeightGoalMap;
  protected readonly weightGoals = Object.keys(WeightGoal)
    .filter((value) => !isNaN(Number(value)))
    .map((value) => ({
      label: WeightGoalMap[value].description,
      value: +value as WeightGoal,
    }));
}
