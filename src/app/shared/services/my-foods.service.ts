import { Injectable, signal } from '@angular/core';
import { v7 } from 'uuid';
import { Food } from '../entities/food.entity';

@Injectable({ providedIn: 'root' })
export class FoodsService {
  readonly foods = signal<Food[]>([]);

  constructor() {
    this.loadFoods();
  }

  private loadFoods() {
    const foods = localStorage.getItem('foods');
    if (foods) {
      this.foods.set(JSON.parse(foods));
    } else {
      this.foods.set([]);
    }
  }

  addEditFood(food: Food) {
    const existingFood = this.foods().find((f) => f.id === food.id);
    if (existingFood) {
      this.foods.update((foods) => foods.map((f) => (f.id === food.id ? food : f)));
    } else {
      this.foods.update((foods) => [
        ...foods,
        {
          ...food,
          id: food.id || v7(),
        },
      ]);
    }

    localStorage.setItem('foods', JSON.stringify(this.foods()));
  }

  deleteFood(food: Food) {
    this.foods.update((foods) => foods.filter((f) => f.id !== food.id));
    localStorage.setItem('foods', JSON.stringify(this.foods()));
  }

  downloadFoods() {
    const json = JSON.stringify(this.foods());
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'foods.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  setFoods(foods: Food[]) {
    localStorage.setItem('foods', JSON.stringify(foods));
    this.loadFoods();
  }

  getFoodById(foodId: string) {
    return this.foods().find((f) => f.id === foodId);
  }
}
