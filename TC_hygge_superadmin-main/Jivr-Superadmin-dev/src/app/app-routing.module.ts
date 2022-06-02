import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { LoginComponent } from './auth/login/login.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { SetPasswordComponent } from './auth/set-password/set-password.component';
import { CalendarComponent } from './container/calendar/calendar.component';
import { ChatComponent } from './container/chat/chat.component';
import { DashboardComponent } from './container/dashboard/dashboard.component';
import { UserRolesComponent } from './container/roles-access/user-roles/user-roles.component';
import { SettingComponent } from './container/setting/setting.component';
import { AuthGuardService } from './service/auth-guard.service';
import { InsuranceComponent } from './container/insurance/insurance.component';
import { SubscriptionPlanComponent } from './container/subscription-plan/subscription-plan.component';
import { SubAdminListComponent } from './container/sub-admin/sub-admin-list/sub-admin-list.component';
import { AccessComponent } from './container/roles-access/access/access.component';
import { PayslipComponent } from './container/payslip/payslip.component';
import { CompanyListComponent } from './container/company/company-list/company-list.component';
import { CompanyAddComponent } from './container/company/company-add/company-add.component';
import { CompanyEditComponent } from './container/company/company-edit/company-edit.component';
import { HraListComponent } from './container/hra/hra-list/hra-list.component';
import { HraAddComponent } from './container/hra/hra-add/hra-add.component';
import { HraEditComponent } from './container/hra/hra-edit/hra-edit.component';
import { ProfileComponent } from './container/company/profile/profile.component';
import { ActiveServeyComponent } from './container/survey/active-servey/active-servey.component';
import { AddSurveyComponent } from './container/survey/add-survey/add-survey.component';
import { ListSurveyComponent } from './container/survey/list-survey/list-survey.component';
import { DetailSurveyComponent } from './container/survey/detail-survey/detail-survey.component';
import { InitiateSurveyComponent } from './container/survey/initiate-survey/initiate-survey.component';
import { MyCoachComponent } from './container/coaching/my-coach/my-coach.component';
import { NutritionistComponent } from './container/coaching/nutritionist/nutritionist.component';
import { NutritionistInfoComponent } from './container/coaching/nutritionist/nutritionist-info/nutritionist-info.component';
import { NutritionistFactCreateComponent } from './container/coaching/nutritionist/nutritionist-fact-create/nutritionist-fact-create.component';
import { PostViewComponent } from './container/coaching/post-view/post-view.component';
import { MealPlanCreateComponent } from './container/coaching/nutritionist/meal-plan-create/meal-plan-create.component';
import { MealPlanComponent } from './container/coaching/nutritionist/meal-plan/meal-plan.component';
import { RecipeCreateComponent } from './container/coaching/nutritionist/recipe-create/recipe-create.component';
import { RecipeComponent } from './container/coaching/nutritionist/recipe/recipe.component';
import { MealPlanInfoComponent } from './container/coaching/nutritionist/meal-plan-info/meal-plan-info.component';
import { GlossaryComponent } from './container/coaching/nutritionist/glossary/glossary.component';
import { GlossaryCreateComponent } from './container/coaching/nutritionist/glossary-create/glossary-create.component';
import { NutritionistFactEditComponent } from './container/coaching/nutritionist/nutritionist-fact-edit/nutritionist-fact-edit.component';
import { GlossaryEditComponent } from './container/coaching/nutritionist/glossary-edit/glossary-edit.component';
import { RecipeEditComponent } from './container/coaching/nutritionist/recipe-edit/recipe-edit.component';
import { RecipeViewComponent } from './container/coaching/recipe-view/recipe-view.component';
import { TemplateComponent } from './container/survey/template/template.component';
import { SurveyGridComponent } from './container/survey/survey-grid/survey-grid.component';
import { ExpiredSurveyComponent } from './container/survey/expired-survey/expired-survey.component';
import { MealPlanEditComponent } from './container/coaching/nutritionist/meal-plan-edit/meal-plan-edit.component';
import { TemplateDetailComponent } from './container/survey/template-detail/template-detail.component';
import { PreTemplateComponent } from './container/survey/pre-template/pre-template.component';
import { PreTemplateDetailComponent } from './container/survey/pre-template-detail/pre-template-detail.component';
import { HealthProgramComponent } from './container/coaching/health-program/health-program.component';
import { GoalsComponent } from './container/coaching/health-program/goals/goals.component';
import { UpdateGoalsComponent } from './container/coaching/health-program/update-goals/update-goals.component';
import { RewardCreateComponent } from './container/rewards/reward-create/reward-create.component';
import { RewardDetailComponent } from './container/rewards/reward-detail/reward-detail.component';
import { RewardListComponent } from './container/rewards/reward-list/reward-list.component';
import { RewardUpdateComponent } from './container/rewards/reward-update/reward-update.component';
import { ChallangeListComponent } from './container/challanges/challange-list/challange-list.component';
import { ChallangeViewComponent } from './container/challanges/challange-view/challange-view.component';
import { BadgesListComponent } from './container/badges/badges-list/badges-list.component';
import { BadgesDetailComponent } from './container/badges/badges-detail/badges-detail.component';
import { NotificationListComponent } from './container/notification/notification-list/notification-list.component';
import { NotificationSendComponent } from './container/notification/notification-send/notification-send.component';
import { EditSurveyComponent } from './container/survey/edit-survey/edit-survey.component';
import { ReportComponent } from './container/hra/report/report.component';
import { ReportDetailComponent } from './container/hra/report-detail/report-detail.component';
import { ReportsComponent } from './container/reports/reports/reports.component';
import { SaCompaniesComponent } from './container/reports/sa-companies/sa-companies.component';
import { SaUsersComponent } from './container/reports/sa-users/sa-users.component';
import { SaSurveyComponent } from './container/reports/sa-survey/sa-survey.component';
import { SaRewardschallengesUserComponent } from './container/reports/sa-rewardschallenges-user/sa-rewardschallenges-user.component';
import { SaRewardschallengesChallengesComponent } from './container/reports/sa-rewardschallenges-challenges/sa-rewardschallenges-challenges.component';
import { ReportPdfContainComponent } from './container/hra/report-pdf-contain/report-pdfcontain.component';

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'set-password/:key', component: SetPasswordComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService] },
  { path: 'calendar', component: CalendarComponent, canActivate: [AuthGuardService] },
  { path: 'chat', component: ChatComponent, canActivate: [AuthGuardService] },
  { path: 'user-roles', component: UserRolesComponent, canActivate: [AuthGuardService] },
  { path: 'subscription-plan', component: SubscriptionPlanComponent, canActivate: [AuthGuardService] },
  { path: 'access', component: AccessComponent, canActivate: [AuthGuardService] },
  { path: 'setting', component: SettingComponent, canActivate: [AuthGuardService] },
  { path: 'insurance', component: InsuranceComponent, canActivate: [AuthGuardService] },
  { path: 'sub-admin', component: SubAdminListComponent, canActivate: [AuthGuardService] },
  { path: 'payslip', component: PayslipComponent, canActivate: [AuthGuardService] },
  { path: 'company', component: CompanyListComponent, canActivate: [AuthGuardService] },
  { path: 'company-add', component: CompanyAddComponent, canActivate: [AuthGuardService] },
  { path: 'company-edit/:id', component: CompanyEditComponent, canActivate: [AuthGuardService] },
  { path: 'hra', component: HraListComponent, canActivate: [AuthGuardService] },
  { path: 'hra-add', component: HraAddComponent, canActivate: [AuthGuardService] },
  { path: 'hra-edit/:id', component: HraEditComponent, canActivate: [AuthGuardService] },
  { path: 'hra-reports', component: ReportComponent, canActivate: [AuthGuardService] },
  { path: 'hra-report-detail/:id', component: ReportDetailComponent, canActivate: [AuthGuardService] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuardService] },
  { path: 'active-survey/:id', component: ActiveServeyComponent, canActivate: [AuthGuardService] },
  { path: 'add-survey', component: AddSurveyComponent, canActivate: [AuthGuardService] },
  { path: 'edit-survey/:id/:name/:desc', component: EditSurveyComponent, canActivate: [AuthGuardService] },
  { path: 'create-survey-by-template/:id', component: AddSurveyComponent, canActivate: [AuthGuardService] },
  { path: 'create-survey-by-pre-template/:preid', component: AddSurveyComponent, canActivate: [AuthGuardService] },
  { path: 'select-survey', component: TemplateComponent, canActivate: [AuthGuardService] },
  { path: 'survey-grid', component: SurveyGridComponent, canActivate: [AuthGuardService] },
  { path: 'survey-pre-grid', component: PreTemplateComponent, canActivate: [AuthGuardService] },
  { path: 'expired-survey', component: ExpiredSurveyComponent, canActivate: [AuthGuardService] },
  { path: 'survey-list', component: ListSurveyComponent, canActivate: [AuthGuardService] },
  { path: 'survey-detail/:id', component: DetailSurveyComponent, canActivate: [AuthGuardService] },
  { path: 'template-detail/:id', component: TemplateDetailComponent, canActivate: [AuthGuardService] },
  { path: 'pre-template-detail/:id', component: PreTemplateDetailComponent, canActivate: [AuthGuardService] },
  { path: 'survey-initiate', component: InitiateSurveyComponent, canActivate: [AuthGuardService] },
  { path: 'my-coach', component: MyCoachComponent, canActivate: [AuthGuardService] },
  { path: 'be-your-own-nutritionist', component: NutritionistComponent, canActivate: [AuthGuardService] },
  { path: 'be-your-own-nutritionist-info/:id', component: NutritionistInfoComponent, canActivate: [AuthGuardService] },
  { path: 'nutritionist-fact-create/:id', component: NutritionistFactCreateComponent, canActivate: [AuthGuardService] },
  { path: 'nutritionist-fact-edit/:id/:postid', component: NutritionistFactEditComponent, canActivate: [AuthGuardService] },
  { path: 'meal-plan', component: MealPlanComponent, canActivate: [AuthGuardService] },
  { path: 'meal-plan-create', component: MealPlanCreateComponent, canActivate: [AuthGuardService] },
  { path: 'meal-plan-edit/:id', component: MealPlanEditComponent, canActivate: [AuthGuardService] },
  { path: 'recipe', component: RecipeComponent, canActivate: [AuthGuardService] },
  { path: 'recipe-create', component: RecipeCreateComponent, canActivate: [AuthGuardService] },
  { path: 'recipe-edit/:id', component: RecipeEditComponent, canActivate: [AuthGuardService] },
  { path: 'coach-view/:catid/:id', component: PostViewComponent, canActivate: [AuthGuardService] },
  { path: 'recipe-view/:catid/:id', component: RecipeViewComponent, canActivate: [AuthGuardService] },
  { path: 'meal-plan-view/:id', component: MealPlanInfoComponent, canActivate: [AuthGuardService] },
  { path: 'glossary', component: GlossaryComponent, canActivate: [AuthGuardService] },
  { path: 'glossary-create', component: GlossaryCreateComponent, canActivate: [AuthGuardService] },
  { path: 'glossary-edit/:id', component: GlossaryEditComponent, canActivate: [AuthGuardService] },
  { path: 'health-program', component: HealthProgramComponent, canActivate: [AuthGuardService] },
  { path: 'health-goals/:id', component: GoalsComponent, canActivate: [AuthGuardService] },
  { path: 'health-goal-update/:catId/:id', component: UpdateGoalsComponent, canActivate: [AuthGuardService] },
  { path: 'reward-create', component: RewardCreateComponent, canActivate: [AuthGuardService] },
  { path: 'reward-detail/:id', component: RewardDetailComponent, canActivate: [AuthGuardService] },
  { path: 'reward-list', component: RewardListComponent, canActivate: [AuthGuardService] },
  { path: 'reward-update/:id', component: RewardUpdateComponent, canActivate: [AuthGuardService] },
  { path: 'challange-list', component: ChallangeListComponent, canActivate: [AuthGuardService] },
  { path: 'challange-view', component: ChallangeViewComponent, canActivate: [AuthGuardService] },
  { path: 'badges', component: BadgesListComponent, canActivate: [AuthGuardService] },
  { path: 'badges-detail/:id', component: BadgesDetailComponent, canActivate: [AuthGuardService] },
  { path: 'notification', component: NotificationListComponent, canActivate: [AuthGuardService] },
  { path: 'notification-send', component: NotificationSendComponent, canActivate: [AuthGuardService] },
  { path: 'reports', component: ReportsComponent, canActivate: [AuthGuardService] },
  { path: 'report-users', component: SaUsersComponent, canActivate: [AuthGuardService] },
  { path: 'report-companies', component: SaCompaniesComponent, canActivate: [AuthGuardService] },
  { path: 'report-survey', component: SaSurveyComponent, canActivate: [AuthGuardService] },
  { path: 'report-rewards', component: SaRewardschallengesUserComponent, canActivate: [AuthGuardService] },
  { path: 'report-challenges', component: SaRewardschallengesChallengesComponent, canActivate: [AuthGuardService] },
  { path: 'company-pdf-report/:id', component: ReportPdfContainComponent },
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
