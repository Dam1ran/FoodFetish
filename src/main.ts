/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import 'bootstrap';
import 'iconify-icon';
import utc from 'dayjs/plugin/utc';
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import isoWeek from 'dayjs/plugin/isoWeek';
import minMax from 'dayjs/plugin/minMax';
import dayjs from 'dayjs';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig).catch((err) => console.error(err));

dayjs.extend(utc);
dayjs.extend(weekday);
dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);
dayjs.extend(minMax);

document.addEventListener('click', (event) => {
  const target = event.target as HTMLInputElement;
  if (target.tagName === 'INPUT') {
    target.select();
  }
});
