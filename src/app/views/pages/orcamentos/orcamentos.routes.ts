import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./orcamentos.component').then((c) => c.OrcamentosComponent)
  }
] as Routes;

