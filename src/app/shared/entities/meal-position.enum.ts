export enum MealPosition {
  None = 0,
  MealOne = 1,
  MealTwo = 2,
  MealThree = 3,
  MealFour = 4,
  MealFive = 5,
  Snacks = 6,
}

export const MealPositionMap: Record<MealPosition, string> = {
  [MealPosition.None]: 'None',
  [MealPosition.MealOne]: 'Meal I',
  [MealPosition.MealTwo]: 'Meal II',
  [MealPosition.MealThree]: 'Meal III',
  [MealPosition.MealFour]: 'Meal IV',
  [MealPosition.MealFive]: 'Meal V',
  [MealPosition.Snacks]: 'Snacks',
};
