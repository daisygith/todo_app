import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Task } from '../model/task';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TodoService {
  private _http: HttpClient = inject(HttpClient);
  private _apiUrl = `${environment.apiUrl}/tasks`;

  //get all tasks
  findAllTasks(): Observable<Task[]> {
    return this._http.get<Task[]>(`${this._apiUrl}`).pipe(
      map((data) =>
        data.map((item) => ({
          ...item,
          finishDate: new Date(item.finishDate),
        })),
      ),
    );
  }

  //add new task
  addTask(task: Task): Observable<Task> {
    return this._http.post<Task>(`${this._apiUrl}`, task);
  }

  //update task by id
  updateTask(task: Task): Observable<Task> {
    return this._http.put<Task>(`${this._apiUrl}/${task.id}`, task);
  }

  //delete task by ID
  deleteTaskById(taskId: number): Observable<void> {
    return this._http.delete<void>(`${this._apiUrl}/${taskId}`);
  }
}
