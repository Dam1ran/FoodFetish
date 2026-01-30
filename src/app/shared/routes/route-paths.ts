export class RoutePaths {
  static readonly home = '';
  static readonly diary = 'diary';
  static readonly recipes = 'recipes';
  static readonly myFoods = 'my-foods';
  static readonly options = 'options';
  static readonly releaseNotes = 'release-notes';

  static readonly loginFailed = '';
  static readonly protectedResource = '';

  static readonly all = [
    RoutePaths.home,
    RoutePaths.diary,
    RoutePaths.recipes,
    RoutePaths.myFoods,
    RoutePaths.options,
    RoutePaths.releaseNotes,
  ];

  static readonly excludedFromHistory = [RoutePaths.loginFailed, RoutePaths.protectedResource];
}
