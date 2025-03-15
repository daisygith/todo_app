import {
  ChangeDetectionStrategy,
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
import { MatHint, MatInput, MatSuffix } from '@angular/material/input';
import { MatMiniFabButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [
    ReactiveFormsModule,
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
    MatMiniFabButton,
    MatIconModule,
    MatDatepickerInput,
    MatHint,
    MatDatepickerToggle,
    MatSuffix,
    MatDatepicker,
  ],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoComponent implements OnInit {
  private _todoService = inject(TodoService);
  private _fb: FormBuilder = inject(FormBuilder);

  public tasks!: Task[];
  data: any;

  public todoGroup!: FormGroup;

  @ViewChild(MatTable) table: MatTable<Task> | undefined;

  // dataSource = new MatTableDataSource<Task>([]);
  dataSource = new MatTableDataSource<Task>([]);
  displayedColumns = ['description', 'status', 'finishDate', 'actions'];

  ngOnInit(): void {
    this.getTasks();
  }

  constructor(private fb: FormBuilder) {
    this.todoGroup = this.fb.group({
      tableRows: this.fb.array([]),
    });
    this.addRow();
  }

  buildForm(): FormGroup {
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

  getTasks(): void {
    this._todoService.findAllTasks().subscribe({
      next: (value) => {
        value?.forEach((item) => {
          this.addRow();
        });
        this.getFormControls.patchValue(value);
        this.dataSource.data = value;
      },
    });
  }

  deleteTask(taskId: Task): void {
    this._todoService.deleteTaskById(taskId.id).subscribe(
      () => {
        this.dataSource.data = this.dataSource.data.filter(
          (item) => item !== taskId,
        );
        console.log(taskId);
      },
      (error) => {
        console.log(error);
      },
    );
  }

  addRow() {
    const newForm = this.buildForm();
    const control = this.todoGroup.get('tableRows') as FormArray;
    control.push(newForm);
    let index = control.length;
    this.dataSource.data = [...this.dataSource.data, newForm.value];
    console.log(index);
  }
}
