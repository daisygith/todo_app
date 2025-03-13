import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tasks',
    loadChildren: () => import('./todo/todo.routes').then((m) => m.todoRoutes),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/tasks',
  },
];
