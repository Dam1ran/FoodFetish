import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ActivityLevel } from './activity-level.enum';
import { WeightGoal } from './weight-goal.enum';

export class Options {
  height?: number;
  bodyFatPercentage?: number;
  dateOfBirth?: NgbDateStruct;
  isMale = false;
  activityLevel = ActivityLevel.None;
  weightGoal = WeightGoal.None;
  weightFormulaBackDays = 7;
}
