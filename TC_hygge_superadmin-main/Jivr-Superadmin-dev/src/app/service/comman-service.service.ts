import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CommonServiceService {
  getEmployee() {
    throw new Error('Method not implemented.');
  }
  token: any;
  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('token');
  }

  // fileUpload

  uploadDoc(file: File) {
    console.log(file);
    const fileData: FormData = new FormData();
    fileData.append('file', file);

    let headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    return this.http
      .post(
        `${environment.apiBaseUrl}api/v1/hrAdmin/uploadEventIcon`,
        fileData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //#region Delete Survey
  surveyDelete(formData: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.hrApiPath}surveyDelete`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }
  //#endregion

  // upload theme doc
  uploadThemeDoc(file: File, folder) {
    const fileData: FormData = new FormData();
    fileData.append('file', file);

    let headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    return this.http
      .post(
        `${environment.apiBaseUrl}api/v1/hrAdmin/companyThemeUpload?theme_Folder=${folder}`,
        fileData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //  Setting security udpate
  resetPassword(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}resetPassword`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // setting faq
  faq() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}companyFaq`,
        {},
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // setting privacy policy
  privacyPolicy() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}companyPrivacyPolicy`,
        {},
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // subscription Plan
  showData() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .get(`${environment.apiBaseUrl}${environment.apiPath}subscriptionPlan`, {
        headers,
      })
      .pipe(map((res) => <any>res));
  }


  // setting get theme
  getTheme() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .get(`${environment.apiBaseUrl}${environment.apiPath}companyShowTheme`, {
        headers,
      })
      .pipe(map((res) => <any>res));
  }

  // setting privacy policy
  updateTheme(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}companyUpdateTheme`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // setting get smtp
  getSmtp() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .get(`${environment.apiBaseUrl}${environment.apiPath}companyShowSMTP`, {
        headers,
      })
      .pipe(map((res) => <any>res));
  }

  // Event get leave type
  getleaveType() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .get(`${environment.apiBaseUrl}${environment.apiPath}leaveType `, {
        headers,
      })
      .pipe(map((res) => <any>res));
  }

  // Event get
  getEvent() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });

    return this.http
      .get(
        `${environment.apiBaseUrl}${environment.apiPath}companyShowCalendarEvent `,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }
  // Event get
  addEvent(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}companyAddCalendarEvent `,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // Event edit
  editEvent(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}companyUpdateCalendarEvent `,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // Role get
  getRole() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .get(`${environment.apiBaseUrl}${environment.apiPath}showRole `, {
        headers,
      })
      .pipe(map((res) => <any>res));
  }

  // Role add
  addRole(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}addRole `,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // Role edit
  editRole(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}editRole `,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // update role status
  editRoleStatus(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}statusRole `,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // delete role
  deleteRole(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}deleteRole `,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // Add subAdmin
  addSubAdmin(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}register `,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // get subAdmin list
  getSubAdmin() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .get(`${environment.apiBaseUrl}${environment.apiPath}getProfile `, {
        headers,
      })
      .pipe(map((res) => <any>res));
  }

  // get subAdmin list
  updateSubAdmin(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}updateProfile `,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // delete subadmin
  deleteSubAdmin(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}deleteProfile `,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // update sub admin
  updateSubAdminStatus(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}profileStatus `,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // get access modules list
  accessModuleList(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}accessModuleList `,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // get access module by role

  accessDetail(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}accessDetail `,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // update access allocation
  accessAllocation(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}accessAllocation `,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // add company
  addComapny(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}addCompnay`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // get Comapny
  getCompany() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .get(`${environment.apiBaseUrl}${environment.apiPath}showCompany `, {
        headers,
      })
      .pipe(map((res) => <any>res));
  }

  // delete company
  deleteCompany(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}deleteCompany`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // update company status
  statusCompany(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}statusCompany`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //get company by comapny id

  showCompanyByID(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}showCompanyByID`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //update company by comapny id

  editCompany(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}editCompany`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //get Designation list

  designationList() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .get(
        `${environment.apiBaseUrl}${environment.apiPath}contactDesignationList`,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //add hra
  addHra(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}addHraRiskQuestion`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //get Designation list
  hraList() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .get(
        `${environment.apiBaseUrl}${environment.apiPath}showHraRiskQuestion`,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //add hra
  getHraById(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}showHraRiskQuestionById`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //edit hra
  editHra(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}editHraRiskQuestion`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // delete hra
  deleteHra(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}questionDelete`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //Send invitation link to company
  companyInvite(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}companyInvitation`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // survey detail
  surveyDetail(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.hrApiPath}detailSurvey`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // finished survey detail
  attemptedQuestionSurvey(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.hrApiPath}attemptedQuestionSurvey`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // question detail
  questionDetail(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.hrApiPath}questionSubmissionSurvey`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // survery user detail
  surveyUser(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.hrApiPath}userAssignListSurvey`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //edit survey
  editSurvey(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.hrApiPath}surveyEdit`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // survery user detail
  individualResponsesSurvey(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.hrApiPath}individualResponsesSurvey`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // send to all user survey reminder
  reminderAllUserSurvey(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.hrApiPath}reminderAllUserSurvey`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // send to perticular user survey reminder
  reminderByUSerSurvey(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.hrApiPath}reminderByUSerSurvey`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // get survey question
  getSurveryQuestion(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.hrApiPath}surveyTypeByQuestion`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  deleteNotification(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}notificationDelete`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //add survey
  addSurveyQuestion(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.hrApiPath}addSurveyQuestion?branch_Id=0&access=1`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  companyReportDetail() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .get(`${environment.apiBaseUrl}${environment.apiPath}companyReportDetail`, {
        headers,
      })
      .pipe(map((res) => <any>res));
  }

  //not initiate survey list
  idleSurveyList(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.hrApiPath}showSurveyQuestion?branch_Id=0&access=1`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }
  // initiate surey
  initiatedSurvey(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.hrApiPath}initiatedSurvey?branch_Id=0&access=1`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }


  surveyDashboard() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http.post(
      `${environment.apiBaseUrl}${environment.apiPath}surveyDashboard`,
      {},
      { headers }
    )
      .pipe(map((res) => <any>res));
  }

  //Company Report
  companyReport() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .get(`${environment.apiBaseUrl}${environment.apiPath}companyReport`, {
        headers,
      })
      .pipe(map((res) => <any>res));
  }

  companyReportCalculation() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .get(`${environment.apiBaseUrl}${environment.hrApiPath}companyReportCalculation`, {
        headers,
      })
      .pipe(map((res) => <any>res));
  }


  //employeeReport
  employeeReport() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .get(`${environment.apiBaseUrl}${environment.apiPath}employeeReport`, {
        headers,
      })
      .pipe(map((res) => <any>res));
  }

  //ChallengesReport
  challengesReport() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .get(`${environment.apiBaseUrl}${environment.apiPath}ChallengesReport`, {
        headers,
      })
      .pipe(map((res) => <any>res));
  }

  //surveyReport
  getSurveyReport() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .get(`${environment.apiBaseUrl}${environment.apiPath}surveyReport`, {
        headers,
      })
      .pipe(map((res) => <any>res));
  }

  // active surey list
  activeSurveyList(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.hrApiPath}activeSurvey?branch_Id=0&access=1`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }
  archiveSurvey(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.hrApiPath}expirySurveyList?branch_Id=0&access=1`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //endsurvery
  endSurvey(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.hrApiPath}endActive_Survey`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  templates() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .get(`${environment.apiBaseUrl}${environment.hrApiPath}getTemplate`, {
        headers,
      })
      .pipe(map((res) => <any>res));
  }

  getTemplateQuestions(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.hrApiPath}getTemplateQuestions`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // Show Department List
  showDepartment() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .get(`${environment.apiBaseUrl}${environment.hrApiPath}showDepartment `, {
        headers,
      })
      .pipe(map((res) => <any>res));
  }

  // Show coaching category
  coachingCategory() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .get(`${environment.apiBaseUrl}${environment.apiPath}coachingCategory`, {
        headers,
      })
      .pipe(map((res) => <any>res));
  }

  // Coaching sub category
  coachingSubCategory(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}coachingsubCategory`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  mainDashboardApi() {
    //dashboardDetail
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}dashboardDetail`,
        {},
        { headers }
      )
      .pipe(map((res) => <any>res));
  }


  healthWellnessDashboard() {

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .get(
        `${environment.apiBaseUrl}api/v1/superAdmin/hra_reportEmployee`,

        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // Coaching fact list
  factList(formGroup) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}PostList`,
        formGroup,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }
  // Coaching fact create
  factCreate(formGroup) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}coachingAddPost`,
        formGroup,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //post detail
  PostDetails(formGroup) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}postDetails`,
        formGroup,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //post delete
  deletePost(formGroup) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}deletePost`,
        formGroup,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //post update
  updatePost(formGroup) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}updatePost`,
        formGroup,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //post status update
  updateStatusPost(formGroup) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}updatestatusPost`,
        formGroup,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //glossary list
  listGlossary() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .get(`${environment.apiBaseUrl}${environment.apiPath}listGlossary`, {
        headers,
      })
      .pipe(map((res) => <any>res));
  }
  // Coaching fact create
  glossaryCreate(formGroup) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}addGlossary`,
        formGroup,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //delete glossary
  deleteGlossary(formGroup) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}deleteGlossary`,
        formGroup,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //detail Glossary
  detailGlossary(formGroup) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}detailGlossary`,
        formGroup,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // Coaching fact create
  glossaryEdit(formGroup) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}editGlossary`,
        formGroup,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // create recipe
  createRecipe(formGroup) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}AddRecipes`,
        formGroup,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // list recipe
  listRecipe() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .get(`${environment.apiBaseUrl}${environment.apiPath}listRecipes`, {
        headers,
      })
      .pipe(map((res) => <any>res));
  }

  //delete recipe
  deleteRecipes(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}deleteRecipes`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //update status of recipe
  updateStatusRecipes(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}updatestatusRecipesList`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //detail of recipe
  detailRecipes(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}detailRecipes`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //edit recipe
  editRecipes(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}editRecipes`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //meal plan list
  mealPlanlist() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .get(`${environment.apiBaseUrl}${environment.apiPath}mealPlanlist`, {
        headers,
      })
      .pipe(map((res) => <any>res));
  }

  //add meal plan
  mealAdd(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}addmealPlans`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //delete meal plan
  mealDelete(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}deletemealPlans`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //update meal plan
  mealUpdate(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}statusMealPlan`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  mealDetail(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}detailMealPlan`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  updateGlossaryStatus(formdata) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}updatestatusGlossaryList`,
        formdata,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //update meal plan
  mealUpdatePlan(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}editmealPlans`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //halth management category
  getHealthCategory() {
    let data = {
      coachingcat_id: '2',
    };
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}coachingsubCategory`,
        data,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // halth management subcategory
  getHealthSubCategory(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}getprogramgoals`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // update goal
  updateGoal(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}editgoal`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // challanges list
  getchallanges() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .get(`${environment.apiBaseUrl}${environment.apiPath}challeneges`, {
        headers,
      })
      .pipe(map((res) => <any>res));
  }

  // challanges add
  getaddchallanges(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}publishChallenge`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  deactiveChallenege(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}actionRequiredChallenge`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }
  graphDetailChallenege(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}graphDetailChallenege`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }
  // create reward
  createReward(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}createReward?branch_Id=0&access=1`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // update reward
  updateReward(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}updateRewards`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // create reward
  listReward() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .get(
        `${environment.apiBaseUrl}${environment.apiPath}showRewards?branch_Id=0&access=1`,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }
  // status reward
  statusReward(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}rewardStatus`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // delete reward
  deleteReward(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}deleteRewards`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }
  // delete reward
  getSingleReward(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}rewardDetailById`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }
  // delete reward
  detailReward(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}rewardsDetails`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }
  // graph reward
  graphReward(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}graphDetailReward?branch_Id=0&access=1`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }
  // graph reward
  graphTopRedeemReward(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}topRedeemReward?branch_Id=0&access=1`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // graph reward
  graphRedeemReward(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}redeemGraphReward?branch_Id=0&access=1`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //badges list
  badgesList() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .get(`${environment.apiBaseUrl}${environment.apiPath}BadgesList`, {
        headers,
      })
      .pipe(map((res) => <any>res));
  }

  //super admin profile data
  superAdminProfile(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}showByUserProfile`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //update super admin profile data
  superAdminProfileUpdate(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}updateByUserProfile`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //update super admin password
  superAdminChangePassword(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}resetPassword`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //faq
  getFaq() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .get(`${environment.apiBaseUrl}${environment.apiPath}showFaq`, {
        headers,
      })
      .pipe(map((res) => <any>res));
  }

  //add faq
  addFaq(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(`${environment.apiBaseUrl}${environment.apiPath}addFaq`, formData, {
        headers,
      })
      .pipe(map((res) => <any>res));
  }

  //edit faq
  editFaq(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}editFaq`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //delete faq
  deleteFaq(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}deleteFaq`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //privacy  policy
  getPrivacyPolicy() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .get(`${environment.apiBaseUrl}${environment.apiPath}showprivacyPolicy`, {
        headers,
      })
      .pipe(map((res) => <any>res));
  }

  //edit privacy policy
  updatePrivacyPolicy(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}updatePrivacyPolicy`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //notification list
  getNotification() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .get(`${environment.apiBaseUrl}${environment.apiPath}notificationList`, {
        headers,
      })
      .pipe(map((res) => <any>res));
  }
  //edit privacy policy
  setNotification(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}notificationSendFilter`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //create company branch
  createBranch(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.hrApiPath}createBranch`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //hra report user list
  hraUserList(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}hraUserList`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //copyApastSurvey
  copyApastSurveyApi() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.hrApiPath}copyApastSurvey`,
        {},
        { headers }
      )
      .pipe(map((res) => <any>res));
  }


  //hra report user list
  // hraUserDetail(formData) {
  //   let headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     Authorization: this.token,
  //   });
  //   return this.http
  //     .post(
  //       `${environment.apiBaseUrl}${environment.apiPath}hraScoreByUser`,
  //       formData,
  //       { headers }
  //     )
  //     .pipe(map((res) => <any>res));
  // }
  showHraCompanyList() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .get(
        `${environment.apiBaseUrl}api/v1/superAdmin/showHraCompanyList`,

        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  superCompanyCalculation(data: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(`${environment.apiBaseUrl}api/v1/superAdmin/superCompanyCalculation`,
        data,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }


  monthlyAverageAndDuration() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .get(
        `${environment.apiBaseUrl}${environment.apiPath}monthlyAverageAndDuration`,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }
}