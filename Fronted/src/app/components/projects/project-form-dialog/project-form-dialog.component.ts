import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProjectDto } from '../../../interfaces/project.interface';

export interface ProjectFormDialogData {
  project?: ProjectDto;
}

export interface ProjectFormValue {
  nombre: string;
  descripcion: string | null;
}

@Component({
  selector: 'app-project-form-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule],
  templateUrl: './project-form-dialog.component.html'
})
export class ProjectFormDialogComponent {
  readonly isEditing = Boolean(this.data.project);
  readonly form = this.fb.group({
    nombre: [this.data.project?.nombre ?? '', [Validators.required, Validators.maxLength(120)]],
    descripcion: [this.data.project?.descripcion ?? '', [Validators.maxLength(500)]]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly dialogRef: MatDialogRef<ProjectFormDialogComponent, ProjectFormValue>,
    @Inject(MAT_DIALOG_DATA) public readonly data: ProjectFormDialogData
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
      nombre: value.nombre!,
      descripcion: value.descripcion || null
    });
  }
}
