import { Injectable } from '@angular/core';
import { VersionChangeType } from './version-change-type.enum';
import { versionChangeTypeColorMap } from './version-change-type.enum';

@Injectable({ providedIn: 'root' })
export class VersionService {
  readonly versionChangeTypeColorMap = versionChangeTypeColorMap;

  isNewVersion() {
    return localStorage.getItem('productVersion') !== this.releases[0].version;
  }

  readonly releases = [
    {
      version: '1.6.0',
      date: '1.02.2026',
      changes: [
        {
          description: 'Barcode scanner for add food and diary.',
          type: VersionChangeType.Feature,
        },
      ],
    },
    {
      version: '1.5.0',
      date: '1.02.2026',
      changes: [
        {
          description: 'Activities widget. Some small adjustments.',
          type: VersionChangeType.Feature,
        },
      ],
    },
    {
      version: '1.4.0',
      date: '01.02.2026',
      changes: [
        {
          description: 'Water track, day note. Some small adjustments.',
          type: VersionChangeType.Feature,
        },
      ],
    },
    {
      version: '1.3.2',
      date: '31.01.2026',
      changes: [
        {
          description: 'Diary indicator react on weight in also. Some corrections',
          type: VersionChangeType.Maintenance,
        },
      ],
    },
    {
      version: '1.3.1',
      date: '31.01.2026',
      changes: [
        {
          description: 'Diary UX improvements.',
          type: VersionChangeType.Maintenance,
        },
      ],
    },
    {
      version: '1.3.0',
      date: '31.01.2026',
      changes: [
        {
          description: 'Added weight-in widget with modified median formula (7days).',
          type: VersionChangeType.Feature,
        },
        {
          description: 'Some options added.',
          type: VersionChangeType.Maintenance,
        },
        {
          description: 'Minor fixes.',
          type: VersionChangeType.Fix,
        },
      ],
    },
    {
      version: '1.2.0',
      date: '30.01.2026',
      changes: [
        {
          description: 'Added recipe page with wiring functionalities.',
          type: VersionChangeType.Feature,
        },
        {
          description: 'Added toasts component.',
          type: VersionChangeType.Maintenance,
        },
        {
          description: 'Fixed bug with edit meal note.',
          type: VersionChangeType.Fix,
        },
        {
          description:
            'Persist expanded meal. Display meal weight. Some rearrangements. Some UX improvements and refactors. Added day with food indicator.',
          type: VersionChangeType.Update,
        },
      ],
    },
    {
      version: '1.1.2',
      date: '28.01.2026',
      changes: [
        {
          description: 'Added release notes to track changes, dev branch.',
          type: VersionChangeType.Maintenance,
        },
      ],
    },
    {
      version: '1.1.1',
      date: '27.01.2026',
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
