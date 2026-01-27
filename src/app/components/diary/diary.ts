import { Component, inject, signal, viewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbCalendar, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Collapse } from 'bootstrap';
import { Router } from '@angular/router';
import { ButtonIconDirective } from '../../shared/directives/button-icon.directive';
import { DatePicker } from '../../shared/components/date-picker/date-picker';
import { DayTemplateService } from '../../shared/services/day-template.service';
import {
  getMealCalories,
  getMealCarbs,
  getMealFats,
  getMealFiber,
  getMealProtein,
  Meal,
} from '../../shared/entities/meal.entity';
import { DairyLogService } from '../../shared/services/dairy-log.service';
import { DayJsHelper } from '../../shared/helpers/dayjs-helper';
import { MealPosition, MealPositionMap } from '../../shared/entities/meal-position.enum';
import { RoutePaths } from '../../shared/routes/route-paths';

@Component({
  selector: 'diary',
  imports: [ButtonIconDirective, ReactiveFormsModule, FormsModule, DatePicker],
  templateUrl: './diary.html',
  styleUrl: './diary.scss',
})
export class Diary {
  readonly weekdays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  private readonly calendar = inject(NgbCalendar);
  readonly selectedDate = signal<NgbDateStruct>(this.calendar.getToday());

  protected isDaySelected(dateLbl: string) {
    const today = DayJsHelper.getStartOfToday();
    const date = DayJsHelper.fromNgbDateStruct(this.selectedDate());

    return (
      dateLbl === this.weekdays[date.day() === 0 ? 6 : date.day() - 1] &&
      today.isoWeek() === date.isoWeek()
    );
  }

  protected isTodayLbl(dateLbl: string) {
    const date = DayJsHelper.getStartOfToday();
    return dateLbl === this.weekdays[date.day() === 0 ? 6 : date.day() - 1];
  }

  protected selectWeekDay(weekday: string) {
    const dayIndex = this.weekdays.indexOf(weekday);
    const today = DayJsHelper.getStartOfToday();
    let date = DayJsHelper.fromNgbDateStruct(this.selectedDate());

    if (today.isoWeek() !== date.isoWeek()) {
      return;
    }

    date = date.isoWeekday(dayIndex + 1);

    this.selectedDate.set({ day: date.date(), month: date.month() + 1, year: date.year() });
  }

  protected dayTemplateService = inject(DayTemplateService);
  private readonly router = inject(Router);
  addFood(mealPosition: MealPosition, collapsible: HTMLElement) {
    Collapse.getOrCreateInstance(collapsible).show();

    const diaryDate = DayJsHelper.fromNgbDateStruct(this.selectedDate()).toISOString();
    void this.router.navigate([RoutePaths.myFoods], { queryParams: { diaryDate, mealPosition } });
  }

  protected dairyLogService = inject(DairyLogService);
  mealPositionMap = MealPositionMap;
  getRespectiveMeal(mealPosition: MealPosition) {
    const date = DayJsHelper.fromNgbDateStruct(this.selectedDate()).toISOString();
    return this.dairyLogService.getRespectiveMeal(date, mealPosition);
  }

  getMealProtein = getMealProtein;
  getMealCarbs = getMealCarbs;
  getMealFats = getMealFats;
  getMealFiber = getMealFiber;
  getMealCalories = getMealCalories;

  updateMealName(value: string, mealPosition: MealPosition) {
    this.dairyLogService.updateMealName(
      DayJsHelper.fromNgbDateStruct(this.selectedDate()).toISOString(),
      mealPosition,
      value,
    );
  }

  removeFood(mealPosition: MealPosition, foodIndex: number, respectiveMeal: Meal) {
    this.dairyLogService.removeFood(
      DayJsHelper.fromNgbDateStruct(this.selectedDate()).toISOString(),
      mealPosition,
      foodIndex,
    );

    if (!respectiveMeal.foods.length) {
      this.dairyLogService.clearMeal(
        DayJsHelper.fromNgbDateStruct(this.selectedDate()).toISOString(),
        mealPosition,
      );
    }
  }

  updateFoodWeight(mealPosition: MealPosition, foodIndex: number, weight: string) {
    this.dairyLogService.updateFoodWeight(
      DayJsHelper.fromNgbDateStruct(this.selectedDate()).toISOString(),
      mealPosition,
      foodIndex,
      +weight,
    );
  }

  getDayStats() {
    return this.dairyLogService.getDayStats(
      DayJsHelper.fromNgbDateStruct(this.selectedDate()).toISOString(),
    );
  }

  protected readonly openedAccordionIndex = signal(-1);
  setOpenedAccordionIndex(index: number) {
    if (this.openedAccordionIndex() === index) {
      this.openedAccordionIndex.set(-1);
    } else {
      this.openedAccordionIndex.set(index);
    }
  }

  private readonly modalService = inject(NgbModal);
  private readonly editMealNoteDialogRef = viewChild('editMealNoteDialog');
  toggleEditMealNoteDialog() {
    this.modalService.open(this.editMealNoteDialogRef(), { size: 'sm', centered: true });
  }

  updateMealNote(note: string, mealPosition: MealPosition, mealId: string) {
    this.dairyLogService.updateMealNote(
      DayJsHelper.fromNgbDateStruct(this.selectedDate()).toISOString(),
      mealPosition,
      mealId,
      note,
    );
  }
}
