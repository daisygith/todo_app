import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Task } from '../model/task';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TodoService {
  private _http: HttpClient = inject(HttpClient);
  private _apiUrl = `${environment.apiUrl}/tasks`;

  //get all tasks
  findAllTasks(): Observable<Task[]> {
    return this._http.get<Task[]>(`${this._apiUrl}`);
  }
}
