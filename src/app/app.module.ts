import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TopNavComponent } from './component/top-nav/top-nav.component';
import { FooterComponent } from './component/footer/footer.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import {MatButtonModule} from '@angular/material/button';

import { UserComponent } from './pages/user/user.component';
import { GroupsComponent } from './pages/groups/groups.component';
import { SpentComponent } from './pages/spent/spent.component';
import { ExpensesComponent } from './pages/expenses/expenses.component';
import { ReportComponent } from './pages/report/report.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { HomeComponent } from './home/home.component';
import {MatCardModule} from '@angular/material/card';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import { SideNavComponent } from './side-nav/side-nav.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthInterceptor, authInterceptorProviders } from './services/auth.interceptor';
import {MatListModule} from '@angular/material/list';
import {MatTableModule} from '@angular/material/table';
import { UserdetailComponent } from './userdetail/userdetail.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material';
import { SpentlistComponent } from './pages/spentlist/spentlist.component';
import { ChartModule } from '@syncfusion/ej2-angular-charts';
import { CategoryService, ColumnSeriesService } from '@syncfusion/ej2-angular-charts';
import * as FusionCharts from "fusioncharts";
import * as charts from "fusioncharts/fusioncharts.charts";
import * as FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
import { FusionChartsModule } from 'angular-fusioncharts';

FusionChartsModule.fcRoot(FusionCharts, charts, FusionTheme);
@NgModule({
  declarations: [
    AppComponent,
    TopNavComponent,
    FooterComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    SideNavComponent,
    DashboardComponent,
    UserComponent,
    GroupsComponent,
    SpentComponent,
    ExpensesComponent,
    ReportComponent,
    UserdetailComponent,
    SpentlistComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatSlideToggleModule,
    MatButtonModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    HttpClientModule,
    MatSnackBarModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    
    MatListModule,
    MatTableModule,
    MatCheckboxModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ChartModule,
    FusionChartsModule
    
  ],
  providers: [authInterceptorProviders,CategoryService, ColumnSeriesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
