import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import { ScheduleModule } from '@syncfusion/ej2-angular-schedule';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTabsModule} from '@angular/material/tabs';
import { FormsModule } from '@angular/forms';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import {MatChipsModule} from '@angular/material/chips';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { NgxDropzoneModule } from 'ngx-dropzone';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatExpansionModule} from '@angular/material/expansion';
import { ChartsModule } from 'ng2-charts';
import {MatMenuModule} from '@angular/material/menu';
import {MatRadioModule} from '@angular/material/radio';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import {MatTreeModule} from '@angular/material/tree';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import { MatNativeDateModule } from '@angular/material/core';
import {MatDatepickerModule } from '@angular/material/datepicker';
import { RatingModule } from 'ng-starrating';
import {MatSliderModule} from '@angular/material/slider';
import { CountdownModule } from '@ciri/ngx-countdown'
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { NgImageSliderModule } from 'ng-image-slider';
import { NgxEditorModule } from 'ngx-editor';
import { ChartModule } from 'angular2-chartjs';
import 'chartjs-plugin-labels';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './common/header/header.component';
import { SidebarComponent } from './common/sidebar/sidebar.component';
import { DashboardComponent } from './container/dashboard/dashboard.component';
import { UserRolesComponent } from './container/roles-access/user-roles/user-roles.component';
import { LoginComponent } from './auth/login/login.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { CalendarComponent } from './container/calendar/calendar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ChatComponent } from './container/chat/chat.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { HttpClientModule } from '@angular/common/http';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { AuthGuardService } from './service/auth-guard.service';
import { SettingComponent } from './container/setting/setting.component';
import { InsuranceComponent } from './container/insurance/insurance.component';
import { RoleAddComponent } from './container/roles-access/role-add/role-add.component';
import { RoleEditComponent } from './container/roles-access/role-edit/role-edit.component';
import { SubAdminListComponent } from './container/sub-admin/sub-admin-list/sub-admin-list.component';
import { SubAdminAddComponent } from './container/sub-admin/sub-admin-add/sub-admin-add.component';
import { SubAdminEditComponent } from './container/sub-admin/sub-admin-edit/sub-admin-edit.component';
import { AccessComponent } from './container/roles-access/access/access.component';
import { SetPasswordComponent } from './auth/set-password/set-password.component';
import { PayslipComponent } from './container/payslip/payslip.component';
import { ConfirmBoxComponent } from './confirm-box/confirm-box.component';
import { SubscriptionPlanComponent } from './container/subscription-plan/subscription-plan.component';
import { CompanyListComponent } from './container/company/company-list/company-list.component';
import { CompanyAddComponent } from './container/company/company-add/company-add.component';
import { CompanyEditComponent } from './container/company/company-edit/company-edit.component';
import { HraListComponent } from './container/hra/hra-list/hra-list.component';
import { HraAddComponent } from './container/hra/hra-add/hra-add.component';
import { HraEditComponent } from './container/hra/hra-edit/hra-edit.component';
import { HraViewComponent } from './container/hra/hra-view/hra-view.component';
import { ProfileComponent } from './container/company/profile/profile.component';
import { InitiateSurveyComponent } from './container/survey/initiate-survey/initiate-survey.component';
import { StratSurveyComponent } from './container/survey/strat-survey/strat-survey.component';
import { DoughnutComponent } from './helpers/chart/doughnut/doughnut.component';
import { ActiveServeyComponent } from './container/survey/active-servey/active-servey.component';
import { AddSurveyComponent } from './container/survey/add-survey/add-survey.component';
import { EditSurveyComponent } from './container/survey/edit-survey/edit-survey.component';
import { ViewSurveyComponent } from './container/survey/view-survey/view-survey.component';
import { ListSurveyComponent } from './container/survey/list-survey/list-survey.component';
import { DetailSurveyComponent } from './container/survey/detail-survey/detail-survey.component';
import { VerticalBarComponent } from './helpers/chart/vertical-bar/vertical-bar.component';
import { MyCoachComponent } from './container/coaching/my-coach/my-coach.component';
import { NutritionistComponent } from './container/coaching/nutritionist/nutritionist.component';
import { NutritionistInfoComponent } from './container/coaching/nutritionist/nutritionist-info/nutritionist-info.component';
import { PieComponent } from './helpers/chart/pie/pie.component';
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
import { ChallangeListComponent } from './container/challanges/challange-list/challange-list.component';
import { ChallangeViewComponent } from './container/challanges/challange-view/challange-view.component';
import { RewardUpdateComponent } from './container/rewards/reward-update/reward-update.component';
import { HorizontalBarComponent } from './helpers/chart/horizontal-bar/horizontal-bar.component';
import { LineComponent } from './helpers/chart/line/line.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { HeatMapComponent } from './helpers/chart/heat-map/heat-map.component';
import { BadgesListComponent } from './container/badges/badges-list/badges-list.component';
import { BadgesDetailComponent } from './container/badges/badges-detail/badges-detail.component';
import { SharedService } from './service/shared.service';
import { AddFaqComponent } from './container/setting/add-faq/add-faq.component';
import { EditFaqComponent } from './container/setting/edit-faq/edit-faq.component';
import { NotificationListComponent } from './container/notification/notification-list/notification-list.component';
import { NotificationSendComponent } from './container/notification/notification-send/notification-send.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ChallangeDetailComponent } from './container/challanges/challange-detail/challange-detail.component';
import { CardComponent } from './component/card/card.component';
import { GaugeComponent } from './helpers/chart/gauge/gauge.component';
import { RadarComponent } from './helpers/chart/radar/radar.component';
import { ReportComponent } from './container/hra/report/report.component';
import { ReportDetailComponent } from './container/hra/report-detail/report-detail.component';
import { CommonModule } from '@angular/common';
import { ReportsComponent } from './container/reports/reports/reports.component';

import { AccumulationChartModule } from '@syncfusion/ej2-angular-charts';
import { PieSeriesService, AccumulationLegendService, AccumulationTooltipService, AccumulationAnnotationService,
  AccumulationDataLabelService } from '@syncfusion/ej2-angular-charts';
import { DonutComponent } from './helpers/chart/donut/donut.component';
import { SaUsersComponent } from './container/reports/sa-users/sa-users.component';
import { SaCompaniesComponent } from './container/reports/sa-companies/sa-companies.component';
import { SaSurveyComponent } from './container/reports/sa-survey/sa-survey.component';
import { SaRewardschallengesChallengesComponent } from './container/reports/sa-rewardschallenges-challenges/sa-rewardschallenges-challenges.component';
import { SaRewardschallengesUserComponent } from './container/reports/sa-rewardschallenges-user/sa-rewardschallenges-user.component';
import { MyNutritionFilterComponent } from './helpers/my-nutrition-filter/my-nutrition-filter.component';
import { ReportPdfContainComponent } from './container/hra/report-pdf-contain/report-pdfcontain.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    DashboardComponent,
    UserRolesComponent,
    LoginComponent,
    ForgotPasswordComponent,
    CalendarComponent,
    ChatComponent,
    ResetPasswordComponent,
    SettingComponent,
    InsuranceComponent,
    SubscriptionPlanComponent,
    RoleAddComponent,
    RoleEditComponent,
    SubAdminListComponent,
    SubAdminAddComponent,
    SubAdminEditComponent,
    AccessComponent,
    SetPasswordComponent,
    PayslipComponent,
    ConfirmBoxComponent,
    CompanyListComponent,
    CompanyAddComponent,
    CompanyEditComponent,
    HraListComponent,
    HraAddComponent,
    HraEditComponent,
    HraViewComponent,
    ProfileComponent,
    InitiateSurveyComponent,
    StratSurveyComponent,
    DoughnutComponent,
    ActiveServeyComponent,
    AddSurveyComponent,
    EditSurveyComponent,
    ViewSurveyComponent,
    ListSurveyComponent,
    DetailSurveyComponent,
    VerticalBarComponent,
    MyCoachComponent,
    NutritionistComponent,
    NutritionistInfoComponent,
    PieComponent,
    NutritionistFactCreateComponent,
    PostViewComponent,
    MealPlanCreateComponent,
    MealPlanComponent,
    RecipeCreateComponent,
    RecipeComponent,
    MealPlanInfoComponent,
    GlossaryComponent,
    GlossaryCreateComponent,
    NutritionistFactEditComponent,
    GlossaryEditComponent,
    RecipeEditComponent,
    RecipeViewComponent,
    TemplateComponent,
    SurveyGridComponent,
    ExpiredSurveyComponent,
    MealPlanEditComponent,
    TemplateDetailComponent,
    PreTemplateComponent,
    PreTemplateDetailComponent,
    HealthProgramComponent,
    GoalsComponent,
    UpdateGoalsComponent,
    RewardCreateComponent,
    RewardDetailComponent,
    RewardListComponent,
    ChallangeListComponent,
    ChallangeViewComponent,
    RewardUpdateComponent,
    HorizontalBarComponent,
    LineComponent,
    HeatMapComponent,
    BadgesListComponent,
    BadgesDetailComponent,
    AddFaqComponent,
    EditFaqComponent,
    NotificationListComponent,
    NotificationSendComponent,
    ChallangeDetailComponent,
    CardComponent,
    GaugeComponent,
    RadarComponent,
    ReportComponent,
    ReportDetailComponent,
    ReportsComponent,
    DonutComponent,
    SaUsersComponent,
    SaCompaniesComponent,
    SaSurveyComponent,
    SaRewardschallengesChallengesComponent,
    SaRewardschallengesUserComponent,
    MyNutritionFilterComponent,
    ReportPdfContainComponent,
   
  ],
  imports: [
    BrowserModule,
    AccumulationChartModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule,
    MatListModule,
    MatCardModule,
    MatTableModule,
    ScheduleModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatTabsModule,
    FormsModule,
    HttpClientModule,
    NgxUiLoaderModule,
    MatSnackBarModule,
    MatChipsModule,
    MatProgressBarModule,
    NgxDropzoneModule,
    MatSlideToggleModule,
    MatExpansionModule,
    ChartsModule,
    MatMenuModule,
    MatRadioModule,
    MatDialogModule,
    MatTooltipModule,
    MatSelectModule,
    MatTreeModule,
    MatPaginatorModule,
    MatSortModule,
    MatDatepickerModule,
    MatNativeDateModule,
    RatingModule,
    MatSliderModule,
    CountdownModule,
    ChartModule,
    MatProgressSpinnerModule,
    NgImageSliderModule,
    NgApexchartsModule,
    NgxEditorModule,
    NgxMatSelectSearchModule,
    CommonModule
  ],
  providers: [{ provide: AuthGuardService, useClass: AuthGuardService }, MatDatepickerModule,
    SharedService, PieSeriesService, AccumulationLegendService, AccumulationTooltipService, AccumulationDataLabelService,
    AccumulationAnnotationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
