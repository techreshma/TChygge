import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { LoginComponent } from './auth/login/login.component';
import { SetPasswordComponent } from './auth/set-password/set-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { CalendarComponent } from './container/other/calendar/calendar.component';
import { ChatComponent } from './container/other/chat/chat.component';
import { DashboardComponent } from './container/other/dashboard/dashboard.component';
import { EmployeeDetailComponent } from './container/employee/employee-detail/employee-detail.component';
import { EmployeesComponent } from './container/employee/employees/employees.component';
import { UserRolesComponent } from './container/roles-access/user-roles/user-roles.component';
import { AccessComponent } from './container/roles-access/access/access.component';
import { SettingComponent } from './container/other/setting/setting.component';
import { AuthGuardService } from './service/auth-guard.service';
import { InsuranceComponent } from './container/other/insurance/insurance.component';
import { EmployeeSalaryComponent } from './container/salary/employee-salary/employee-salary.component';
import { PayslipComponent } from './container/salary/payslip/payslip.component';
import { PayslipDetailComponent } from './container/salary/payslip-detail/payslip-detail.component';
import { ContractsComponent } from './container/documents/contracts/contracts.component';
import { FaqComponent } from './container/company/faq/faq.component';
import { PrivacyPolicyComponent } from './container/company/privacy-policy/privacy-policy.component';
import { ProfileComponent } from './container/company/profile/profile.component';
import { SubAdminListComponent } from './container/sub-admin/sub-admin-list/sub-admin-list.component';
import { LeavesListComponent } from './container/leaves/leaves-list/leaves-list.component';
import { PayslipEditComponent } from './container/salary/payslip-edit/payslip-edit.component';
import { PayslipGenerateComponent } from './container/salary/payslip-generate/payslip-generate.component';
import { ActiveServeyComponent } from './container/survey/active-servey/active-servey.component';
import { AddSurveyComponent } from './container/survey/add-survey/add-survey.component';
import { ListSurveyComponent } from './container/survey/list-survey/list-survey.component';
import { DetailSurveyComponent } from './container/survey/detail-survey/detail-survey.component';
import { InitiateSurveyComponent } from './container/survey/initiate-survey/initiate-survey.component';
import { EditSurveyComponent } from './container/survey/edit-survey/edit-survey.component';
import { ExpiredSurveyComponent } from './container/survey/expired-survey/expired-survey.component';
import { TemplateComponent } from './container/survey/template/template.component';
import { PreTemplateComponent } from './container/survey/pre-template/pre-template.component';
import { TemplateDetailComponent } from './container/survey/template-detail/template-detail.component';
import { SurveyGridComponent } from './container/survey/survey-grid/survey-grid.component';
import { PreTemplateDetailComponent } from './container/survey/pre-template-detail/pre-template-detail.component';
import { PayslipThreeComponent } from './container/salary/payslip-three/payslip-three.component';
import { PayslipFiveComponent } from './container/salary/payslip-five/payslip-five.component';
import { PayslipSixComponent } from './container/salary/payslip-six/payslip-six.component';
import { PayslipFourComponent } from './container/salary/payslip-four/payslip-four.component';
import { PayslipTwoComponent } from './container/salary/payslip-two/payslip-two.component';
import { PayslipPreviewComponent } from './container/salary/payslip-preview/payslip-preview.component';
import { RewardCreateComponent } from './container/rewards/reward-create/reward-create.component';
import { RewardListComponent } from './container/rewards/reward-list/reward-list.component';
import { ChallangeListComponent } from './container/challanges/challange-list/challange-list.component';
import { ChallangeViewComponent } from './container/challanges/challange-view/challange-view.component';
import { RewardUpdateComponent } from './container/rewards/reward-update/reward-update.component';
import { RewardDetailComponent } from './container/rewards/reward-detail/reward-detail.component';
import { NotificationListComponent } from './container/notification/notification-list/notification-list.component';
import { ReportsComponent } from './container/reports/reports/reports.component';
import { AttendanceReportComponent } from './container/reports/attendance-report/attendance-report.component';
import { EmployeeReportComponent } from './container/reports/employee-report/employee-report.component';
import { LeavesReportComponent } from './container/reports/leaves-report/leaves-report.component';
import { DocumentReportComponent } from './container/reports/document-report/document-report.component';
import { SalaryReportComponent } from './container/reports/salary-report/salary-report.component';
import { ChallengesReportComponent } from './container/reports/challenges-report/challenges-report.component';
import { SurveyReportComponent } from './container/reports/survey-report/survey-report.component';
import { BadgesReportComponent } from './container/reports/badges-report/badges-report.component';
import { BranchListComponent } from './container/branch/branch-list/branch-list.component';
import { HealthwellnessComponent } from './container/healthwellness/healthwellness.component';


  const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'payslip-three', component: PayslipThreeComponent},
  { path: 'payslip-five' , component: PayslipFiveComponent},
  { path: 'payslip-six' , component: PayslipSixComponent},
  { path: 'payslip-four' , component: PayslipFourComponent},
  { path: 'payslip-two' , component: PayslipTwoComponent},
  { path: 'set-password/:key', component: SetPasswordComponent },
  { path: 'reward-create', component: RewardCreateComponent,canActivate: [AuthGuardService] },
  { path: 'reward-detail/:id', component: RewardDetailComponent,canActivate: [AuthGuardService] },
  { path: 'reward-list', component: RewardListComponent,canActivate: [AuthGuardService] },
  { path: 'reward-update/:id', component: RewardUpdateComponent,canActivate: [AuthGuardService] },
  { path: 'dashboard', component: DashboardComponent,canActivate: [AuthGuardService] },
  { path: 'calendar', component: CalendarComponent,canActivate: [AuthGuardService] },
  { path: 'chat', component: ChatComponent,canActivate: [AuthGuardService] },
  { path: 'employees', component: EmployeesComponent,canActivate: [AuthGuardService] },
  { path: 'employees-detail/:id', component: EmployeeDetailComponent,canActivate: [AuthGuardService] },
  { path: 'user-roles', component: UserRolesComponent,canActivate: [AuthGuardService] },
  { path: 'access', component: AccessComponent,canActivate: [AuthGuardService] },
  { path: 'setting', component: SettingComponent,canActivate: [AuthGuardService] },
  { path: 'insurance', component: InsuranceComponent,canActivate: [AuthGuardService] },
  { path: 'employee-salary', component: EmployeeSalaryComponent,canActivate: [AuthGuardService] },
  { path: 'payslip', component: PayslipComponent,canActivate: [AuthGuardService] },
  { path: 'payslip/:id', component: PayslipPreviewComponent,canActivate: [AuthGuardService] },
  { path: 'payslip-edit/:id', component: PayslipEditComponent,canActivate: [AuthGuardService] },
  { path: 'payslip-generate', component: PayslipGenerateComponent,canActivate: [AuthGuardService] },
  { path: 'contracts', component: ContractsComponent,canActivate: [AuthGuardService] },
  { path: 'documents', component: ContractsComponent,canActivate: [AuthGuardService] },
  { path: 'faq', component: FaqComponent,canActivate: [AuthGuardService] },
  { path: 'profile', component: ProfileComponent,canActivate: [AuthGuardService] },
  { path: 'privacy-policy', component: PrivacyPolicyComponent,canActivate: [AuthGuardService] },
  { path: 'sub-admin', component: SubAdminListComponent,canActivate: [AuthGuardService] },
  { path: 'leaves', component: LeavesListComponent,canActivate: [AuthGuardService] },
  { path: 'active-survey/:id', component: ActiveServeyComponent,canActivate: [AuthGuardService] },
  { path: 'add-survey', component: AddSurveyComponent,canActivate: [AuthGuardService] },
  { path: 'survey-list', component: ListSurveyComponent,canActivate: [AuthGuardService] },
  { path: 'survey-detail/:id', component: DetailSurveyComponent,canActivate: [AuthGuardService] },
  { path: 'survey-initiate', component: InitiateSurveyComponent,canActivate: [AuthGuardService] },
  { path: 'edit-survey/:id/:name/:desc', component: EditSurveyComponent,canActivate: [AuthGuardService] },
  { path: 'survey-archive', component: ExpiredSurveyComponent,canActivate: [AuthGuardService] },
  { path: 'select-survey', component: TemplateComponent,canActivate: [AuthGuardService] },
  { path: 'survey-grid', component: SurveyGridComponent,canActivate: [AuthGuardService] },
  { path: 'survey-pre-grid', component: PreTemplateComponent,canActivate: [AuthGuardService] },
  { path: 'template-detail/:id', component: TemplateDetailComponent,canActivate: [AuthGuardService] },
  { path: 'pre-template-detail/:id', component: PreTemplateDetailComponent,canActivate: [AuthGuardService] },
  { path: 'create-survey-by-template/:id', component: AddSurveyComponent,canActivate: [AuthGuardService] },
  { path: 'create-survey-by-pre-template/:preid', component: AddSurveyComponent,canActivate: [AuthGuardService] },
  { path: 'challange-list', component: ChallangeListComponent,canActivate: [AuthGuardService] },
  { path: 'challange-view', component: ChallangeViewComponent,canActivate: [AuthGuardService] },
  { path: 'notification', component: NotificationListComponent,canActivate: [AuthGuardService] },
  { path: 'reports', component: ReportsComponent,canActivate: [AuthGuardService] },
  { path: 'attendance-report', component: AttendanceReportComponent,canActivate: [AuthGuardService] },
  { path: 'employee-report', component: EmployeeReportComponent,canActivate: [AuthGuardService] },
  { path: 'leave-report', component: LeavesReportComponent,canActivate: [AuthGuardService]},
  { path: 'document-report', component: DocumentReportComponent,canActivate: [AuthGuardService]},
  { path: 'salary-report', component: SalaryReportComponent,canActivate: [AuthGuardService]},
  { path: 'challenges-report', component: ChallengesReportComponent,canActivate: [AuthGuardService]},
  { path: 'survey-report', component: SurveyReportComponent,canActivate: [AuthGuardService]},
  { path: 'badges-report', component: BadgesReportComponent,canActivate: [AuthGuardService]},
  { path: 'branch-list', component: BranchListComponent,canActivate: [AuthGuardService]},
  { path: 'healthwellness', component: HealthwellnessComponent,canActivate: [AuthGuardService]},
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
