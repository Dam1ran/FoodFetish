import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RoutePaths } from '../../shared/routes/route-paths';
import { VersionService } from '../../shared/services/version/version.service';
import { IconifyComponent } from '../../shared/components/iconify.component';

@Component({
  imports: [RouterLink, IconifyComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  protected readonly routePaths = RoutePaths;
  protected readonly versionService = inject(VersionService);
}
