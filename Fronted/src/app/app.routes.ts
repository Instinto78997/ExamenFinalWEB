import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ProjectDetailComponent } from './components/projects/project-detail/project-detail.component';
import { ProjectListComponent } from './components/projects/project-list/project-list.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegisterComponent },
  { path: 'proyectos', component: ProjectListComponent, canActivate: [authGuard] },
  { path: 'proyectos/:id', component: ProjectDetailComponent, canActivate: [authGuard] },
  { path: '', pathMatch: 'full', redirectTo: 'proyectos' },
  { path: '**', redirectTo: 'proyectos' }
];
