import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [
  
  {
    path: '',
    redirectTo: 'pages/main',
    pathMatch: 'full'
  },
  // {
  //   path: 'application',
  //   redirectTo: 'security/apps',
  //   pathMatch: 'prefix'
  // },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
 {
  path: 'pages',
  loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)
},

  { path: 'config', loadChildren: () => import('./configurator/configurator.module').then(m => m.ConfiguratorModule) },
  { path: 'security', loadChildren: () => import('./security/security.module').then(m => m.SecurityModule) },
];


@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true} )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
