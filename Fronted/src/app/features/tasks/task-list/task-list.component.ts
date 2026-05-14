import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { TaskDto, TaskStatus } from '../../../core/interfaces/task.interface';
import { AuthService } from '../../../core/services/auth.service';
import { TaskService } from '../../../core/services/task.service';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { TaskFormDialogComponent, TaskFormValue } from '../task-form-dialog/task-form-dialog.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatTableModule
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent implements OnInit {
  @Input({ required: true }) projectId!: number;

  allTasks: TaskDto[] = [];
  tasks: TaskDto[] = [];
  loading = false;
  errorMessage = '';
  readonly displayedColumns = ['titulo', 'estado', 'responsable', 'acciones'];
  readonly statusFilter = new FormControl<TaskStatus | ''>('', { nonNullable: true });
  readonly statuses: { value: TaskStatus | ''; label: string }[] = [
    { value: '', label: 'Todos' },
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'en_progreso', label: 'En progreso' },
    { value: 'completada', label: 'Completada' }
  ];

  constructor(
    private readonly taskService: TaskService,
    private readonly authService: AuthService,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadTasks();
    this.statusFilter.valueChanges.subscribe(() => this.applyStatusFilter());
  }

  loadTasks(): void {
    this.loading = true;
    this.errorMessage = '';

    this.taskService.getByProject(this.projectId).subscribe({
      next: (tasks) => {
        this.allTasks = tasks;
        this.applyStatusFilter();
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message ?? 'No se pudieron cargar las tareas';
        this.loading = false;
      }
    });
  }

  applyStatusFilter(): void {
    const status = this.statusFilter.value;
    this.tasks = status ? this.allTasks.filter((task) => task.estado === status) : [...this.allTasks];
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(TaskFormDialogComponent, {
      width: '560px',
      data: { user: this.authService.getCurrentUser() }
    });

    dialogRef.afterClosed().subscribe((value?: TaskFormValue) => {
      if (!value) {
        return;
      }

      this.taskService.create(this.projectId, value).subscribe({
        next: (task) => {
          this.allTasks = [task, ...this.allTasks];
          this.applyStatusFilter();
        },
        error: (error) => this.errorMessage = error.error?.message ?? 'No se pudo crear la tarea'
      });
    });
  }

  openEditDialog(task: TaskDto): void {
    const dialogRef = this.dialog.open(TaskFormDialogComponent, {
      width: '560px',
      data: { task, user: this.authService.getCurrentUser() }
    });

    dialogRef.afterClosed().subscribe((value?: TaskFormValue) => {
      if (!value) {
        return;
      }

      this.taskService.update(task.id, value).subscribe({
        next: (updatedTask) => {
          this.allTasks = this.allTasks.map((item) => item.id === updatedTask.id ? updatedTask : item);
          this.applyStatusFilter();
        },
        error: (error) => this.errorMessage = error.error?.message ?? 'No se pudo actualizar la tarea'
      });
    });
  }

  confirmDelete(task: TaskDto): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: {
        title: 'Eliminar tarea',
        message: `Se eliminara "${task.titulo}".`
      }
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) {
        return;
      }

      this.taskService.delete(task.id).subscribe({
        next: () => {
          this.allTasks = this.allTasks.filter((item) => item.id !== task.id);
          this.applyStatusFilter();
        },
        error: (error) => this.errorMessage = error.error?.message ?? 'No se pudo eliminar la tarea'
      });
    });
  }

  getStatusLabel(status: TaskStatus): string {
    return this.statuses.find((item) => item.value === status)?.label ?? status;
  }

  getResponsibleLabel(task: TaskDto): string {
    const user = this.authService.getCurrentUser();
    return task.usuarioId && user?.id === task.usuarioId ? user.nombre : 'Sin asignar';
  }

  getStatusCount(status: TaskStatus): number {
    return this.allTasks.filter((task) => task.estado === status).length;
  }
}
