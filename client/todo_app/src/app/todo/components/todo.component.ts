import {
  Component,
  inject,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { TodoService } from '../service/todo.service';
import { Task } from '../model/task';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
import { NgForOf, NgIf } from '@angular/common';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    MatTable,
    MatCell,
    MatCellDef,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatInput,
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
  displayedColumns = ['description'];
  // tableRows: CdkTableDataSourceInput<any>;

  ngOnInit(): void {
    // this.buildForm();
    this.getTasks();
    // this.todoGroup = this._fb.group({
    //   dataSource: this._fb.array([]),
    // });
  }

  getTasks(): void {
    this._todoService.findAllTasks().subscribe({
      next: (value) => (this.dataSource.data = value),
    });
  }
  //
  // public buildForm() {
  //   this.todoGroup = this._fb.group({
  //     id: [null],
  //     description: [null, [Validators.required]],
  //     status: [null],
  //     finishDate: [null],
  //   });
  // }
  //
  // get getFormControls() {
  //   return this.todoGroup.get('tableRows') as FormArray;
  // }
  //
  // removeTask(index: number) {
  //   const control = this.todoGroup.get('tableRows') as FormArray;
  //   control.removeAt(index);
  // }

  constructor(private fb: FormBuilder) {
    this.todoGroup = this.fb.group({
      tableRows: this.fb.array([]),
    });
    this.addRow();
  }

  createFormGroup(): FormGroup {
    return this.fb.group({
      id: [''],
      description: ['', [Validators.required]],
      status: [''],
      finishDate: [''],
    });
  }

  get getFormControls() {
    return this.todoGroup.get('tableRows') as FormArray;
  }

  addRow() {
    const control = this.todoGroup.get('tableRows') as FormArray;
    control.push(this.createFormGroup());
  }
}
