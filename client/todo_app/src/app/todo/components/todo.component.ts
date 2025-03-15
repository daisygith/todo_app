import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { TodoService } from '../service/todo.service';
import { Task } from '../model/task';
import {
  FormArray,
  FormBuilder,
  FormControl,
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
import {
  MatFormField,
  MatInput,
  MatInputModule,
} from '@angular/material/input';
import { MatIconButton, MatMiniFabButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { MatOption, MatSelect } from '@angular/material/select';
import { DateRange, MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
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
    MatInputModule,
    MatMiniFabButton,
    MatIconModule,
    MatFormField,
    MatIconButton,
    MatTooltip,
    NgIf,
    MatSelect,
    MatOption,
    NgForOf,
    MatDatepickerModule,
    DatePipe,
  ],
  providers: [provideNativeDateAdapter()],
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
  isLoading = true;
  id: number | undefined;
  isNew: boolean = false;

  minDate = new Date(new Date().setHours(0, 0, 0, 0));

  public todoGroup!: FormGroup;

  dataSource = new MatTableDataSource<Task>([]);
  displayedColumns = ['description', 'status', 'finishDate', 'actions'];

  ngOnInit(): void {
    this.buildForm();
    this.getTasks();
    this.isLoading = false;
    this.isNew = !this.id;
  }

  public statusTask: string[] = ['New', 'In progress', 'Done'];

  public buildForm() {
    this.todoGroup = this._fb.group({
      tableRows: this._fb.array([]),
    });
  }

  addTasksFormArray() {
    this.tasks?.forEach((task) =>
      this.getFormControls.push(this.createTableRowItemFormGroup(task)),
    );
  }

  createTableRowItemFormGroup(task?: Task) {
    return this._fb.group({
      id: new FormControl(task?.id),
      description: new FormControl(task?.description, [Validators.required]),
      status: new FormControl(task?.status, [Validators.required]),
      finishDate: new FormControl(task?.finishDate),
      action: new FormControl('existingRecord'),
      isEdited: new FormControl(false),
      isNewRow: new FormControl(false),
    });
  }

  get getFormControls() {
    return this.todoGroup.get('tableRows') as FormArray;
  }
  get tableRowsValue() {
    return this.getFormControls.value;
  }

  getTasks(): void {
    this._todoService.findAllTasks().subscribe({
      next: (value) => {
        this.tasks = value;
        this.addTasksFormArray();
        this.updateDataSource(this.tasks);
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

  addNewRow() {
    const newForm = this.initiateVOForm();
    const control = this.todoGroup.get('tableRows') as FormArray;
    control.push(newForm);
    this.dataSource.data = [...this.dataSource.data, newForm.value];
  }

  editTask(i: number) {
    this.getFormControls?.at(i)?.get('isEdited')?.patchValue(true);
  }

  saveTask(i: number) {
    this.getFormControls?.at(i)?.get('isEdited')?.patchValue(false);

    const rowForm = this.getFormControls?.at(i);

    if (!rowForm.valid) {
      return;
    }
    if (!rowForm?.value?.id) {
      this._todoService.addTask(rowForm?.value).subscribe({
        next: (data) => {
          rowForm.patchValue(data);
          this.tasks.push(data);
          this.updateDataSource(this.tasks);
        },
        error: (err) => {
          console.log(err);
        },
      });
    } else {
      this._todoService.updateTask(rowForm?.value).subscribe({
        next: (data) => {
          this.tasks[i] = data;
          rowForm.patchValue(data);
          this.updateDataSource(this.tasks);
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  cancelTask(i: number) {
    this.getFormControls?.at(i)?.get('isEdited')?.patchValue(false);
  }

  initiateVOForm(): FormGroup {
    return this._fb.group({
      id: new FormControl(null),
      description: new FormControl('', [Validators.required]),
      status: new FormControl('', [Validators.required]),
      finishDate: new FormControl('', [Validators.required]),
      action: new FormControl('newRecord'),
      isEdited: new FormControl(true),
      isNewRow: new FormControl(true),
    });
  }

  private updateDataSource(data: Task[]) {
    this.dataSource.data = data;
  }
}
