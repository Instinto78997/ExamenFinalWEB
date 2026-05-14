import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AuthUser } from '../../../core/interfaces/auth.interface';
import { TaskDto, TaskStatus } from '../../../core/interfaces/task.interface';

export interface TaskFormDialogData {
  task?: TaskDto;
  user: AuthUser | null;
}

export interface TaskFormValue {
  titulo: string;
  descripcion: string | null;
  estado: TaskStatus;
  usuarioId: number | null;
}

@Component({
  selector: 'app-task-form-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './task-form-dialog.component.html'
})
export class TaskFormDialogComponent {
  readonly statuses: { value: TaskStatus; label: string }[] = [
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'en_progreso', label: 'En progreso' },
    { value: 'completada', label: 'Completada' }
  ];

  readonly isEditing = Boolean(this.data.task);
  readonly form = this.fb.group({
    titulo: [this.data.task?.titulo ?? '', [Validators.required, Validators.maxLength(120)]],
    descripcion: [this.data.task?.descripcion ?? '', [Validators.maxLength(500)]],
    estado: [this.data.task?.estado ?? 'pendiente' as TaskStatus, [Validators.required]],
    usuarioId: [this.data.task?.usuarioId ?? this.data.user?.id ?? null]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly dialogRef: MatDialogRef<TaskFormDialogComponent, TaskFormValue>,
    @Inject(MAT_DIALOG_DATA) public readonly data: TaskFormDialogData
  ) {}

  cancel(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.dialogRef.close({
      titulo: value.titulo!,
      descripcion: value.descripcion || null,
      estado: value.estado!,
      usuarioId: value.usuarioId
    });
  }
}
