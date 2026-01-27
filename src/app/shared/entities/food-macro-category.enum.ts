export enum FoodMacroCategory {
  None,
  Carbs,
  Proteins,
  Fats,
  Vegetable,
  Complex,
  Other,
}

export const FoodMacroCategoryMap: Record<FoodMacroCategory, { bgColor: string }> = {
  [FoodMacroCategory.None]: { bgColor: '#302010' },
  [FoodMacroCategory.Carbs]: { bgColor: '#706030' },
  [FoodMacroCategory.Proteins]: { bgColor: '#305090' },
  [FoodMacroCategory.Fats]: { bgColor: '#805040' },
  [FoodMacroCategory.Vegetable]: { bgColor: '#208040' },
  [FoodMacroCategory.Complex]: { bgColor: '#654070' },
  [FoodMacroCategory.Other]: { bgColor: '#333355' },
};
