import { Injectable } from '@angular/core';
import { VersionChangeType } from './version-change-type.enum';
import { versionChangeTypeColorMap } from './version-change-type.enum';

@Injectable({ providedIn: 'root' })
export class VersionService {
  readonly versionChangeTypeColorMap = versionChangeTypeColorMap;
  readonly releases = [
    {
      version: '1.1.2',
      date: '26.01.2026',
      changes: [
        {
          description: 'Added release notes to track changes, dev branch.',
          type: VersionChangeType.Maintenance,
        },
      ],
    },
    {
      version: '1.1.1',
      date: '26.01.2026',
      changes: [
        {
          description: 'Code cleanups.',
          type: VersionChangeType.Maintenance,
        },
      ],
    },
    {
      version: '1.1.0',
      date: '26.01.2026',
      changes: [
        {
          description: 'Add home page with some navigation.',
          type: VersionChangeType.Feature,
        },
      ],
    },
    {
      version: '1.0.2',
      date: '26.01.2026',
      changes: [
        {
          description: 'Allow deploy on GH pages.',
          type: VersionChangeType.Maintenance,
        },
        {
          description: 'Fix page not found(404) on refresh as of GH static nature.',
          type: VersionChangeType.Fix,
        },
      ],
    },
    {
      version: '1.0.1',
      date: '25.01.2026',
      changes: [
        {
          description:
            'Implementation of both pages `my-foods` and `diary` with respective functionalities.',
          type: VersionChangeType.Feature,
        },
      ],
    },
    {
      version: '1.0.0',
      date: '24.01.2026',
      changes: [
        {
          description:
            'Initial code. Some infrastructure, boiler-plate, pages structure and project setup.',
          type: VersionChangeType.Maintenance,
        },
      ],
    },
  ];
}
