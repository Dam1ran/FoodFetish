import {
  Component,
  effect,
  inject,
  model,
  viewChild,
  AfterViewInit,
  ElementRef,
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { form, FormField } from '@angular/forms/signals';
import { IconifyComponent } from '../../../../shared/components/iconify.component';
import { FoodsService } from '../../../../shared/services/my-foods.service';
import {
  FoodMacroCategory,
  FoodMacroCategoryMap,
} from '../../../../shared/entities/food-macro-category.enum';
import { Food } from '../../../../shared/entities/food.entity';

@Component({
  selector: 'add-edit-food-modal',
  imports: [IconifyComponent, FormField],
  templateUrl: './add-edit-food-modal.html',
  styleUrl: './add-edit-food-modal.scss',
})
export class AddEditFood implements AfterViewInit {
  protected readonly foodMacroCategory = FoodMacroCategory;
  protected readonly foodMacroCategoryMap = FoodMacroCategoryMap;

  private readonly modalService = inject(NgbModal);
  private readonly foodsService = inject(FoodsService);

  readonly food = model<Food>(new Food());
  protected readonly form = form(this.food);

  protected readonly macroCategories = Object.keys(FoodMacroCategory)
    .filter((value) => !isNaN(Number(value)))
    .map((value) => ({
      label: FoodMacroCategory[value as keyof typeof FoodMacroCategory],
      value: +value as FoodMacroCategory,
    }));

  constructor() {
    effect(() => {
      if (!this.form.id().value()) {
        const protein = this.form.protein().value();
        const carbs = this.form.carbs().value();
        const fats = this.form.fats().value();
        const fiber = this.form.fiber().value();

        const total = protein * 4 + carbs * 4 + fats * 9 + fiber * 2;
        this.form.calories().value.set(+total.toFixed(0));
      }
    });
  }

  protected readonly nameInput = viewChild<ElementRef<HTMLInputElement>>('nameInput');
  ngAfterViewInit() {
    this.nameInput()?.nativeElement.select();
  }

  addEditFood() {
    this.foodsService.addEditFood({ ...this.food() });
    this.modalService.dismissAll();
  }
}
