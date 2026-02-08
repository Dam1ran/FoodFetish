import {
  Component,
  computed,
  inject,
  input,
  signal,
  viewChild,
  model,
  AfterViewInit,
  effect,
  TemplateRef,
  ChangeDetectorRef,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDateStruct, NgbModal, NgbTimepicker } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, Location } from '@angular/common';
import { v7 } from 'uuid';
import { FoodRow } from './components/food-row/food-row';
import { DiaryRecipe } from './components/diary-recipe/diary-recipe';
import { TotalRow } from './components/total-row/total-row';
import { Weekdays } from './components/weekday/weekdays';
import { WeightInWidget } from './components/weight-in-widget/weight-in-widget';
import { ActivityWidget } from './components/activity-widget/activity-widget';
import { DiaryBarcodeScanner } from './components/diary-barcode-scanner/diary-barcode-scanner';
import { MacrosWidget } from './components/macros-widget/macros-widget';
import { MealThumb } from './components/meal-thumb/meal-thumb';
import { ButtonIconDirective } from '../../shared/directives/button-icon.directive';
import { DayTemplateService } from '../../shared/services/day-template.service';
import { DiaryLogService } from '../../shared/services/diary-log.service';
import { DayJsHelper } from '../../shared/helpers/dayjs-helper';
import { Meal } from '../../shared/entities/meal.entity';
import { MealPosition, MealPositionMap } from '../../shared/entities/meal-position.enum';
import { RoutePaths } from '../../shared/routes/route-paths';
import { IconifyComponent } from '../../shared/components/iconify.component';
import { OptionsService } from '../../shared/services/options/options.service';
import { processImageToThumb } from '../../shared/helpers/image-helper';
import { ImageStoreService } from '../../shared/services/image-store.service';
import { RecipesService } from '../../shared/services/recipes.service';

@Component({
  selector: 'diary',
  imports: [
    ButtonIconDirective,
    ReactiveFormsModule,
    FormsModule,
    FoodRow,
    DiaryRecipe,
    TotalRow,
    Weekdays,
    WeightInWidget,
    DatePipe,
    IconifyComponent,
    ActivityWidget,
    MacrosWidget,
    MealThumb,
    NgbTimepicker,
  ],
  templateUrl: './diary.html',
  styleUrl: './diary.scss',
})
export class Diary implements AfterViewInit {
  protected readonly mealPosition = MealPosition;
  readonly diaryDate = input('');

  readonly selectedDate = model<NgbDateStruct>(undefined);
  readonly selectedDayJs = computed(
    () => this.selectedDate() && DayJsHelper.fromNgbDateStruct(this.selectedDate()),
  );
  readonly isTodaySelected = computed(
    () =>
      this.selectedDate() &&
      DayJsHelper.fromNgbDateStruct(this.selectedDate()).isSame(
        DayJsHelper.getStartOfToday(),
        'day',
      ),
  );

  ngAfterViewInit() {
    if (this.diaryDate()) {
      this.selectedDate.set(DayJsHelper.toNgbDateStruct(this.diaryDate()));
    }
  }

  private readonly location = inject(Location);
  private readonly activatedRoute = inject(ActivatedRoute);
  constructor() {
    effect(() => {
      if (!this.selectedDate()) {
        return;
      }

      const diaryDate = this.selectedDayJs();
      if (diaryDate) {
        const url = this.router
          .createUrlTree([], {
            relativeTo: this.activatedRoute,
            queryParams: { diaryDate: diaryDate.toISOString() },
          })
          .toString();
        this.location.go(url);
      }
    });
  }

  protected readonly dayTemplateService = inject(DayTemplateService);
  private readonly router = inject(Router);
  addFood(mealPosition: MealPosition) {
    void this.router.navigate([RoutePaths.myFoods], {
      queryParams: { diaryDate: this.selectedDayJs().toISOString(), mealPosition },
    });
  }
  addRecipe(mealPosition: MealPosition) {
    void this.router.navigate([RoutePaths.recipes], {
      queryParams: { diaryDate: this.selectedDayJs().toISOString(), mealPosition },
    });
  }

  protected readonly diaryLogService = inject(DiaryLogService);
  protected readonly mealPositionMap = MealPositionMap;
  getRespectiveMeal(mealPosition: MealPosition) {
    return this.diaryLogService.getRespectiveMeal(this.selectedDayJs().toISOString(), mealPosition);
  }
  isMealShown(mealPosition: MealPosition) {
    return (
      mealPosition === MealPosition.MealOne ||
      mealPosition === MealPosition.Snacks ||
      !this.diaryLogService.isPrevPositionMealEmpty(
        this.selectedDayJs().toISOString(),
        mealPosition,
      )
    );
  }
  getRespectiveRecipes(mealPosition: MealPosition) {
    return this.diaryLogService.getRespectiveRecipes(
      this.selectedDayJs().toISOString(),
      mealPosition,
    );
  }

  updateMealName(mealPosition: MealPosition, value: string) {
    this.diaryLogService.updateMealName(this.selectedDayJs().toISOString(), mealPosition, value);
  }

  removeFood(mealPosition: MealPosition, foodIndex: number) {
    this.diaryLogService.removeFood(this.selectedDayJs().toISOString(), mealPosition, foodIndex);
  }

  updateFoodWeight(mealPosition: MealPosition, foodIndex: number, weight: string) {
    this.diaryLogService.updateFoodWeight(
      this.selectedDayJs().toISOString(),
      mealPosition,
      foodIndex,
      +weight,
    );
  }

