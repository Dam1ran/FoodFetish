import { Routes } from '@angular/router';
import { RoutePaths } from './route-paths';

export const routes: Routes = [
  {
    path: RoutePaths.home,
    loadComponent: () => import('../../components/home/home').then((c) => c.Home),
  },
  {
    path: RoutePaths.myFoods,
    loadComponent: () => import('../../components/my-foods/my-foods').then((c) => c.MyFoods),
  },
  {
    path: RoutePaths.diary,
    loadComponent: () => import('../../components/diary/diary').then((c) => c.Diary),
  },
  {
    path: RoutePaths.dayTemplate,
    loadComponent: () =>
      import('../../components/day-template/day-template').then((c) => c.DayTemplate),
  },
];
