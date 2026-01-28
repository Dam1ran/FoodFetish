import { Component, inject, OnInit } from '@angular/core';
import { VersionService } from '../../shared/services/version/version.service';

@Component({
  selector: 'app-release-notes',
  imports: [],
  templateUrl: './release-notes.html',
})
export class ReleaseNotes implements OnInit {
  protected readonly versionService = inject(VersionService);

  ngOnInit() {
    localStorage.setItem('productVersion', this.versionService.releases[0].version);
  }
}
