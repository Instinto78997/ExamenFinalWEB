import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { ProjectDto } from '../../../interfaces/project.interface';
import { ProjectService } from '../../../services/project.service';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { ProjectFormDialogComponent, ProjectFormValue } from '../project-form-dialog/project-form-dialog.component';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatDialogModule, MatProgressSpinnerModule, MatTableModule],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.css'
})
export class ProjectListComponent implements OnInit {
  projects: ProjectDto[] = [];
  loading = false;
  errorMessage = '';
  readonly displayedColumns = ['nombre', 'descripcion', 'acciones'];
  readonly workflowItems = [
    { title: '1. Crear proyecto', text: 'Registra cada iniciativa del equipo para agrupar su trabajo.' },
    { title: '2. Crear tareas', text: 'Entra a un proyecto y agrega tareas asociadas a ese proyecto.' },
    { title: '3. Asignar estado', text: 'Cada tarea puede estar pendiente, en progreso o completada.' },
    { title: '4. Filtrar trabajo', text: 'Visualiza las tareas por estado dentro de cada proyecto.' }
  ];

  constructor(
    private readonly projectService: ProjectService,
    private readonly dialog: MatDialog,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.loading = true;
    this.errorMessage = '';

    this.projectService.getAll().subscribe({
      next: (projects) => {
        this.projects = projects;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message ?? 'No se pudieron cargar los proyectos';
        this.loading = false;
      }
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(ProjectFormDialogComponent, { width: '520px', data: {} });

    dialogRef.afterClosed().subscribe((value?: ProjectFormValue) => {
      if (!value) return;

      this.projectService.create(value).subscribe({
        next: (project) => {
          this.projects = [project, ...this.projects];
          this.goToDetail(project);
        },
        error: (error) => this.errorMessage = error.error?.message ?? 'No se pudo crear el proyecto'
      });
    });
  }

  openEditDialog(project: ProjectDto, event: MouseEvent): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(ProjectFormDialogComponent, {
      width: '520px',
      data: { project }
    });

    dialogRef.afterClosed().subscribe((value?: ProjectFormValue) => {
      if (!value) return;

      this.projectService.update(project.id, value).subscribe({
        next: (updatedProject) => {
          this.projects = this.projects.map((item) => item.id === updatedProject.id ? updatedProject : item);
        },
        error: (error) => this.errorMessage = error.error?.message ?? 'No se pudo actualizar el proyecto'
      });
    });
  }

  confirmDelete(project: ProjectDto, event: MouseEvent): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: {
        title: 'Eliminar proyecto',
        message: `Se eliminara "${project.nombre}" junto con sus tareas.`
      }
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;

      this.projectService.delete(project.id).subscribe({
        next: () => this.projects = this.projects.filter((item) => item.id !== project.id),
        error: (error) => this.errorMessage = error.error?.message ?? 'No se pudo eliminar el proyecto'
      });
    });
  }

  goToDetail(project: ProjectDto): void {
    this.router.navigate(['/proyectos', project.id]);
  }
}
