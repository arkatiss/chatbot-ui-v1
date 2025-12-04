import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationGuard } from '../auth/authentication.guard';
import {MainComponent} from './main/main.component';
import { MapingComponent } from './maping/maping.component';
import { RolesComponent } from './roles/roles.component';
import { SupportgroupComponent } from './supportgroup/supportgroup.component';
import { ViewmapingComponent } from './viewmaping/viewmaping.component';
import { ViewrolesComponent } from './viewroles/viewroles.component';
import { ViewsupportComponent } from './viewsupport/viewsupport.component';
import { CreatevizrolesComponent } from './createvizroles/createvizroles.component';
import { ViewvizrolesComponent } from './viewvizroles/viewvizroles.component';
import { AppsComponent } from './apps/apps.component';

const routes: Routes = [{
  path: '',
  component: MainComponent,
  // canActivate: [AuthenticationGuard], data: { roles: [Role.globaladmin, Role.globalconfigurator]},
  children: [
    { path: 'createrole', component: RolesComponent },
    { path: 'viewrole', component: ViewrolesComponent},
    { path: 'createsupport', component: SupportgroupComponent},
    { path: 'viewsupport', component: ViewsupportComponent},
    { path: 'createmaping', component: MapingComponent},
    { path: 'viewmaping', component: ViewmapingComponent},
    { path: 'vizroles', component: CreatevizrolesComponent},
    { path: 'viewvizroles', component: ViewvizrolesComponent},
    {path: 'apps', component: AppsComponent}
  ]
}


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecurityRoutingModule { }
