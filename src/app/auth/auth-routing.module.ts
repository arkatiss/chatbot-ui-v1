import { AboutusComponent } from './aboutus/aboutus.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from '../pages/datamark/home.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'application:type', component: LoginComponent },
  { path: 'about', component: AboutusComponent },
  { path: 'home', component: HomeComponent },
  { path: 'forbidden', component: ForbiddenComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
