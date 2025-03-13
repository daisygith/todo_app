import {
  Component,
  inject,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { TodoService } from '../service/todo.service';
import { Task } from '../model/task';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource,
} from '@angular/material/table';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCellDef,
    MatCell,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    DatePipe,
  ],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class TodoComponent implements OnInit {
  private _todoService = inject(TodoService);
  private _fb: FormBuilder = inject(FormBuilder);

  public tasks: Task[] | undefined;
  data: any;

  public todoGroup!: FormGroup;

  @ViewChild(MatTable) table: MatTable<Task> | undefined;

  dataSource = new MatTableDataSource<Task>([]);
  displayedColumns = ['description', 'status', 'finishDate'];

  ngOnInit(): void {
    this.buildForm();
    this.getTasks();
  }

  // removeData() {
  //   this.dataSource.pop();
  //   this.table.renderRows();
  // }

  getTasks(): void {
    this._todoService.findAllTasks().subscribe({
      next: (value) => (this.dataSource.data = value),
    });
  }

  public buildForm() {
    this.todoGroup = this._fb.group({
      id: [null],
      description: [null],
      status: [null],
      finishDate: [null],
    });
  }
}
