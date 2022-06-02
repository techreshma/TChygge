import { BrowserModule, HammerModule,HAMMER_GESTURE_CONFIG, HammerGestureConfig } from '@angular/platform-browser';
import * as Hammer from 'hammerjs';
import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import { ScheduleModule } from '@syncfusion/ej2-angular-schedule';
import { DayService, WeekService, WorkWeekService, MonthService, AgendaService, MonthAgendaService} from '@syncfusion/ej2-angular-schedule';
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
import { HttpClientModule } from '@angular/common/http';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSliderModule} from '@angular/material/slider';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {SwipeAngularListModule} from  'swipe-angular-list';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { TextMaskModule } from 'angular2-text-mask';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './common/header/header.component';
import { SidebarComponent } from './common/sidebar/sidebar.component';
import { DashboardComponent } from './container/other/dashboard/dashboard.component';
import { UserRolesComponent } from './container/roles-access/user-roles/user-roles.component';
import { AccessComponent } from './container/roles-access/access/access.component';
import { RoleAddComponent } from './container/roles-access/role-add/role-add.component';
import { RoleEditComponent } from './container/roles-access/role-edit/role-edit.component';
import { LoginComponent } from './auth/login/login.component';
import { SetPasswordComponent } from './auth/set-password/set-password.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { CalendarComponent } from './container/other/calendar/calendar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ChatComponent } from './container/other/chat/chat.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { AuthGuardService } from './service/auth-guard.service';
import { EmployeesComponent } from './container/employee/employees/employees.component';
import { EmployeeDetailComponent } from './container/employee/employee-detail/employee-detail.component';
import { EmployeeAddComponent } from './container/employee/employee-add/employee-add.component';
import { EmployeeEditComponent } from './container/employee/employee-edit/employee-edit.component';
import { SettingComponent } from './container/other/setting/setting.component';
import { InsuranceComponent } from './container/other/insurance/insurance.component';
import { EmployeeSalaryComponent } from './container/salary/employee-salary/employee-salary.component';
import { PayslipComponent } from './container/salary/payslip/payslip.component';
import { PayslipDetailComponent } from './container/salary/payslip-detail/payslip-detail.component';
import { ContractsComponent } from './container/documents/contracts/contracts.component';
import { ConfirmBoxComponent } from './confirm-box/confirm-box.component';
import { CsvUploadComponent } from './container/employee/csv-upload/csv-upload.component';
import { ContractsAddComponent } from './container/documents/contracts-add/contracts-add.component';
import { InsuranceEditComponent } from './container/other/insurance-edit/insurance-edit.component';
import { InsuranceAddComponent } from './container/other/insurance-add/insurance-add.component';
import { FilterComponent } from './container/employee/filter/filter.component';
import { FaqComponent } from './container/company/faq/faq.component';
import { PrivacyPolicyComponent } from './container/company/privacy-policy/privacy-policy.component';
import { ProfileComponent } from './container/company/profile/profile.component';
import { MatNativeDateModule } from '@angular/material/core';
import { SubAdminListComponent } from './container/sub-admin/sub-admin-list/sub-admin-list.component';
import { SubAdminAddComponent } from './container/sub-admin/sub-admin-add/sub-admin-add.component';
import { SubAdminEditComponent } from './container/sub-admin/sub-admin-edit/sub-admin-edit.component';
import { MissingListComponent } from './container/documents/missing-list/missing-list.component';
import { LeavesListComponent } from './container/leaves/leaves-list/leaves-list.component';
import { LeaveFilterComponent } from './container/leaves/leave-filter/leave-filter.component';
import { ManageLeavesComponent } from './container/leaves/manage-leaves/manage-leaves.component';
import { LeaveAddComponent } from './container/leaves/leave-add/leave-add.component';
import { EmployeeLeaveManageComponent } from './container/leaves/employee-leave-manage/employee-leave-manage.component';
import { PayslipOneComponent } from './container/salary/payslip-one/payslip-one.component';
import { PayslipEditComponent } from './container/salary/payslip-edit/payslip-edit.component';
import { PayslipGenerateComponent } from './container/salary/payslip-generate/payslip-generate.component';
import { DoughnutComponent } from './helpers/chart/doughnut/doughnut.component';
import { ActiveServeyComponent } from './container/survey/active-servey/active-servey.component';
import { AddSurveyComponent } from './container/survey/add-survey/add-survey.component';
import { ViewSurveyComponent } from './container/survey/view-survey/view-survey.component';
import { ListSurveyComponent } from './container/survey/list-survey/list-survey.component';
import { DetailSurveyComponent } from './container/survey/detail-survey/detail-survey.component';
import { VerticalBarComponent } from './helpers/chart/vertical-bar/vertical-bar.component';
import { SharedService } from './service/shared.service';
import { ContractEditComponent } from './container/documents/contracts/contract-edit/contract-edit.component';
import { InitiateSurveyComponent } from './container/survey/initiate-survey/initiate-survey.component';
import { StratSurveyComponent } from './container/survey/strat-survey/strat-survey.component';
import { AgoPipePipe } from './pipe/ago-pipe.pipe';
import { CountdownModule } from 'ngx-countdown';
import { SpeedDialFabComponent } from './helpers/speed-dial-fab/speed-dial-fab.component';
import {MatBadgeModule} from '@angular/material/badge';
import { ChatService } from './service/chat-service.service';
import { WebsocketService } from './service/websocket-service.service';
import { EditSurveyComponent } from './container/survey/edit-survey/edit-survey.component';
import { ExpiredSurveyComponent } from './container/survey/expired-survey/expired-survey.component';
import { UploadComponent } from './container/other/chat/upload/upload.component';
import { HighlightPipe } from './pipe/highlight.pipe';
import { AmountToWordPipe } from './pipe/amount-to-word.pipe'
import { CallComponent } from './container/other/chat/call/call.component';
import { BackupComponent } from './container/other/chat/backup/backup.component';
import { TemplateComponent } from './container/survey/template/template.component';
import { TemplateDetailComponent } from './container/survey/template-detail/template-detail.component';
import { SurveyGridComponent } from './container/survey/survey-grid/survey-grid.component';
import { PreTemplateComponent } from './container/survey/pre-template/pre-template.component';
import { PreTemplateDetailComponent } from './container/survey/pre-template-detail/pre-template-detail.component';
import { PayslipThreeComponent } from './container/salary/payslip-three/payslip-three.component';
import { PayslipFiveComponent } from './container/salary/payslip-five/payslip-five.component';
import { PayslipSixComponent } from './container/salary/payslip-six/payslip-six.component';
import { PayslipFourComponent } from './container/salary/payslip-four/payslip-four.component';
import { PayslipTwoComponent } from './container/salary/payslip-two/payslip-two.component';
import { PayslipPreviewComponent } from './container/salary/payslip-preview/payslip-preview.component';

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
import { NotificationListComponent } from './container/notification/notification-list/notification-list.component';
import { NotificationSendComponent } from './container/notification/notification-send/notification-send.component';
import { ReportsComponent } from './container/reports/reports/reports.component';
import { AttendanceReportComponent } from './container/reports/attendance-report/attendance-report.component';
import { MatSelectSearchComponent } from './helpers/search/mat-select-search/mat-select-search.component';
import { ChallangeDetailComponent } from './container/challanges/challange-detail/challange-detail.component';
import { EmployeeReportComponent } from './container/reports/employee-report/employee-report.component';
import { LeavesReportComponent } from './container/reports/leaves-report/leaves-report.component';
import { DocumentReportComponent } from './container/reports/document-report/document-report.component';
import { SalaryReportComponent } from './container/reports/salary-report/salary-report.component';
import { ChallengesReportComponent } from './container/reports/challenges-report/challenges-report.component';
import { BadgesReportComponent } from './container/reports/badges-report/badges-report.component';
import { SurveyReportComponent } from './container/reports/survey-report/survey-report.component';
import { TableComponent } from './component/table/table.component';
import { AlertService } from './service/alert.service';
import { CardComponent } from './component/card/card.component';

