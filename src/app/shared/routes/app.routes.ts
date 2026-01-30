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
    path: RoutePaths.releaseNotes,
    loadComponent: () =>
      import('../../components/release-notes/release-notes').then((c) => c.ReleaseNotes),
  },
  {
    path: RoutePaths.recipes,
    loadComponent: () => import('../../components/recipes/recipes').then((c) => c.Recipes),
  },
  {
    path: RoutePaths.options,
    loadComponent: () => import('../../components/options/options').then((c) => c.Options),
  },
];
