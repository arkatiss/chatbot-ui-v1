import { TrainingbotComponent } from './trainingbot/trainingbot.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DomaincreateComponent } from './domaincreate/domaincreate.component';
import { DomainviewComponent } from './domainview/domainview.component';
import { InfosetcreateComponent } from './infosetcreate/infosetcreate.component';
import { InfosetviewComponent } from './infosetview/infosetview.component';
import { DataauthcreateComponent } from './dataauthcreate/dataauthcreate.component';
import { DataauthviewComponent } from './dataauthview/dataauthview.component';
import { ConfigComponent } from './config/config.component';
import { Role } from '../auth/role';
import { AuthenticationGuard } from '../auth/authentication.guard';
import { AnnotatorComponent } from '../annotator/annotator.component';
import { ConfiguratiosComponent } from './configuratios/configuratios.component';
import { BuildInfosetsComponent } from './build-infosets/build-infosets.component';

const routes: Routes = [
  {
    path: '',
    component: ConfigComponent,
    children: [
      {
        path: 'createdomain',
        component: DomaincreateComponent,
        canActivate: [AuthenticationGuard],
      },
      { path: 'viewdomain', component: DomainviewComponent },
      { path: 'createinfoset', component: InfosetcreateComponent },
      { path: 'infoset', component: BuildInfosetsComponent },
      { path: 'viewinfoset', component: InfosetviewComponent },
      { path: 'dataauthcreate', component: DataauthcreateComponent },
      { path: 'viewdataauth', component: DataauthviewComponent },
      { path: 'training', component: TrainingbotComponent },
      { path: 'createtraining', component: AnnotatorComponent },
      { path: 'configurations', component: ConfiguratiosComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfiguratorRoutingModule {}
