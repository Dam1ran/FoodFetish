import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'pascalCase' })
export class PascalCasePipe implements PipeTransform {
  transform(value: string) {
    if (!value) {
      return '';
    }

    return value
      .split(/[\s_-]+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  }
}
