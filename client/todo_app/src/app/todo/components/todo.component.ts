import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { TodoService } from '../service/todo.service';
import { Task } from '../model/task';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class TodoComponent implements OnInit {
  private _todoService = inject(TodoService);

  public tasks: Task[] | undefined;

  ngOnInit(): void {
    this.getTasks();
  }

  getTasks(): void {
    this._todoService.findAllTasks().subscribe({
      next: (value) => (this.tasks = value),
    });
  }
}
