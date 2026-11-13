import { Routes } from '@angular/router';
import { BaseComponent } from './views/layout/base/base.component';
import { appGuard } from './core/guards/app.guard';

export const routes: Routes = [
  {
    path: '',
    component: BaseComponent,
    canActivateChild: [appGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./views/pages/home/home.routes')
      },
      {
        path: 'orcamentos',
        loadChildren: () => import('./views/pages/orcamentos/orcamentos.routes')
      },
      {
        path: 'inicio',
        redirectTo: '',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'error',
    loadComponent: () => import('./views/pages/error/error.component').then((c) => c.ErrorComponent)
  },
  {
    path: 'error/:type',
    loadComponent: () => import('./views/pages/error/error.component').then((c) => c.ErrorComponent)
  },
  { path: '**', redirectTo: 'error/404', pathMatch: 'full' }
];

