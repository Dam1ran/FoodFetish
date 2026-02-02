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
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, Location } from '@angular/common';
import { FoodRow } from './components/food-row/food-row';
import { DiaryRecipe } from './components/diary-recipe/diary-recipe';
import { TotalRow } from './components/total-row/total-row';
import { Weekdays } from './components/weekday/weekdays';
import { WeightInWidget } from './components/weight-in-widget/weight-in-widget';
import { ActivityWidget } from './components/activity-widget/activity-widget';
import { DiaryBarcodeScanner } from './components/diary-barcode-scanner/diary-barcode-scanner';
import { MacrosWidget } from './components/macros-widget/macros-widget';
import { ButtonIconDirective } from '../../shared/directives/button-icon.directive';
import { DayTemplateService } from '../../shared/services/day-template.service';
import { DiaryLogService } from '../../shared/services/diary-log.service';
import { DayJsHelper } from '../../shared/helpers/dayjs-helper';
import { MealPosition, MealPositionMap } from '../../shared/entities/meal-position.enum';
import { RoutePaths } from '../../shared/routes/route-paths';
import { IconifyComponent } from '../../shared/components/iconify.component';

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
  ],
  templateUrl: './diary.html',
})
export class Diary implements AfterViewInit {
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
  getRespectiveRecipes(mealPosition) {
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
}
