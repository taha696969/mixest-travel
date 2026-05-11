import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { HotelsComponent } from './hotels/hotels.component';
import { VoyagesComponent } from './voyages/voyages.component';
import { BusComponent } from './bus/bus.component';

import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'hotels', component: HotelsComponent },
  { path: 'voyages', component: VoyagesComponent },
  { path: 'bus', component: BusComponent },
  { path: 'admin', component: AdminComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
