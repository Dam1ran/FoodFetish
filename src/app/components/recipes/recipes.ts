import {
  Component,
  computed,
  inject,
  input,
  signal,
  viewChild,
  viewChildren,
  AfterViewInit,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { v7 } from 'uuid';
import { AddRecipeToDiaryModal } from './components/add-recipe-to-diary-modal/add-recipe-to-diary-modal';
import { RecipesService } from '../../shared/services/recipes.service';
import { IconifyComponent } from '../../shared/components/iconify.component';
import { ButtonIconDirective } from '../../shared/directives/button-icon.directive';
import { RoutePaths } from '../../shared/routes/route-paths';
import {
  getMealProtein,
  getMealCarbs,
  getMealFats,
  getMealFiber,
  getMealCalories,
  getMealWeight,
} from '../../shared/entities/meal.entity';
import { MealPosition } from '../../shared/entities/meal-position.enum';
import { DayJsHelper } from '../../shared/helpers/dayjs-helper';
import { MealThumb } from '../diary/components/meal-thumb/meal-thumb';
import { processImageToThumb } from '../../shared/helpers/image-helper';
import { ImageStoreService } from '../../shared/services/image-store.service';
import { DiaryLogService } from '../../shared/services/diary-log.service';
import { Recipe } from '../../shared/entities/recipe.entity';

@Component({
  selector: 'app-recipes',
  imports: [FormsModule, ButtonIconDirective, IconifyComponent, DragDropModule, MealThumb],
  templateUrl: './recipes.html',
  styleUrl: './recipes.scss',
})
export class Recipes implements AfterViewInit {
  protected readonly router = inject(Router);
  protected readonly recipesService = inject(RecipesService);
  protected readonly diaryLogService = inject(DiaryLogService);
  protected readonly modalService = inject(NgbModal);
  protected recipes = computed(() => {
    return this.recipesService
      .recipes()
      .filter((f) => f.name?.toLowerCase().includes(this.nameFilter().toLowerCase()));
  });
  protected nameFilter = signal('');

  protected readonly editNoteRecipeId = signal('');
  protected readonly editNoteRecipe = signal('');
  private readonly editRecipeNoteDialogRef = viewChild('editRecipeNoteDialog');
  toggleEditRecipeNoteDialog(recipeId: string, recipeNote: string) {
    this.editNoteRecipeId.set(recipeId);
    this.editNoteRecipe.set(recipeNote);

    this.modalService
      .open(this.editRecipeNoteDialogRef(), { size: 'sm', centered: true })
      .result.catch(() => {
        this.editNoteRecipeId.set('');
        this.editNoteRecipe.set('');
      });
  }
  private readonly weightInputRefs = viewChildren<ElementRef<HTMLInputElement>>('weightInput');
  ngAfterViewInit() {
    this.weightInputRefs()
      ?.find((el) => el.nativeElement.attributes.getNamedItem('to-focus').value === 'true')
      ?.nativeElement.focus();
  }

  toggleAddRecipeToDiary(recipeId: string) {
    const modal = this.modalService.open(AddRecipeToDiaryModal, { size: 'sm', centered: true });
    modal.componentInstance.recipeId.set(recipeId);

    if (this.diaryDate() && this.mealPosition()) {
      modal.componentInstance.selectedDate.set(DayJsHelper.toNgbDateStruct(this.diaryDate()));
      modal.componentInstance.mealPosition.set(this.mealPosition());
    }
  }

  readonly diaryDate = input('');
  readonly mealPosition = input<MealPosition>();

  addFood(recipeId: string) {
    void this.router.navigate([RoutePaths.myFoods], { queryParams: { recipeId } });
  }

  getMealProtein = getMealProtein;
  getMealCarbs = getMealCarbs;
  getMealFats = getMealFats;
  getMealFiber = getMealFiber;
  getMealCalories = getMealCalories;
  getMealWeight = getMealWeight;

  addRecipe() {
    this.recipesService.setExpandedRecipeId(this.recipesService.addRecipe());
  }

  protected readonly imageStoreService = inject(ImageStoreService);
  private readonly cdr = inject(ChangeDetectorRef);
  async onImageSelected(event: Event, recipe: Recipe) {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) {
      return;
    }
    const base64 = await processImageToThumb(file);
    const imageId = v7();
    void this.imageStoreService.put(imageId, base64).then(() => {
      this.recipesService.setImage(recipe.id, imageId);
      this.cdr.detectChanges();
    });
  }
  async deleteImage(imageId: string) {
    await this.imageStoreService.delete(imageId);
    this.recipesService.deleteImage(imageId);
  }
}
