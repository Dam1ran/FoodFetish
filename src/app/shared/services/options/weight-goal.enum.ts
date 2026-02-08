export enum WeightGoal {
  None,
  UnsustainableCut,
  Cut,
  MildCut,
  Maintain,
  MildGain,
  QuickerGain,
}

export const WeightGoalMap: Record<WeightGoal, { description: string }> = {
  [WeightGoal.None]: { description: 'None' },
  [WeightGoal.UnsustainableCut]: { description: 'Unsustainable cut' },
  [WeightGoal.Cut]: { description: 'Cut' },
  [WeightGoal.MildCut]: { description: 'Mild cut' },
  [WeightGoal.Maintain]: { description: 'Maintain' },
  [WeightGoal.MildGain]: { description: 'Mild gain' },
  [WeightGoal.QuickerGain]: { description: 'Quicker gain' },
};
