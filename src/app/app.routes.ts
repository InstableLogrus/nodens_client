import { Routes } from '@angular/router';
import { LoginFormComponent } from './login-form/login-form.component';
import { DashboardComponent } from './dashboard/dashboard.component';


export const routes: Routes = [
    { path: '', title: 'Nodens | dashboard', component: DashboardComponent },
    { path: 'login', title: 'Nodens | login', component: LoginFormComponent },
];