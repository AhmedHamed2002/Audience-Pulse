import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LatestWorksComponent } from './latest-works/latest-works.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ContactComponent } from './contact/contact.component';

import { NotfoundComponent } from './notfound/notfound.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { myguardGuard } from './myguard.guard';
import { DetailsComponent } from './details/details.component';

export const routes: Routes = [
  {path:'' ,redirectTo:'/login' ,pathMatch:'full'},
  {path:"login", component:LoginComponent} ,
  {path:"register", component:RegisterComponent} ,
  {path:"profile", component:ProfileComponent , canActivate:[myguardGuard]} ,
  {path:"home", component:HomeComponent, canActivate:[myguardGuard]} ,
  {path:"latest_work", component:LatestWorksComponent, canActivate:[myguardGuard]},
  {path:"latest_work/:id", component:DetailsComponent, canActivate:[myguardGuard]},
  {path:"dashboard", component:DashboardComponent, canActivate:[myguardGuard]},
  {path:"contact", component:ContactComponent, canActivate:[myguardGuard]},
  {path:"**", component:NotfoundComponent}
];

