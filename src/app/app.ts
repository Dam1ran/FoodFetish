import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { RoutePaths } from './shared/routes/route-paths';
import { ToastsComponent } from './shared/components/toasts.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ToastsComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected readonly routePaths = RoutePaths;
  protected readonly router = inject(Router);
  ngOnInit() {
    console.log(location.pathname + location.search);
    const redirect = sessionStorage['redirect'];
    if (redirect && redirect !== location.pathname) {
      delete sessionStorage['redirect'];
      void this.router.navigateByUrl(redirect);
    }
  }
}
