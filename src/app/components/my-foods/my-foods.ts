import { Component, computed, ElementRef, input, signal, viewChild } from '@angular/core';
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
import { DairyLogService } from '../../shared/services/dairy-log.service';
import { RoutePaths } from '../../shared/routes/route-paths';

@Component({
  imports: [ButtonIconDirective, FormsModule],
  templateUrl: './my-foods.html',
  styleUrl: './my-foods.scss',
})
export class MyFoods {
  private readonly modalService = inject(NgbModal);

  protected readonly myFoodsService = inject(FoodsService);

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

  protected addFood() {
    this.modalService.open(AddEditFood);
  }

  private readonly dairyLogService = inject(DairyLogService);
  private readonly router = inject(Router);
  protected addFoodToDiary(food: Food) {
    if (this.diaryDate() && this.mealPosition()) {
      this.dairyLogService.addFood(this.diaryDate(), this.mealPosition(), food);
      void this.router.navigate([RoutePaths.diary]);
    }
  }

  protected editFood(food: Food) {
    const modal = this.modalService.open(AddEditFood);
    modal.componentInstance.food.set(food);
  }

  protected deleteFood(food: Food) {
    this.myFoodsService.deleteFood(food);
  }

  saveFoods() {
    this.myFoodsService.saveFoods();
  }

  protected readonly jsonUploadInput = viewChild<ElementRef<HTMLInputElement>>('jsonUpload');
  loadFoods() {
    this.jsonUploadInput().nativeElement.click();
  }
  onLoadFoodsFromFile(fileEvent) {
    const target = fileEvent.target as DataTransfer;
    if (target.files?.length !== 1) {
      this.jsonUploadInput().nativeElement.value = '';

      return;
    }
    const file = target.files?.[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const contents = e.target?.result;
      if (contents) {
        this.myFoodsService.loadFoodsFromJson(contents as string);
      }
    };
    reader.readAsText(file);
    this.jsonUploadInput().nativeElement.value = '';
  }
}
