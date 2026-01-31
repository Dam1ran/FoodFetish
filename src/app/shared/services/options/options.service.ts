import { Injectable, signal } from '@angular/core';
import { Options } from './options.class';

@Injectable({ providedIn: 'root' })
export class OptionsService {
  readonly options = signal(new Options());

  constructor() {
    this.loadOptions();
  }
  private loadOptions() {
    const optionsRaw = localStorage.getItem('options');
    if (optionsRaw) {
      this.options.set(JSON.parse(optionsRaw));
    }
  }

  private saveOptions() {
    localStorage.setItem('options', JSON.stringify(this.options()));
  }

  setOptions(options: Options) {
    this.options.set(options);
    this.saveOptions();
  }
}