import  {  NgxEmojiPickerModule  }  from  'ngx-emoji-picker';
import { BranchListComponent } from './container/branch/branch-list/branch-list.component';
import { BranchCreateComponent } from './container/branch/branch-create/branch-create.component';
import { BranchAccessComponent } from './container/branch/branch-access/branch-access.component';
import { BranchEditComponent } from './container/branch/branch-edit/branch-edit.component';
import { CsvDataComponent } from './container/employee/csv-data/csv-data.component';
import { GaugeComponent } from './helpers/chart/gauge/gauge.component';
import { RadarComponent } from './helpers/chart/radar/radar.component';
import { PopupmodalComponent } from './component/popupmodal/popupmodal.component';
import { SearchfilterPipe } from './pipe/searchfilter.pipe';
import { StringcasePipe } from './pipe/stringcase.pipe';
import { HealthwellnessComponent } from './container/healthwellness/healthwellness.component';

const config: SocketIoConfig = { url: 'http://localhost:5000', options: {transports: ['websocket']} };
export class MyHammerConfig extends HammerGestureConfig {
  overrides = <any>{
  swipe: { direction: Hammer.DIRECTION_ALL },
  };
}
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    DashboardComponent,
    UserRolesComponent,
    AccessComponent,
    RoleAddComponent,
    RoleEditComponent,
    LoginComponent,
    SetPasswordComponent,
    ForgotPasswordComponent,
    CalendarComponent,
    ChatComponent,
    ResetPasswordComponent,
    EmployeesComponent,
    EmployeeDetailComponent,
    EmployeeEditComponent,
    EmployeeAddComponent,
    SettingComponent,
    InsuranceComponent,
    EmployeeSalaryComponent,
    PayslipComponent,
    PayslipDetailComponent,
    ContractsComponent,
    ConfirmBoxComponent,
    CsvUploadComponent,
    ContractsAddComponent,
    InsuranceAddComponent,
    InsuranceEditComponent,
    ProfileComponent,
    FilterComponent,
    FaqComponent,
    PrivacyPolicyComponent,
    SubAdminListComponent,
    SubAdminAddComponent,
    SubAdminEditComponent,
    MissingListComponent,
    LeavesListComponent,
    LeaveFilterComponent,
    ManageLeavesComponent,
    LeaveAddComponent,
    EmployeeLeaveManageComponent,
    PayslipOneComponent,
    PayslipThreeComponent,
    PayslipFiveComponent,
    PayslipSixComponent,
    PayslipFourComponent,
    PayslipTwoComponent,
    PayslipEditComponent,
    PayslipGenerateComponent,
    DoughnutComponent,
    ActiveServeyComponent,
    AddSurveyComponent,
    ViewSurveyComponent,
    ListSurveyComponent,
    DetailSurveyComponent,
    VerticalBarComponent,
    ContractEditComponent,
    InitiateSurveyComponent,
    StratSurveyComponent,
    AgoPipePipe,
    SpeedDialFabComponent,
    EditSurveyComponent,
    ExpiredSurveyComponent,
    UploadComponent,
    HighlightPipe,
    BackupComponent,
    CallComponent,
    TemplateComponent,
    TemplateDetailComponent,
    SurveyGridComponent,
    PreTemplateComponent,
    PreTemplateDetailComponent,
    PayslipPreviewComponent,
    CsvDataComponent,
    RewardCreateComponent,
    RewardDetailComponent,
    RewardListComponent,
    ChallangeListComponent,
    ChallangeViewComponent,
    RewardUpdateComponent,
    HorizontalBarComponent,
    LineComponent,
    HeatMapComponent,
    NotificationListComponent,
    NotificationSendComponent,
    ReportsComponent,
    AttendanceReportComponent,
    MatSelectSearchComponent,
    ChallangeDetailComponent,
    EmployeeReportComponent,
    LeavesReportComponent,
    DocumentReportComponent,
    SalaryReportComponent,
    ChallengesReportComponent,
    BadgesReportComponent,
    SurveyReportComponent,
    TableComponent,
    CardComponent,
    BranchListComponent,
    BranchCreateComponent,
    BranchAccessComponent,
    BranchEditComponent,
    GaugeComponent,
    RadarComponent,
    PopupmodalComponent,
    SearchfilterPipe,
    AmountToWordPipe,
    StringcasePipe,
    HealthwellnessComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    InfiniteScrollModule,
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
    NgxDaterangepickerMd.forRoot(),
    NgxMatSelectSearchModule,
    MatProgressSpinnerModule,
    MatButtonToggleModule,
    CountdownModule,
    MatSliderModule,
    SwipeAngularListModule,
    HammerModule,
    MatBadgeModule,
    SocketIoModule.forRoot(config),
    TextMaskModule,
    NgApexchartsModule,
    NgxEmojiPickerModule

  ],
  providers: [{ provide: AuthGuardService, useClass: AuthGuardService },
    MatDatepickerModule,
    SharedService,
    ChatService,
    AlertService,
    WebsocketService,
    { provide: HAMMER_GESTURE_CONFIG, useClass: MyHammerConfig },
    DayService,
    WeekService,
    WorkWeekService,
    MonthService,
    AgendaService,
    MonthAgendaService],
  bootstrap: [AppComponent]
})
export class AppModule { }
