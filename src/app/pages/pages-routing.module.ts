import { RecommendationComponent } from './recommendation/recommendation.component';
import { HistoryComponent } from './history/history.component';
import { HomeComponent } from './datamark/home.component';
import { MainComponent } from './main/main.component';
import { PreferenceComponent } from './preference/preference.component';
import { SuggestionsComponent } from './suggestions/suggestions.component';
import { ViewprofileComponent } from './viewprofile/viewprofile.component';
import { ChatboxComponent } from './chatbox/chatbox.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../auth/login/login.component';
import {ChartsComponent} from './charts/charts.component';

import { ChatComponent } from './chat/chat.component';
import { DocviewerComponent } from './docviewer/docviewer.component';
import { ElasticdocsComponent } from './elasticdocs/elasticdocs.component';
import { MultiagentdataComponent } from './chat-elements/multiagentdata/multiagentdata.component';
const routes: Routes = [{
  path: 'main',
  component: MainComponent,
  children: [
    { path: '', component: ChartsComponent, data: { breadcrumb: 'Chat' } },
    { path: 'chat', component: ChatboxComponent, data: { breadcrumb: 'Chat' } },
    { path: 'profile', component: ViewprofileComponent, data: { breadcrumb: 'Profile' } },
    { path: 'suggestions', component: SuggestionsComponent, data: { breadcrumb: 'Suggestions' } },
    { path: 'preference', component: PreferenceComponent, data: { breadcrumb: 'Preference' } },
    // { path: 'datamark', component: DatamarkComponent, data: { breadcrumb: 'Datamark' } },
    { path: 'history', component: HistoryComponent, data: { breadcrumb: 'History' } },
    { path: 'recommendation', component: RecommendationComponent, data: { breadcrumb: 'Recommendation' } },
    { path: 'dashboard', component: ChartsComponent , data: { breadcrumb: 'Dashboard' } },
    { path: 'documentview', component: DocviewerComponent , data: { breadcrumb: 'documentview' } },
    { path: 'documents', component: ElasticdocsComponent , data: { breadcrumb: 'documents' } },
    {path: 'agentchat', component: MultiagentdataComponent, data: {}},
    {
      path: '',
      component: ChatComponent,
      outlet: 'chatmain'
    }
    // { path: 'chatmain', component: ChatComponent ,data: { breadcrumb: 'chatmain' } },
  ]

},
{
  path: 'auth/login',
  component: LoginComponent
},
{
  path: 'home',
  component: HomeComponent
},

{
  path: '',
  component: ChatComponent,
  outlet: 'chatmain'
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
