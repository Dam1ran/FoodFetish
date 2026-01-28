import { Component, inject } from '@angular/core';
import { VersionService } from '../../shared/services/version/version.service';

@Component({
  selector: 'app-release-notes',
  imports: [],
  templateUrl: './release-notes.html',
})
export class ReleaseNotes {
  protected readonly versionService = inject(VersionService);
}
