import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateTaskDto, TaskDto, TaskStatus, UpdateTaskDto } from '../interfaces/task.interface';
import { API_URL } from './api-url';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  constructor(private readonly http: HttpClient) {}

  getByProject(projectId: number, estado?: TaskStatus | ''): Observable<TaskDto[]> {
    const params = estado ? new HttpParams().set('estado', estado) : undefined;
    return this.http.get<TaskDto[]>(`${API_URL}/proyectos/${projectId}/tareas`, { params });
  }

  getById(id: number): Observable<TaskDto> {
    return this.http.get<TaskDto>(`${API_URL}/tareas/${id}`);
  }

  create(projectId: number, dto: CreateTaskDto): Observable<TaskDto> {
    return this.http.post<TaskDto>(`${API_URL}/proyectos/${projectId}/tareas`, dto);
  }

  update(id: number, dto: UpdateTaskDto): Observable<TaskDto> {
    return this.http.put<TaskDto>(`${API_URL}/tareas/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/tareas/${id}`);
  }
}
