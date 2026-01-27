import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'iconify',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<iconify-icon
    [icon]="icon()"
    [flip]="flip()"
    [rotate]="rotate()"
    [style]="{
      width: width() || size(),
      height: height() || size(),
      fontSize: fontSize() || size(),
    }"
  />`,
  styles: `
    :host {
      display: inline-block;
      vertical-align: middle;
      iconify-icon {
        display: flex;
        vertical-align: middle;
        align-items: center;
        justify-content: center;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconifyComponent {
  readonly icon = input.required<string>();
  readonly flip = input<string>();
  readonly rotate = input<string>();

  readonly size = input<string>();
  readonly width = input<string>();
  readonly height = input<string>();
  readonly fontSize = input<string>();
}
