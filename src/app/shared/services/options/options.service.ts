import { Injectable, signal } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Options } from './options.class';
import { ActivityLevel } from './activity-level.enum';
import { WeightGoal } from './weight-goal.enum';
import { DayJsHelper } from '../../helpers/dayjs-helper';

@Injectable({ providedIn: 'root' })
export class OptionsService {
  readonly options = signal(new Options());

  constructor() {
    this.loadOptions();
  }
  private loadOptions() {
    const optionsRaw = localStorage.getItem('options');
    if (optionsRaw) {
      this.options.set(JSON.parse(optionsRaw));
    }
  }

  private saveOptions() {
    localStorage.setItem('options', JSON.stringify(this.options()));
  }

  setOptions(options: Options) {
    this.options.set(options);
    this.saveOptions();
  }

  updateHeight(value: string) {
    const height = +value;
    if (isNaN(height) || height <= 0) {
      return;
    }
    this.options.update((options) => {
      options.height = height;
      return options;
    });

    this.saveOptions();
  }
  updateBodyFatPercent(value: string) {
    const bodyFatPercent = +value;
    if (isNaN(bodyFatPercent) || bodyFatPercent < 0 || bodyFatPercent > 100) {
      return;
    }
    this.options.update((options) => {
      options.bodyFatPercentage = bodyFatPercent;
      return options;
    });

    this.saveOptions();
  }

  updateDateOfBirth(dob: NgbDateStruct) {
    this.options.update((options) => {
      options.dateOfBirth = dob;
      return options;
    });

    this.saveOptions();
  }

  setIsMale(value: boolean) {
    this.options.update((options) => {
      options.isMale = value;
      return options;
    });

    this.saveOptions();
  }

  setActivityLevel(activityLevel: ActivityLevel) {
    this.options.update((options) => {
      options.activityLevel = activityLevel;
      return options;
    });

    this.saveOptions();
  }
  setWeightGoal(weightGoal: WeightGoal) {
    this.options.update((options) => {
      options.weightGoal = weightGoal;
      return options;
    });

    this.saveOptions();
  }

  getCaloriesForActivityLevel(weight: number) {
    const heightCm = this.options().height ?? 0;
    const age = this.options().dateOfBirth
      ? DayJsHelper.getStartOfToday().diff(
          DayJsHelper.fromNgbDateStruct(this.options().dateOfBirth),
          'year',
        )
      : 0;
    const isMale = !!this.options().isMale;
    const activityLevel = this.options().activityLevel ?? ActivityLevel.None;
    if (weight <= 0 || heightCm <= 0 || activityLevel === ActivityLevel.None) {
      return 0;
    }

    if (this.options().bodyFatPercentage) {
      const leanBodyMass = weight * (1 - this.options().bodyFatPercentage / 100);
      return this.getCaloriesByKatchMcArdle(leanBodyMass, activityLevel);
    } else {
      return this.getCaloriesByHarrisBenedict(weight, heightCm, isMale, age, activityLevel);
    }
  }

  getCaloriesForWeightGoal(weight: number) {
    const weightGoal = this.options().weightGoal ?? WeightGoal.None;
    const calories = this.getCaloriesForActivityLevel(weight);
    if (weightGoal === WeightGoal.None) {
      return calories;
    }

    switch (weightGoal) {
      case WeightGoal.UnsustainableCut:
        return calories - 1000;
      case WeightGoal.Cut:
        return calories - 500;
      case WeightGoal.MildCut:
        return calories - 250;
      case WeightGoal.Maintain:
        return calories;
      case WeightGoal.MildGain:
        return calories + 250;
      case WeightGoal.QuickerGain:
        return calories + 500;
      default:
        return calories;
    }
  }

  private getCaloriesByHarrisBenedict(
    weight: number,
    heightCm: number,
    isMale: boolean,
    age: number,
    activityLevel: ActivityLevel,
  ) {
    let bmr = 0;
    if (isMale) {
      bmr = 9.65 * weight + 5.73 * heightCm - 5.08 * age + 260;
    } else {
      bmr = 7.38 * weight + 6.07 * heightCm - 2.31 * age + 43;
    }

    return bmr * this.getActivityLevelMultiplier(activityLevel);
  }

  private getCaloriesByKatchMcArdle(leanBodyMass: number, activityLevel: ActivityLevel) {
    const bmr = 370 + 21.6 * leanBodyMass;
    return bmr * this.getActivityLevelMultiplier(activityLevel);
  }

  getActivityLevelMultiplier(activityLevel: ActivityLevel) {
    switch (activityLevel) {
      case ActivityLevel.None:
        return 0;
      case ActivityLevel.BasalMetabolicRate:
        return 1;
      case ActivityLevel.Sedentary:
        return 1.2;
      case ActivityLevel.Light:
        return 1.375;
      case ActivityLevel.Moderate:
        return 1.5;
      case ActivityLevel.Active:
        return 1.7;
      case ActivityLevel.VeryActive:
        return 1.8;
      case ActivityLevel.ExtraActive:
        return 1.9;
      default:
        return 1;
    }
  }
}
