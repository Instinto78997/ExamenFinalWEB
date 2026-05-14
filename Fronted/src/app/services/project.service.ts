import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateProjectDto, ProjectDto, UpdateProjectDto } from '../interfaces/project.interface';
import { API_URL } from './api-url';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<ProjectDto[]> {
    return this.http.get<ProjectDto[]>(`${API_URL}/proyectos`);
  }

  getById(id: number): Observable<ProjectDto> {
    return this.http.get<ProjectDto>(`${API_URL}/proyectos/${id}`);
  }

  create(dto: CreateProjectDto): Observable<ProjectDto> {
    return this.http.post<ProjectDto>(`${API_URL}/proyectos`, dto);
  }

  update(id: number, dto: UpdateProjectDto): Observable<ProjectDto> {
    return this.http.put<ProjectDto>(`${API_URL}/proyectos/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/proyectos/${id}`);
  }
}
