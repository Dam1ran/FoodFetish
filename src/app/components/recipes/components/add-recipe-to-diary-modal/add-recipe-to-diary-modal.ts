import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { NgbCalendar, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePicker } from '../../../../shared/components/date-picker/date-picker';
import { ButtonIconDirective } from '../../../../shared/directives/button-icon.directive';
import { DayJsHelper } from '../../../../shared/helpers/dayjs-helper';
import { RecipesService } from '../../../../shared/services/recipes.service';
import { MealPosition, MealPositionMap } from '../../../../shared/entities/meal-position.enum';
import { DiaryLogService } from '../../../../shared/services/diary-log.service';
import { RoutePaths } from '../../../../shared/routes/route-paths';

@Component({
  selector: 'app-add-recipe-to-diary-modal',
  imports: [DatePicker, ButtonIconDirective, DatePipe, FormsModule],
  templateUrl: './add-recipe-to-diary-modal.html',
})
export class AddRecipeToDiaryModal {
  private readonly modalService = inject(NgbModal);

  protected readonly recipesService = inject(RecipesService);
  protected readonly diaryLogService = inject(DiaryLogService);
  readonly recipeId = signal('');
  readonly respectiveRecipe = computed(() => this.recipesService.getRecipeById(this.recipeId()));

  private readonly calendar = inject(NgbCalendar);
  readonly selectedDate = signal<NgbDateStruct>(this.calendar.getToday());
  readonly selectedDayJs = computed(() => DayJsHelper.fromNgbDateStruct(this.selectedDate()));

  mealPositionMap = MealPositionMap;
  protected readonly mealPositions = Object.keys(MealPosition)
    .filter((value) => !isNaN(Number(value)))
    .map((value) => ({
      label: MealPositionMap[value as keyof typeof MealPosition],
      value: +value,
    }));

  protected mealPosition = signal<MealPosition>(undefined);
  protected selectedMealPosition = linkedSignal(() => this.mealPositions[this.mealPosition() ?? 0]);
  protected readonly portions = signal(1);

  private readonly router = inject(Router);
  addRecipe() {
    const isoDate = this.selectedDayJs().toISOString();
    this.diaryLogService.addRecipe(
      isoDate,
      this.selectedMealPosition().value,
      this.portions(),
      this.respectiveRecipe(),
    );

    this.modalService.dismissAll();
    this.diaryLogService.expandMeal(isoDate, this.selectedMealPosition().value);
    this.diaryLogService.updateMealTime(isoDate, this.selectedMealPosition().value);
    void this.router.navigate([RoutePaths.diary], {
      queryParams: { diaryDate: this.selectedDayJs().toISOString() },
    });
  }
}
