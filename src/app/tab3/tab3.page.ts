// File: src/app/tab3/tab3.page.ts

import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class Tab3Page {
  public actionSheetButtons = [
    {
      text: 'Hapus',
      role: 'destructive',
      data: {
        action: 'delete',
      },
    },
    {
      text: 'Bagikan',
      data: {
        action: 'share',
      },
    },
    {
      text: 'Batal',
      role: 'cancel',
      data: {
        action: 'cancel',
      },
    },
  ];

  constructor() {}
}