  getPositionStats(mealPosition: MealPosition) {
    return this.diaryLogService.getPositionStats(this.selectedDayJs().toISOString(), mealPosition);
  }
  getDayStats() {
    return this.diaryLogService.getDayStats(this.selectedDayJs().toISOString());
  }

  toggleExpandedMeal(mealPosition: MealPosition) {
    this.diaryLogService.toggleExpandedMeal(this.selectedDayJs().toISOString(), mealPosition);
  }

  isMealExpanded(mealPosition: MealPosition) {
    const currentExpandedMeal = this.diaryLogService.getExpandedMeal();
    return (
      currentExpandedMeal?.isoDate === this.selectedDayJs().toISOString() &&
      currentExpandedMeal?.mealPosition === mealPosition
    );
  }

  private readonly modalService = inject(NgbModal);
  private readonly editMealNoteDialogRef = viewChild('editMealNoteDialog');
  protected readonly editNoteMealId = signal('');
  protected readonly editNoteMeal = signal('');
  toggleEditMealNoteDialog(mealId: string, mealNote: string) {
    this.editNoteMealId.set(mealId);
    this.editNoteMeal.set(mealNote);
    this.modalService
      .open(this.editMealNoteDialogRef(), { size: 'sm', centered: true })
      .result.catch(() => {
        this.editNoteMealId.set('');
        this.editNoteMeal.set('');
      });
  }

  updateMealNote(mealId: string, note: string) {
    this.diaryLogService.updateMealNote(this.selectedDayJs().toISOString(), mealId, note);
  }

  updateRecipeFoodWeight(
    mealPosition: MealPosition,
    recipeIndex: number,
    foodIndex: number,
    weight: number,
  ) {
    this.diaryLogService.updateRecipeFoodWeight(
      this.selectedDayJs().toISOString(),
      mealPosition,
      recipeIndex,
      foodIndex,
      weight,
    );
  }

  removeFoodFromRecipe(mealPosition: MealPosition, recipeIndex: number, foodIndex: number) {
    this.diaryLogService.removeFoodFromRecipe(
      this.selectedDayJs().toISOString(),
      mealPosition,
      recipeIndex,
      foodIndex,
    );
  }

  removeRecipeFromPosition(mealPosition: MealPosition, recipeIndex: number) {
    this.diaryLogService.removeRecipeFromPosition(
      this.selectedDayJs().toISOString(),
      mealPosition,
      recipeIndex,
    );
  }

  toggleEditDayNoteDialog(dialog: TemplateRef<HTMLTextAreaElement>) {
    this.modalService.open(dialog, { size: 'sm', centered: true });
  }

  onScanBarcodeClick(mealPosition: MealPosition) {
    const scanner = this.modalService.open(DiaryBarcodeScanner, { size: 'sm', centered: true });

    scanner.componentInstance.isoDate.set(this.selectedDayJs().toISOString());
    scanner.componentInstance.mealPosition.set(mealPosition);
  }

  protected readonly optionsService = inject(OptionsService);
  getWaterBg(waterMl: number, weightFormulaBackDays: number) {
    const currentWeight = this.diaryLogService.getWeightByFormula(undefined, weightFormulaBackDays);

    if (!currentWeight) {
      return 'rgba(0, 0, 0, 0)';
    }

    const multiplier = Math.min(waterMl / (currentWeight * 0.325), 100);
    return `rgba(${140 - multiplier * 1.5}, ${50 + multiplier * 0.8}, ${multiplier * 2}, 0.5)`;
  }
  waterThresholdMet(waterMl: number, weightFormulaBackDays: number) {
    const currentWeight = this.diaryLogService.getWeightByFormula(undefined, weightFormulaBackDays);
    if (!currentWeight) {
      return false;
    }

    return waterMl > currentWeight * 32.5;
  }

  protected readonly imageStoreService = inject(ImageStoreService);
  private readonly cdr = inject(ChangeDetectorRef);
  async onImageSelected(event: Event, respectiveMeal: Meal) {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) {
      return;
    }
    const base64 = await processImageToThumb(file);
    const imageId = v7();
    void this.imageStoreService.put(imageId, base64).then(() => {
      respectiveMeal.imageId = imageId;
      this.diaryLogService.saveDiaryLog();
      this.cdr.detectChanges();
    });
  }

  protected readonly recipesService = inject(RecipesService);
  async deleteImage(imageId: string) {
    this.diaryLogService.deleteMealImage(imageId);
    if (!this.recipesService.anyImage(imageId)) {
      await this.imageStoreService.delete(imageId);
    }
  }
  getLeftPositionPercentBasedOnTime() {
    const now = new Date();
    const minutesSinceMidnight = now.getHours() * 60 + now.getMinutes();
    const totalMinutesInDay = 24 * 60;
    return `${(minutesSinceMidnight / totalMinutesInDay) * 100}%`;
  }

  getTimeBasedOpacity() {
    const now = new Date();
    const minutesSinceMidnight = now.getHours() * 60 + now.getMinutes();
    const distanceFromNoon = Math.abs(minutesSinceMidnight - 720);
    return 1 - (distanceFromNoon / 720) * 0.75;
  }

  getTimeBasedBgColor() {
    const now = new Date();
    const minutesSinceMidnight = now.getHours() * 60 + now.getMinutes();
    const dayProgress = (minutesSinceMidnight / (24 * 60)) * Math.PI * 2;
    const hue = 240 + (Math.cos(dayProgress) - 1) * 97.5;
    return `hsl(${Math.round(hue)}, 25%, 65%, 0.9)`;
  }
}
