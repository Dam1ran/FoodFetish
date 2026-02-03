/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, model, signal, OnDestroy, computed, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BarcodeFormat } from '@zxing/library';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ButtonIconDirective } from '../../../../shared/directives/button-icon.directive';
import { FoodsService } from '../../../../shared/services/my-foods.service';
import { Food } from '../../../../shared/entities/food.entity';
import { MealPosition } from '../../../../shared/entities/meal-position.enum';
import { DiaryLogService } from '../../../../shared/services/diary-log.service';
import { AddEditFood } from '../../../my-foods/components/add-edit-food/add-edit-food-modal';
import { FoodMacroCategory } from '../../../../shared/entities/food-macro-category.enum';

@Component({
  imports: [ZXingScannerModule, FormsModule, ButtonIconDirective],
  templateUrl: './diary-barcode-scanner.html',
  styleUrl: './diary-barcode-scanner.scss',
})
export class DiaryBarcodeScanner implements OnDestroy {
  protected readonly foodsService = inject(FoodsService);
  protected readonly diaryLogService = inject(DiaryLogService);
  protected readonly modalService = inject(NgbModal);

  protected readonly activeModal = inject(NgbActiveModal);

  protected readonly formats = [BarcodeFormat.EAN_13];
  protected readonly isScanning = signal(true);

  readonly isoDate = signal('');
  readonly mealPosition = signal(MealPosition.None);

  protected readonly code = model('');
  protected readonly respectiveFood = computed(
    () => this.code() && this.foodsService.getFoodByBarcode(this.code()),
  );

  private isFoodAdded = false;
  constructor() {
    effect(() => {
      const food = this.respectiveFood();
      if (food && !this.isFoodAdded) {
        this.addFoodToDiary(food);
        this.isFoodAdded = true;
      }
    });
  }
  onCodeResult(code: string) {
    this.code.set(code);
    this.isScanning.set(false);
  }

  addFoodToDiary(food: Food) {
    this.diaryLogService.addFood(this.isoDate(), this.mealPosition(), food);
    this.diaryLogService.updateMealTime(this.isoDate(), this.mealPosition());
    this.activeModal.close();
  }

  onAddAsNewFood(barcode: string) {
    const modal = this.modalService.open(AddEditFood);
    modal.componentInstance.food.set(
      new Food(undefined, 'new food', FoodMacroCategory.None, 0, 0, 0, 0, 0, 100, barcode, ''),
    );
  }

  ngOnDestroy() {
    if (navigator.mediaDevices && (navigator.mediaDevices as any).stop) {
      (navigator.mediaDevices as any).stop();
    }
  }
}
