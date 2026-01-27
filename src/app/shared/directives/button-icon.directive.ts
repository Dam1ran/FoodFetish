import {
  AfterViewInit,
  Directive,
  ElementRef,
  inject,
  input,
  inputBinding,
  Renderer2,
  ViewContainerRef,
} from '@angular/core';
import { IconifyComponent } from '../components/iconify.component';

@Directive({ selector: '[buttonIcon]' })
export class ButtonIconDirective implements AfterViewInit {
  private readonly vcr = inject(ViewContainerRef);
  private readonly renderer = inject(Renderer2);
  private readonly elementRef = inject(ElementRef);

  readonly buttonIcon = input.required<string>();
  readonly minWidthPx = input(120);
  readonly iconSize = input('32px');

  ngAfterViewInit() {
    this.renderer.setAttribute(this.elementRef.nativeElement, 'type', 'button');
    this.renderer.addClass(this.elementRef.nativeElement, 'd-flex');
    this.renderer.addClass(this.elementRef.nativeElement, 'justify-content-between');
    this.renderer.addClass(this.elementRef.nativeElement, 'align-items-center');
    this.renderer.addClass(this.elementRef.nativeElement, 'align-content-center');
    this.renderer.addClass(this.elementRef.nativeElement, 'flex-shrink-0');
    this.renderer.addClass(this.elementRef.nativeElement, 'gap-2');
    this.renderer.setStyle(this.elementRef.nativeElement, 'white-space', 'nowrap');
    this.renderer.setStyle(this.elementRef.nativeElement, 'padding', '0.125rem 0.5rem');

    const iconComponentRef = this.vcr.createComponent(IconifyComponent, {
      bindings: [inputBinding('icon', this.buttonIcon), inputBinding('size', this.iconSize)],
    });

    if (this.elementRef.nativeElement.childNodes?.[0]?.textContent?.trim()) {
      this.renderer.setStyle(this.elementRef.nativeElement, 'min-width', `${this.minWidthPx()}px`);
      this.renderer.setStyle(this.elementRef.nativeElement, 'padding', '0.125rem 0.5rem');
    } else {
      this.renderer.setStyle(this.elementRef.nativeElement, 'padding', '0.125rem');
    }

    this.renderer.appendChild(
      this.elementRef.nativeElement,
      iconComponentRef.location.nativeElement,
    );
  }
}
