import { inject, Injectable } from '@angular/core';
import { signal } from '@angular/core';
import { v7 } from 'uuid';
import { FoodsService } from './my-foods.service';
import { Recipe } from '../entities/recipe.entity';

@Injectable({ providedIn: 'root' })
export class RecipesService {
  protected readonly foodsService = inject(FoodsService);
  readonly recipes = signal<Recipe[]>([]);

  constructor() {
    this.loadRecipes();
  }

  private loadRecipes() {
    const recipesRaw = localStorage.getItem('recipes');
    if (recipesRaw) {
      this.recipes.set(JSON.parse(recipesRaw));
    } else {
      this.recipes.set([]);
    }
  }

  private saveRecipes() {
    localStorage.setItem('recipes', JSON.stringify(this.recipes()));
  }
  setRecipes(recipes: Recipe[]) {
    localStorage.setItem('recipes', JSON.stringify(recipes));
    this.loadRecipes();
  }
  downloadRecipes() {
    const json = JSON.stringify(this.recipes());
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recipes.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  addRecipe() {
    this.recipes.update((recipes) => [new Recipe(v7(), 'Empty recipe'), ...recipes]);
    this.saveRecipes();
  }

  updateRecipeName(recipeId: string, newName: string) {
    this.recipes.update((recipes) =>
      recipes.map((recipe) => (recipe.id === recipeId ? { ...recipe, name: newName } : recipe)),
    );
    this.saveRecipes();
  }

  updateRecipeNote(recipeId: string, newNote: string) {
    this.recipes.update((recipes) =>
      recipes.map((recipe) => (recipe.id === recipeId ? { ...recipe, note: newNote } : recipe)),
    );

    this.saveRecipes();
  }

  addFood(recipeId: string, foodId: string) {
    this.recipes.update((recipes) =>
      recipes.map((recipe) => {
        if (recipe.id === recipeId) {
          const food = this.foodsService.getFoodById(foodId);
          if (food) {
            return { ...recipe, foods: [...recipe.foods, { ...food }] };
          }
        }

        return recipe;
      }),
    );

    this.saveRecipes();
  }

  updateFoodWeight(recipeId: string, foodIndex: number, newWeight: string) {
    this.recipes.update((recipes) =>
      recipes.map((recipe) =>
        recipe.id === recipeId
          ? {
              ...recipe,
              foods: recipe.foods.map((food, index) =>
                index === foodIndex ? { ...food, weight: +newWeight } : food,
              ),
            }
          : recipe,
      ),
    );

    this.saveRecipes();
  }

  updateRecipePortions(recipeId: string, newPortions: string) {
    this.recipes.update((recipes) =>
      recipes.map((recipe) =>
        recipe.id === recipeId ? { ...recipe, portions: +newPortions } : recipe,
      ),
    );

    this.saveRecipes();
  }

  removeFood(recipeId: string, foodIndex: number) {
    this.recipes.update((recipes) =>
      recipes.map((recipe) =>
        recipe.id === recipeId
          ? {
              ...recipe,
              foods: recipe.foods.filter((_, index) => index !== foodIndex),
            }
          : recipe,
      ),
    );

    if (this.recipes().find((recipe) => recipe.id === recipeId && recipe.foods.length === 0)) {
      this.recipes.update((recipes) => recipes.filter((recipe) => recipe.id !== recipeId));
    }

    this.saveRecipes();
  }

  changeFoodOrder(recipeId: string, previousIndex: number, currentIndex: number) {
    this.recipes.update((recipes) =>
      recipes.map((recipe) =>
        recipe.id === recipeId
          ? {
              ...recipe,
              foods: recipe.foods.map((_, i) =>
                i === previousIndex
                  ? recipe.foods[currentIndex]
                  : i === currentIndex
                    ? recipe.foods[previousIndex]
                    : recipe.foods[i],
              ),
            }
          : recipe,
      ),
    );

    this.saveRecipes();
  }

  getRecipeById(recipeId: string) {
    return this.recipes().find((r) => r.id === recipeId);
  }
}
