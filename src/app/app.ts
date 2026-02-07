import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { RoutePaths } from './shared/routes/route-paths';
import { ToastsComponent } from './shared/components/toasts.component';
import { GoogleDriveService } from './shared/services/google-drive.service';
import { IconifyComponent } from './shared/components/iconify.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ToastsComponent, IconifyComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected readonly googleDriveService = inject(GoogleDriveService);
  protected readonly routePaths = RoutePaths;
  protected readonly router = inject(Router);

  ngOnInit() {
    const redirect = sessionStorage['redirect'];
    if (redirect) {
      delete sessionStorage['redirect'];
      void this.router.navigateByUrl(redirect);
    }
  }

  trySync() {
    void this.googleDriveService.sync();
  }
}
