import { Routes } from '@angular/router';

export const todoRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/todo.component').then((m) => m.TodoComponent),
  },
];
