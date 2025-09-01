// File: src/app/tab3/tab3-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tab3Page } from './tab3.page';

const routes: Routes = [
  {
    path: '',
    // --- UBAH BARIS DI BAWAH INI ---
    // Awal (Sebelum diubah):
    // component: Tab3Page,
    // atau
    // loadChildren: () => import('./tab3.module').then(m => m.Tab3PageModule)

    // Menjadi (Setelah diubah):
    loadComponent: () => import('./tab3.page').then((m) => m.Tab3Page),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Tab3PageRoutingModule {}
