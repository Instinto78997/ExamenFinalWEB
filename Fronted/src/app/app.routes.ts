import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ProjectDetailComponent } from './features/projects/project-detail/project-detail.component';
import { ProjectListComponent } from './features/projects/project-list/project-list.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegisterComponent },
  { path: 'proyectos', component: ProjectListComponent, canActivate: [authGuard] },
  { path: 'proyectos/:id', component: ProjectDetailComponent, canActivate: [authGuard] },
  { path: '', pathMatch: 'full', redirectTo: 'proyectos' },
  { path: '**', redirectTo: 'proyectos' }
];
