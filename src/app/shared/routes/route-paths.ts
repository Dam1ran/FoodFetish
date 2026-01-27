export class RoutePaths {
  static readonly home = '';
  static readonly myFoods = 'my-foods';
  static readonly diary = 'diary';

  static readonly loginFailed = '';
  static readonly protectedResource = '';

  static readonly all = [RoutePaths.home, RoutePaths.myFoods, RoutePaths.diary];

  static readonly excludedFromHistory = [RoutePaths.loginFailed, RoutePaths.protectedResource];
}
