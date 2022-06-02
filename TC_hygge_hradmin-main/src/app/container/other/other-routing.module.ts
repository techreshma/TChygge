import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from 'src/app/service/auth-guard.service';
import { CalendarComponent } from './calendar/calendar.component';
import { ChatComponent } from './chat/chat.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InsuranceComponent } from './insurance/insurance.component';
import { SettingComponent } from './setting/setting.component';


const routes: Routes = [
  { path: '', component: DashboardComponent,canActivate: [AuthGuardService] },
  { path: 'calendar', component: CalendarComponent,canActivate: [AuthGuardService] },
  { path: 'chat', component: ChatComponent,canActivate: [AuthGuardService] },
  { path: 'setting', component: SettingComponent,canActivate: [AuthGuardService] },
  { path: 'insurance', component: InsuranceComponent,canActivate: [AuthGuardService] }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OtherRoutingModule { }
