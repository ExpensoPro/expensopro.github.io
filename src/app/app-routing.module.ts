import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserGuard } from './services/user.guard';
import { UserComponent } from './pages/user/user.component';
import { GroupsComponent } from './pages/groups/groups.component';
import { SpentComponent } from './pages/spent/spent.component';
import { SpentlistComponent } from './pages/spentlist/spentlist.component';

const routes: Routes = [
  {
    path: "signup",
    component: RegisterComponent,
    pathMatch: "full"
  },
  {
    path: "login",
    component: LoginComponent,
    pathMatch: "full"
  },
  {
    path: "",
    component: HomeComponent,
    children:[
      {
        path: "user-dashboard",
        component: DashboardComponent,
        pathMatch: "full",
        canActivate: [UserGuard]
      },
      {
        path: "user-list",
        component: UserComponent,
        pathMatch: "full",
        canActivate: [UserGuard]
      },
      {
        path: "group-list",
        component: GroupsComponent,
        pathMatch: "full",
        canActivate: [UserGuard]
      },
      {
        path: "spend-manager",
        component: SpentComponent,
        pathMatch: "full",
        canActivate: [UserGuard]
      },
      {
        path: "spend-list",
        component: SpentlistComponent,
        pathMatch: "full",
        canActivate: [UserGuard]
      }
    ]
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
