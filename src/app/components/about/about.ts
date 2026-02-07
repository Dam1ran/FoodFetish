import { Component } from '@angular/core';
import { IconifyComponent } from '../../shared/components/iconify.component';

@Component({
  selector: 'about',
  imports: [IconifyComponent],
  templateUrl: './about.html',
})
export class About {
  protected readonly aboutNotes = [
    {
      icon: 'iconoir:weight',
      iconClass: 'text-info-emphasis',
      text: 'Features improved averaged weight formula!',
    },
    {
      icon: 'ph:tilde-fill',
      iconClass: 'text-secondary-emphasis',
      text: 'Graphs for daily calories and weight for easy conclusions.',
    },
    {
      icon: 'circum:glass',
      iconClass: 'text-info-emphasis',
      text: 'Water tracker background color reaction upon quantity based on provided weight.',
    },
    {
      icon: 'material-symbols-light:circle',
      iconClass: 'text-success',
      text: 'Day indicator if water/meals/activity/weight are filled in for that day.',
    },
    {
      icon: 'game-icons:meal',
      iconClass: '',
      text: '(x6) Six meals and a snack.',
    },
    {
      icon: 'pajamas:recipe',
      iconClass: 'text-primary',
      text: 'Recipes for food grouping.',
    },
    {
      icon: 'si:barcode-fill',
      iconClass: 'text-primary-emphasis',
      text: 'Barcode scanner to set/get foods.',
    },
    {
      icon: 'medical-icon:i-nutrition',
      iconClass: 'text-success',
      text: 'Macros tracker with background color changes.',
    },
    {
      icon: 'ic:round-sync',
      iconClass: 'text-primary-emphasis',
      text: 'Google Drive sync.',
    },
    {
      icon: 'lucide:activity',
      iconClass: 'text-warning',
      text: 'Add your activities.',
    },
    {
      icon: 'bi:collection',
      iconClass: 'text-danger-emphasis',
      text: 'And many more.',
    },
  ];
}
