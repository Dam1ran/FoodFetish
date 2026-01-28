export enum VersionChangeType {
  None,
  Feature,
  Update,
  Fix,
  Remove,
  Security,
  Performance,
  Maintenance,
  Other,
}

export const versionChangeTypeColorMap: Record<VersionChangeType, string> = {
  [VersionChangeType.None]: 'unset',
  [VersionChangeType.Feature]: 'rgba(190, 70, 170, 1)',
  [VersionChangeType.Update]: 'rgba(140, 90, 220, 1)',
  [VersionChangeType.Fix]: 'rgba(200, 170, 110, 1)',
  [VersionChangeType.Remove]: 'rgba(220, 150, 130, 1)',
  [VersionChangeType.Security]: 'rgba(80, 70, 240, 1)',
  [VersionChangeType.Performance]: 'rgba(90, 150, 50, 1)',
  [VersionChangeType.Maintenance]: 'rgba(150, 150, 190, 1)',
  [VersionChangeType.Other]: 'rgba(150, 170, 150, 1)',
};
