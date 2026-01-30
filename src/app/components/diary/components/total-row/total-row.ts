import { Component, input } from '@angular/core';
import { Stats } from '../../../../shared/entities/stats.class';

@Component({
  selector: 'total-row',
  imports: [],
  templateUrl: './total-row.html',
})
export class TotalRow {
  readonly stats = input.required<Stats>();
  readonly fixedDecimals = input(1);
}
