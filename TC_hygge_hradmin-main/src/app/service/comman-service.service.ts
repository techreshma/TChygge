import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CommonServiceService {
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

  // upload theme doc
  uploadThemeDoc(file: File, folder) {
    console.log(file);
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

  // upload document
  uploadDocDoc(file: File) {
    console.log(file);
    const fileData: FormData = new FormData();
    fileData.append('file', file);

    let headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    return this.http
      .post(
        `${environment.apiBaseUrl}api/v1/hrAdmin/documentUpload`,
        fileData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // Setting security udpate
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
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .get(
        `${environment.apiBaseUrl}${environment.apiPath}companyShowSMTP?branch_Id=${branchData.branch_Id}`,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // Event get leave type
  getleaveType() {
    let branchData = this.getBranchData();
    let permission = branchData.access.filter(
      (item) => item.module == 'Leaves'
    ).permission;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .get(
        `${environment.apiBaseUrl}${environment.apiPath}leaveType?branch_Id=${branchData.branch_Id}?access=${permission}`,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // Event get
  getEvent() {
    let branchData = this.getBranchData();
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
    let branchData = this.getBranchData();
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
    let branchData = this.getBranchData();
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

  // delete event
  companyDeleteCalendarEvent(formData) {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}companyDeleteCalendarEvent `,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // Role get
  getRole() {
    let branchData = this.getBranchData();
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
    let branchData = this.getBranchData();
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

  // Role edit
  editRole(formData) {
    let branchData = this.getBranchData();
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
    let branchData = this.getBranchData();
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
    let branchData = this.getBranchData();
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
  addEmployee(formData) {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}addEmployee`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // get Employee list
  getEmployee() {
    let branchData = this.getBranchData();
    let permission = branchData.access.filter(
      (item) => item.module == 'Employees'
    )[0].permission;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .get(
        `${environment.apiBaseUrl}${environment.apiPath}showEmployee?branch_Id=${branchData.branch_Id}&access=${permission} `,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // update Employee
  updateEmployee(formData) {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    formData['branch_Id'] = branchData.branch_Id;
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}editEmployee `,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  deleteEmployee(formData) {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}deleteEmployee `,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // employee status update
  updateEmployeeStatus(formData) {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}statusEmployee`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  uploadEmployeeCsvVerify(formData, param) {
    let branchData = this.getBranchData();
    console.log(formData);
    const fileData: FormData = new FormData();
    fileData.append('', formData);
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}csvFileUploadVerify?company_id=${param.company_id}&ip_Address=${param.ip}&userID=employeeGraphDetail`,
        fileData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // get access modules list
  accessModuleList(formData) {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}api/v1/superAdmin/accessModuleList `,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // get access module by role

  accessDetail(formData) {
    let branchData = this.getBranchData();
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
    let branchData = this.getBranchData();
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

  companyReportCalculation() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .get(`${environment.apiBaseUrl}${environment.apiPath}companyReportCalculation`, {
        headers,
      })
      .pipe(map((res) => <any>res));
  }

  // getting company working day
  companyWorkingDay() {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .get(
        `${environment.apiBaseUrl}${environment.apiPath}companyWorkingDay?branch_Id=${branchData.branch_Id} `,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // getting company working day
  companyWorkingDaySet(formData) {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}companyWorkingDayUpdate?branch_Id=${branchData.branch_Id} `,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // update smtp detail
  smptypDetailUpdate(formData) {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}companyUpdateSMTP?branch_Id=${branchData.branch_Id}`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  uploadEmployeeCsv(formData, param) {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}employeeRaw_CSV_TO_DB?company_id=${param.company_id}&ip_Address=${param.ip}&userID=1`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // get employee select list
  showEmployeeName() {
    let branchData = this.getBranchData();
    let permission = branchData.access.filter(
      (item) => item.module == 'Documents'
    )[0].permission;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .get(
        `${environment.apiBaseUrl}${environment.apiPath}showEmployeeName?branch_Id=${branchData.branch_Id}&access=${permission} `,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // add doc
  addDoc(formData) {
    let branchData = this.getBranchData();
    let permission = branchData.access.filter(
      (item) => item.module == 'Documents'
    )[0].permission;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}addEmpDocument?branch_Id=${branchData.branch_Id}&access=${permission} `,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  editDoc(formData) {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}updateEmpDocument `,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // show Doc
  showDoc(formData) {
    let branchData = this.getBranchData();
    let permission = branchData.access.filter(
      (item) => item.module == 'Documents'
    )[0].permission;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}showEmployeeDocument?branch_Id=${branchData.branch_Id}&access=${permission} `,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // update doc status
  docStatusUpdate(formData) {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}statusEmployeeDocument `,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // delete Docs
  docDelete(formData) {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}deleteEmployeeDocument `,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // Show Insurance List
  showInsurance() {
    let branchData = this.getBranchData();
    let permission = branchData.access.filter(
      (item) => item.module == 'Insurance'
    )[0].permission;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .get(
        `${environment.apiBaseUrl}${environment.apiPath}showInsurance?branch_Id=${branchData.branch_Id}&access=${permission} `,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // Insurance add
  addInsurance(formData) {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}addInsurance?branch_Id=${branchData.branch_Id} `,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // Delete Insurance
  deleteInsurance(formData) {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}deleteInsurance `,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // Edit insurance

  editInsurance(formData) {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}updateInsurance `,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //invitation link for employee
  invitationLink(formData) {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}invitationLink `,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // Show Department List
  showDepartment() {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .get(`${environment.apiBaseUrl}${environment.apiPath}showDepartment `, {
        headers,
      })
      .pipe(map((res) => <any>res));
  }

  //add departement
  addDepartment(formData) {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}addDepartment `,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //delete departement
  deleteDepartment(formData) {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}deleteDepartment `,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // Show Leave List
  showLeave() {
    let branchData = this.getBranchData();
    let permission = branchData.access.filter(
      (item) => item.module == 'Leaves'
    )[0].permission;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .get(
        `${environment.apiBaseUrl}${environment.apiPath}showLeaveType?branch_Id=${branchData.branch_Id}&access=${permission} `,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //add leave
  addLeave(formData) {
    let branchData = this.getBranchData();
    let permission = branchData.access.filter(
      (item) => item.module == 'Leaves'
    )[0].permission;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}addLeaveType?branch_Id=${branchData.branch_Id}&access=${permission} `,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //delete leave
  deleteLeave(formData) {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}deleteLeaveType `,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // Show Salary breakdown List
  showSalary() {
    let branchData = this.getBranchData();
    let permission = branchData.access.filter(
      (item) => item.module == 'Salary Management'
    )[0].permission;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .get(
        `${environment.apiBaseUrl}${environment.apiPath}showSalaryType?branch_Id=${branchData.branch_Id}&access=${permission}`,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //add salary type
  addSalary(formData) {
    let branchData = this.getBranchData();
    let permission = branchData.access.filter(
      (item) => item.module == 'Salary Management'
    )[0].permission;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}addSalaryType?branch_Id=${branchData.branch_Id}&access=${permission} `,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //delete salary type
  deleteSalary(formData) {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}deleteSalaryType `,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // Show Holiday List
  showHoliday() {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .get(`${environment.apiBaseUrl}${environment.apiPath}showHoliday `, {
        headers,
      })
      .pipe(map((res) => <any>res));
  }

  //add holiday
  addHoliday(formData) {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}addHoliday `,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //delete holiday
  deleteHoliday(formData) {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}deleteHoliday `,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // Show Doc type List
  showDocType() {
    let branchData = this.getBranchData();
    let permission = branchData.access.filter(
      (item) => item.module == 'Documents'
    )[0].permission;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .get(
        `${environment.apiBaseUrl}${environment.apiPath}showDocumentType?branch_Id=${branchData.branch_Id}&access=${permission} `,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //add Doc Type
  addDocType(formData) {
    let branchData = this.getBranchData();
    let permission = branchData.access.filter(
      (item) => item.module == 'Documents'
    )[0].permission;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}addDocumentType?branch_Id=${branchData.branch_Id}&access=${permission} `,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //delete doc type
  deleteDocType(formData) {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}deleteDocumentType `,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // test email
  testEmail(formData) {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}testmailSMTP `,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // get subAdmin list
  getSubAdmin() {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .get(`${environment.apiBaseUrl}${environment.apiPath}subAdminHrList `, {
        headers,
      })
      .pipe(map((res) => <any>res));
  }

  // update sub admin
  updateSubAdminStatus(formData) {
    let branchData = this.getBranchData();
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

  // employee notification for doucment related
  notifyUser(formData) {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}employeeNotification `,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }
  // employee missing doc list
  missingDoc(formData) {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}employeeDocMissingList `,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // download sample csv
  getSampleCsv() {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .get(`${environment.apiBaseUrl}${environment.apiPath}csvColumn`, {
        headers,
      })
      .pipe(map((res) => <any>res));
  }
  //get leave data
  getLeave(formData) {
    let branchData = this.getBranchData();
    let permission = branchData.access.filter(
      (item) => item.module == 'Leaves'
    )[0].permission;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}showLeaveEmployeeList?branch_Id=${branchData.branch_Id}&access=${permission}`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // manage leave
  modifyEmployeeleave(formData) {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}modifyEmployeeleave`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //Accept reject leave request
  requestEmployeeleave(formData) {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}requestEmployeeleave`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //manage leave balance
  manageEmployeeleaveBalance(formData) {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}manageEmployeeleaveBalance`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //add leave
  addLeaveEmployee(formData) {
    let branchData = this.getBranchData();

    let permission = branchData.access.filter(
      (item) => item.module == 'Leaves'
    )[0].permission;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}addLeaveEmployee?branch_Id=${branchData.branch_Id}&access=${permission}`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //doucment type list
  documentTypeList() {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .get(`${environment.apiBaseUrl}${environment.apiPath}documentTypeList`, {
        headers,
      })
      .pipe(map((res) => <any>res));
  }

  //Compansation template data
  compensationTemplate() {
    let branchData = this.getBranchData();
    let permission = branchData.access.filter(
      (item) => item.module == 'Salary Management'
    )[0].permission;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .get(
        `${environment.apiBaseUrl}${environment.apiPath}showCompensationTemplate?branch_Id=${branchData.branch_Id}&access=${permission}`,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }
  // edit compansation
  editCompensationTemplate(formData) {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}editCompensationTemplate`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //generate pay slip
  addPatSlip(formData) {
    let branchData = this.getBranchData();
    let permission = branchData.access.filter(
      (item) => item.module == 'Salary Management'
    )[0].permission;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}addPaySlip?branch_Id=${branchData.branch_Id}&access=${permission}`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //Payslip id
  showLastPaySlipId() {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .get(`${environment.apiBaseUrl}${environment.apiPath}showLastPaySlipId`, {
        headers,
      })
      .pipe(map((res) => <any>res));
  }

  //mail Payslip
  payslipMail(formData) {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}payslipMail`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //payslip update
  showPaySliptemplate(formData) {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}showPaySliptemplate`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //payslip report
  showPaySlipReport(formData) {
    let branchData = this.getBranchData();
    let permission = branchData.access.filter(
      (item) => item.module == 'Salary Management'
    )[0].permission;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}showPaySlipReport?branch_Id=${branchData.branch_Id}&access=${permission}`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  healthWellnessDashboard(formData) {
    let branchData = this.getBranchData();
    let permission = branchData.access.filter(
      (item) => item.module == 'Leaves'
    )[0].permission;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}HealthAndWellnessDashboard?branch_Id=${branchData.branch_Id}&access=${permission}`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  leaveDashboardGraph(formData) {
    //
    let branchData = this.getBranchData();
    let permission = branchData.access.filter(
      (item) => item.module == 'Leaves'
    )[0].permission;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}leaveDashboardGraph?branch_Id=${branchData.branch_Id}&access=${permission}`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //barchart data
  showDepartmentSalary() {
    let branchData = this.getBranchData();
    let permission = branchData.access.filter(
      (item) => item.module == 'Salary Management'
    )[0].permission;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .get(
        `${environment.apiBaseUrl}${environment.apiPath}showDepartmentSalary?branch_Id=${branchData.branch_Id}&access=${permission}`,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //Main Dashboard api
  dashBoardApi(formData) {

    let branchData = this.getBranchData();
    console.log(branchData)
    let permission = branchData.access.filter(
      (item) => item.module == 'Salary Management'
    )[0].permission;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}dashboardDetail?branch_Id=${branchData.branch_Id}&access=${permission}`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //get company by id
  showCompanyByID(formData) {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}api/v1/superAdmin/showCompanyByID`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // edit company
  editCompany(formData) {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        // `${environment.apiBaseUrl}${environment.apiPath}editCompany`,
        `${environment.apiBaseUrl}api/v1/superAdmin/editCompany`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //add survey
  addSurveyQuestion(formData) {
    let branchData = this.getBranchData();
    let permission = branchData.access.filter(
      (item) => item.module == 'Surveys'
    )[0].permission;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}addSurveyQuestion?branch_Id=${branchData.branch_Id}&access=${permission}`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //not initiate survey list
  idleSurveyList(formData) {
    let branchData = this.getBranchData();
    let permission = branchData.access.filter(
      (item) => item.module == 'Surveys'
    )[0].permission;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}showSurveyQuestion?branch_Id=${branchData.branch_Id}&access=${permission}`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }
  // initiate surey
  initiatedSurvey(formData) {
    let branchData = this.getBranchData();
    let permission = branchData.access.filter(
      (item) => item.module == 'Surveys'
    )[0].permission;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}initiatedSurvey?branch_Id=${branchData.branch_Id}&access=${permission}`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // active surey list
  activeSurveyList(formData) {
    let branchData = this.getBranchData();
    let permission = branchData.access.filter(
      (item) => item.module == 'Surveys'
    )[0].permission;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}activeSurvey?branch_Id=${branchData.branch_Id}&access=${permission}`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // active update Document Type
  updateDocumentType(formData) {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}updateDocumentType`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // survey detail
  surveyDetail(formData) {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}detailSurvey`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // finished survey detail
  attemptedQuestionSurvey(formData) {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}attemptedQuestionSurvey`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // question detail
  questionDetail(formData) {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}questionSubmissionSurvey`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // survery user detail
  surveyUser(formData) {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}userAssignListSurvey`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // survery user detail
  individualResponsesSurvey(formData) {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}individualResponsesSurvey`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // send to all user survey reminder
  reminderAllUserSurvey(formData) {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}reminderAllUserSurvey`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // send to perticular user survey reminder
  reminderByUSerSurvey(formData) {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}reminderByUSerSurvey`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // get survey question
  getSurveryQuestion(formData) {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}surveyTypeByQuestion`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // Delete Survey
  deleteSurvey(formData) {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}surveyDelete`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // Delete Survey
  editSurvey(formData) {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}surveyEdit`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }
  // Delete Survey
  archiveSurvey(formData) {
    let branchData = this.getBranchData();
    let permission = branchData.access.filter(
      (item) => item.module == 'Surveys'
    )[0].permission;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}expirySurveyList?branch_Id=${branchData.branch_Id}&access=${permission}`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //endsurvery
  endSurvey(formData) {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}endActive_Survey`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  templates() {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .get(`${environment.apiBaseUrl}${environment.apiPath}getTemplate`, {
        headers,
      })
      .pipe(map((res) => <any>res));
  }

  getTemplateQuestions(formData) {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}getTemplateQuestions`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //share chat history
  backup(formData) {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}chatHistory`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //create chat group
  createGroup(formData) {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}createGroup`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // add user in group
  updateGroup(formData) {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}addNewUserInGroup`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // chatViewbyUser

  chatViewByUser(formData) {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}readMessage`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // chat group list
  GroupList(formData) {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}contactList`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // chat group list
  chatMessage(formData) {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}chatMessage`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // chat user list
  ChatUserList(formData) {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}userList`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // chat group user list
  groupUserLis(formData) {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}groupUserList`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // chat group user list
  leaveGroup(formData) {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}userLeaveByGroup`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // delete group
  deleteGroup(formData) {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}deleteGroup`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // video call
  vedioGroupCall(formData) {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}vedioGroupCall`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  sandwichLeave(formData) {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}sandwichLeave?branch_Id=${branchData.branch_Id}`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  getsandwichleave(formData) {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}getsandwichleave?branch_Id=${branchData.branch_Id}`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // emplyee data
  getemployee(formData) {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}employeeDetails`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // employee detail
  getEmployeeDetail(formData) {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}employeeRecordDetail`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //get Designation list

  designationList() {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .get(
        `${environment.apiBaseUrl}api/v1/superAdmin/contactDesignationList`,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // challanges list
  getchallanges() {
    let branchData = this.getBranchData();
    let permission = branchData.access.filter(
      (item) => item.module == 'Challenges'
    )[0].permission;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .get(
        `${environment.apiBaseUrl}${environment.apiPath}challeneges?branch_Id=${branchData.branch_Id}&access=${permission}`,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // challanges add
  getaddchallanges(formData) {
    let branchData = this.getBranchData();
    let permission = branchData.access.filter(
      (item) => item.module == 'Challenges'
    )[0].permission;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}publishChallenge?branch_Id=${branchData.branch_Id}&access=${permission}`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }
  graphDetailChallenege(formData) {
    let branchData = this.getBranchData();
    let permission = branchData.access.filter(
      (item) => item.module == 'Challenges'
    )[0].permission;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}graphDetailChallenege?branch_Id=${branchData.branch_Id}&access=${permission}`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  deactiveChallenege(formData) {
    let branchData = this.getBranchData();
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
  // create reward
  createReward(formData) {
    let branchData = this.getBranchData();
    let permission = branchData.access.filter(
      (item) => item.module == 'Rewards'
    )[0].permission;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}createReward?branch_Id=${branchData.branch_Id}&access=${permission}`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // update reward
  updateReward(formData) {
    let branchData = this.getBranchData();
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
    let branchData = this.getBranchData();
    let permission = branchData.access.filter(
      (item) => item.module == 'Rewards'
    )[0].permission;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .get(
        `${environment.apiBaseUrl}${environment.apiPath}showRewards?branch_Id=${branchData.branch_Id}&access=${permission}`,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }
  // status reward
  statusReward(formData) {
    let branchData = this.getBranchData();
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
    let branchData = this.getBranchData();
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
    let branchData = this.getBranchData();
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
    let branchData = this.getBranchData();
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
    let branchData = this.getBranchData();
    let permission = branchData.access.filter(
      (item) => item.module == 'Rewards'
    )[0].permission;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}graphDetailReward?branch_Id=${branchData.branch_Id}&access=${permission}`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }
  // graph reward
  graphTopRedeemReward(formData) {
    let branchData = this.getBranchData();
    let permission = branchData.access.filter(
      (item) => item.module == 'Rewards'
    )[0].permission;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}topRedeemReward?branch_Id=${branchData.branch_Id}&access=${permission}`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  // graph reward
  graphRedeemReward(formData) {
    let branchData = this.getBranchData();
    let permission = branchData.access.filter(
      (item) => item.module == 'Rewards'
    )[0].permission;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}redeemGraphReward?branch_Id=${branchData.branch_Id}&access=${permission}`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }
  //notification list
  getNotification() {
    let branchData = this.getBranchData();
    let permission = branchData.access.filter(
      (item) => item.module == 'Announcement'
    )[0].permission;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .get(
        `${environment.apiBaseUrl}${environment.apiPath}notificationList?branch_Id=${branchData.branch_Id}&access=${permission}`,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }
  //edit privacy policy
  setNotification(formData) {
    let branchData = this.getBranchData();
    let permission = branchData.access.filter(
      (item) => item.module == 'Announcement'
    )[0].permission;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}notificationSendFilter?branch_Id=${branchData.branch_Id}&access=${permission}`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //company branch list
  getBranch() {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .get(`${environment.apiBaseUrl}${environment.apiPath}branchList`, {
        headers,
      })
      .pipe(map((res) => <any>res));
  }

  //create company branch
  createBranch(formData) {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}createBranch`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //update state company branch
  updateBranchStatus(formData) {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}branchStatus`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //delete company branch
  deleteBranchStatus(formData) {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}branchDelete`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //update branch
  updateBranch(formData) {
    let branchData = this.getBranchData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}branchDetailUpdate`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  //employee report
  employeeReport(formData) {
    let branchData = this.getBranchData();
    let permission = branchData.access.filter(
      (item) => item.module == 'Employees'
    )[0].permission;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}employeeByCount?branch_Id=${branchData.branch_Id}&access=${permission}`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  attendanceReport(formData) {
    let branchData = this.getBranchData();
    let permission = branchData.access.filter(
      (item) => item.module == 'Employees'
    )[0].permission;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}employeeReportByAttendance?branch_Id=${branchData.branch_Id}&access=${permission}`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  documentReport(formData) {
    let branchData = this.getBranchData();
    let permission = branchData.access.filter(
      (item) => item.module == 'Employees'
    )[0].permission;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}employeeReportByDocument?branch_Id=${branchData.branch_Id}&access=${permission}`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  challegeReport(formData) {
    let branchData = this.getBranchData();
    let permission = branchData.access.filter(
      (item) => item.module == 'Employees'
    )[0].permission;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}employeeReportByChallenge?branch_Id=${branchData.branch_Id}&access=${permission}`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  salaryDashboard(formData) {
    let branchData = this.getBranchData();
    let permission = branchData.access.filter(
      (item) => item.module == 'Employees'
    )[0].permission;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}salaryDashboard?branch_Id=${branchData.branch_Id}&access=${permission}`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  salaryReport(formData) {
    let branchData = this.getBranchData();
    let permission = branchData.access.filter(
      (item) => item.module == 'Employees'
    )[0].permission;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}employeeReportBySalary?branch_Id=${branchData.branch_Id}&access=${permission}`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  surveyReport(formData) {
    let branchData = this.getBranchData();
    let permission = branchData.access.filter(
      (item) => item.module == 'Employees'
    )[0].permission;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}employeeReportBySurvey?branch_Id=${branchData.branch_Id}&access=${permission}`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  leaveReport(formData) {
    let branchData = this.getBranchData();
    let permission = branchData.access.filter(
      (item) => item.module == 'Employees'
    )[0].permission;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}employeeReportByLeave?branch_Id=${branchData.branch_Id}&access=${permission}`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  leaveReportCalender(formData) {
    let branchData = this.getBranchData();
    let permission = branchData.access.filter(
      (item) => item.module == 'Employees'
    )[0].permission;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}employeeReportByLeaveCalendar?branch_Id=${branchData.branch_Id}&access=${permission}`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  leaveReportDetail(formData) {
    let branchData = this.getBranchData();
    let permission = branchData.access.filter(
      (item) => item.module == 'Employees'
    )[0].permission;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}employeeReportByLeaveDetail?branch_Id=${branchData.branch_Id}&access=${permission}`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  employeeGraphDetail(formData) {
    let branchData = this.getBranchData();
    let permission = branchData.access.filter(
      (item) => item.module == 'Employees'
    )[0].permission;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}employeeGraphDetail?branch_Id=${branchData.branch_Id}&access=${permission}`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  badgesReportDetail(formData) {
    let branchData = this.getBranchData();
    let permission = branchData.access.filter(
      (item) => item.module == 'Employees'
    )[0].permission;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
    return this.http
      .post(
        `${environment.apiBaseUrl}${environment.apiPath}employeeReportByBadges?branch_Id=${branchData.branch_Id}&access=${permission}`,
        formData,
        { headers }
      )
      .pipe(map((res) => <any>res));
  }

  getBranchData() {
    let parseJson = JSON.parse(localStorage.getItem('userData'));
    console.log(parseJson)

    let branch = localStorage.getItem('userData')
      ? JSON.parse(localStorage.getItem('userData')).companyBranch[0]
      : null;
    let access = branch ? JSON.parse(branch.access) : [];

    let branch_Id = branch ? branch.branch_id : 0;
    return { branch_Id: branch_Id, access: access };
  }
}
