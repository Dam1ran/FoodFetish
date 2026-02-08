export enum ActivityLevel {
  None,
  BasalMetabolicRate,
  Sedentary,
  Light,
  Moderate,
  Active,
  VeryActive,
  ExtraActive,
}

export const ActivityLevelMap: Record<ActivityLevel, { description: string }> = {
  [ActivityLevel.None]: { description: 'None' },
  [ActivityLevel.BasalMetabolicRate]: { description: 'Basal metabolic rate (BMR)' },
  [ActivityLevel.Sedentary]: { description: 'Sedentary: little or no exercise' },
  [ActivityLevel.Light]: { description: 'Light: exercise 1-3 times/week' },
  [ActivityLevel.Moderate]: { description: 'Moderate: exercise 4-5 times/week' },
  [ActivityLevel.Active]: {
    description: 'Active: daily exercise or intense exercise 3-4 times/week',
  },
  [ActivityLevel.VeryActive]: { description: 'Very Active: intense exercise 6-7 times/week' },
  [ActivityLevel.ExtraActive]: {
    description: 'Extra Active: very intense exercise daily, or physical job',
  },
};
