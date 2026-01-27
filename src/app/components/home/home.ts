import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RoutePaths } from '../../shared/routes/route-paths';

@Component({
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  protected readonly routePaths = RoutePaths;
}
