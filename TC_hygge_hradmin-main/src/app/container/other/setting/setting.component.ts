import { Component, OnInit } from '@angular/core';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import {
  MatSnackBar
} from '@angular/material/snack-bar';
import { AccessServiceService } from 'src/app/service/access-service.service';
import { ConfirmBoxComponent, ConfirmDialogModel } from 'src/app/confirm-box/confirm-box.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
import * as _moment from 'moment';
import { environment } from '../../../../environments/environment';
// tslint:disable-next-line:no-duplicate-imports
import {defaultFormat as _rollupMoment} from 'moment';
import { SharedService } from 'src/app/service/shared.service';

const moment = _rollupMoment || _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
};
@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
  providers: [
  {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class SettingComponent implements OnInit {
  fieldconPass:boolean;
  fieldNewPass:boolean;
  fieldOldPass:boolean;
  oldNewSame:boolean;
  imgPath = environment.apiBaseUrl
  files: File[] = [];
  files2: File[] = [];
  themeDataSet:any;
  holidayData:any = [];
  togglValue:boolean;
  checkleave:boolean;
  isCheck:boolean;
  isCheck1:boolean;
  isCheck2:boolean;
  holidaySet = {
    "event_Type":"1",
    "event_StartDate":"",
    "event_EndDate":"",
    "target_Audeince":"1",
    "event_Description":"",
    "fileName":"gergerge",
    "event_Title":"",
    "isAllday":"1",
    "ip_Address":"123"
  }
  salaryData:any = [];
  salarySet = {
    "salaryType":"",
    "ip_Address":"12.43.33.33",
    "companyId":""
  }
  departmentData:any = [];
  departmentSet = {
    "departmentType":"",
    "ip_Address":"123.444.333.33",
    "companyId":""
  }
  smtpDataSet:any;
  smtpData = {}
  themeData = {
    "comapnyId":"",
    "company_Logo":"",
    "company_favicon":"",
    "ip_Address":"123.43.233.433",
    "company_Website":"www.test.com",
    "created_By":"",
    "updated_By":""
  }
  passwordData = {
    "oldpassword": "",
    "newpassword":"",
    "confirmpassword":""
  }
  leaveDataSet = {
    "leaveType":"",
    "ip_Address":"12.43.33.33",
    "companyId":""
  }
  leaveData:any = [];

  docTypeData:any = [];
  docTypeSet = {
    "documentType":"",
    "docImage":"",
    "dependent":0,
    "expires":0,
    "isCheck":0,
    "ip_Address":"12.32.33.22",
    "companyId":""
  }
  passNotMatched: boolean = false;
  currentDate = new Date();
  accessPermission:boolean;
  getDocumentTypeData:any = []
  constructor( public sharedService:SharedService,public router:Router, public dialog: MatDialog, public _access:AccessServiceService,public _api: CommonServiceService, public ngxService: NgxUiLoaderService, public _snackBar: MatSnackBar) { }

  ngOnInit(): void {

    //getting access permission
    this.accessPermission = this._access.getRouteAccess('User roles',JSON.parse(localStorage.getItem('userData')).moduleAccess);
    this.departmentSet.companyId = JSON.parse(localStorage.getItem('userData')).company_id;
    this.leaveDataSet.companyId = JSON.parse(localStorage.getItem('userData')).company_id;
    this.salarySet.companyId = JSON.parse(localStorage.getItem('userData')).company_id;
    this.docTypeSet.companyId = JSON.parse(localStorage.getItem('userData')).company_id;
    this.themeData.comapnyId = JSON.parse(localStorage.getItem('userData')).company_id;
    this.getTheme();
    this.getsmtp();
    this.getDepartment();
    this.getLeave();
    this.getSalary();
    this.getHoliday();
    this.getDocType();
    this.getDocumentType();
    this.getsandwichleave();
  }

  // Security setting (Update password)
  async updatePassword(){
    if(this.passwordData.newpassword !== this.passwordData.confirmpassword){
      this.passNotMatched = true;
    }else{
      this.ngxService.start();
      this.passNotMatched = false;
      await(this._api.resetPassword(this.passwordData).subscribe(res => {
        this.ngxService.stop();
        const response: any = res;
        if (response.success == true){
          this.openSnackBar(response.message);
          localStorage.removeItem('userData');
          localStorage.removeItem('token')
          this.router.navigate(['/login']);
        }else{
          this.openErrrorSnackBar(response.message);
        }
        console.log(res);
      },err => {
        const error = err.error;
        this.ngxService.stop();
        this.openErrrorSnackBar(error.message);
      }));
    }

  }

  // Get Theme
  async getTheme(){
    this.ngxService.start();
    await(this._api.getTheme().subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true){
        this.themeDataSet = response.data;
        this.themeData = {
          "comapnyId":JSON.parse(localStorage.getItem('userData')).company_id,
          "company_Logo":this.themeDataSet.company_Logo,
          "company_favicon": this.themeDataSet.company_favicon,
          "company_Website":this.themeDataSet.company_Website,
          "created_By":'1',
          "updated_By":'1',
          "ip_Address":"12.32.32.22",
        }

      }else{
        this.openErrrorSnackBar(response.message);
      }
      console.log(res);
    },err => {
      const error = err.error;
      this.ngxService.stop();
      this.openErrrorSnackBar(error.message);
    }));

}


// Get Department
async getDepartment(){
  this.ngxService.start();
  await(this._api.showDepartment().subscribe(res => {
    this.ngxService.stop();
    const response: any = res;
    if (response.success == true){
      this.departmentData = response.data;
    }else{
      this.openErrrorSnackBar(response.message);
    }
    console.log(res);
  },err => {
    const error = err.error;
    this.ngxService.stop();
    this.openErrrorSnackBar(error.message);
  }));
}

//add department
async addDepartement(){
  this.ngxService.start();
  await(this._api.addDepartment(this.departmentSet).subscribe(res => {
    this.ngxService.stop();
    const response: any = res;
    if (response.success == true){
      this.openSnackBar(response.message);
      this.getDepartment();
      this.departmentSet = {
        "departmentType":"",
        "ip_Address":"123.444.333.33",
        "companyId":JSON.parse(localStorage.getItem('userData')).company_id
      }
    }else{
      this.openErrrorSnackBar(response.message);
    }
    console.log(res);
  },err => {
    const error = err.error;
    this.ngxService.stop();
    this.openErrrorSnackBar(error.message);
  }));
}

// delete departemnt
async deleteDepartment(id){
  let data ={
    "departmentId":id,
    "companyId":JSON.parse(localStorage.getItem('userData')).company_id ,
    "ip_Address":"123.22.22.22"
  }
  this.ngxService.start();
  await(this._api.deleteDepartment(data).subscribe(res => {
    this.ngxService.stop();
    const response: any = res;
    if (response.success == true){
      this.openSnackBar(response.message);
      this.getDepartment();
    }else{
      this.openErrrorSnackBar(response.message);
    }
    console.log(res);
  },err => {
    const error = err.error;
    this.ngxService.stop();
    this.openErrrorSnackBar(error.message);
  }));
}

// Get Leave
async getLeave(){
  this.ngxService.start();
  await(this._api.showLeave().subscribe(res => {
    this.ngxService.stop();
    const response: any = res;
    if (response.success == true){
      this.leaveData = response.data;
    }else{
      this.openErrrorSnackBar(response.message);
    }
    console.log(res);
  },err => {
    const error = err.error;
    this.ngxService.stop();
    this.openErrrorSnackBar(error.message);
  }));
}

//add leave
async addLeave(){
  this.ngxService.start();
  await(this._api.addLeave(this.leaveDataSet).subscribe(res => {
    this.ngxService.stop();
    const response: any = res;
    if (response.success == true){
      this.openSnackBar(response.message);
      this.getLeave();
      this.leaveDataSet = {
        "leaveType":"",
        "ip_Address":"12.43.33.33",
        "companyId":JSON.parse(localStorage.getItem('userData')).company_id
      }
    }else{
      this.openErrrorSnackBar(response.message);
    }
    console.log(res);
  },err => {
    const error = err.error;
    this.ngxService.stop();
    this.openErrrorSnackBar(error.message);
  }));
}

// delete leave
async deleteLeave(id){
  let data ={
    "leaveTypeId":id,
    "companyId":JSON.parse(localStorage.getItem('userData')).company_id ,
    "ip_Address":"123.22.22.22"
  }
  this.ngxService.start();
  await(this._api.deleteLeave(data).subscribe(res => {
    this.ngxService.stop();
    const response: any = res;
    if (response.success == true){
      this.openSnackBar(response.message);
      this.getLeave();
    }else{
      this.openErrrorSnackBar(response.message);
    }
    console.log(res);
  },err => {
    const error = err.error;
    this.ngxService.stop();
    this.openErrrorSnackBar(error.message);
  }));
}


// Get Salary breakdown
async getSalary(){
  this.ngxService.start();
  await(this._api.showSalary().subscribe(res => {
    this.ngxService.stop();
    const response: any = res;
    if (response.success == true){
      this.salaryData = response.data;
    }else{
      this.openErrrorSnackBar(response.message);
    }
    console.log(res);
  },err => {
    const error = err.error;
    this.ngxService.stop();
    this.openErrrorSnackBar(error.message);
  }));
}

//add Salary type
async addSalary(){
  this.ngxService.start();
  await(this._api.addSalary(this.salarySet).subscribe(res => {
    this.ngxService.stop();
    const response: any = res;
    if (response.success == true){
      this.openSnackBar(response.message);
      this.salarySet = {
        "salaryType":"",
        "ip_Address":"12.43.33.33",
        "companyId":JSON.parse(localStorage.getItem('userData')).company_id
      }
      this.getSalary();
    }else{
      this.openErrrorSnackBar(response.message);
    }
    console.log(res);
  },err => {
    const error = err.error;
    this.ngxService.stop();
    this.openErrrorSnackBar(error.message);
  }));
}

// delete leave
async deleteSalary(id){
  let data ={
    "salaryTypeId":id,
    "companyId":JSON.parse(localStorage.getItem('userData')).company_id ,
    "ip_Address":"123.22.22.22"
  }
  this.ngxService.start();
  await(this._api.deleteSalary(data).subscribe(res => {
    this.ngxService.stop();
    const response: any = res;
    if (response.success == true){
      this.openSnackBar(response.message);
      this.getSalary();
    }else{
      this.openErrrorSnackBar(response.message);
    }
    console.log(res);
  },err => {
    const error = err.error;
    this.ngxService.stop();
    this.openErrrorSnackBar(error.message);
  }));
}

// Get Holiday
async getHoliday(){
  this.ngxService.start();
  await(this._api.showHoliday().subscribe(res => {
    this.ngxService.stop();
    const response: any = res;
    if (response.success == true){
      this.holidayData = response.data;
    }else{
      this.openErrrorSnackBar(response.message);
    }
    console.log(res);
  },err => {
    const error = err.error;
    this.ngxService.stop();
    this.openErrrorSnackBar(error.message);
  }));
}

//add Holiday
async addHoliday(){
  this.ngxService.start();
  await(this._api.addHoliday(this.holidaySet).subscribe(res => {
    this.ngxService.stop();
    const response: any = res;
    if (response.success == true){
      this.openSnackBar(response.message);
      this.holidaySet = {
        "event_Type":"1",
        "event_StartDate":"",
        "event_EndDate":"",
        "target_Audeince":"1",
        "event_Description":"",
        "fileName":"gergerge",
        "event_Title":"",
        "isAllday":"1",
        "ip_Address":"123"
      }
      this.getHoliday();
    }else{
      this.openErrrorSnackBar(response.message);
    }
    console.log(res);
  },err => {
    const error = err.error;
    this.ngxService.stop();
    this.openErrrorSnackBar(error.message);
  }));
}

// delete Holiday
async deleteHoliday(id){
  let data ={
    "calendarEvent_id":id,
    "ip_Address":"123.22.22.22"
  }
  this.ngxService.start();
  await(this._api.deleteHoliday(data).subscribe(res => {
    this.ngxService.stop();
    const response: any = res;
    if (response.success == true){
      this.openSnackBar(response.message);
      this.getHoliday();
    }else{
      this.openErrrorSnackBar(response.message);
    }
    console.log(res);
  },err => {
    const error = err.error;
    this.ngxService.stop();
    this.openErrrorSnackBar(error.message);
  }));
}

// Get document type
async getDocType(){
  this.ngxService.start();
  await(this._api.showDocType().subscribe(res => {
    this.ngxService.stop();
    const response: any = res;
    if (response.success == true){
      this.docTypeData = response.data;
    }else{
      this.openErrrorSnackBar(response.message);
    }
    console.log(res);
  },err => {
    const error = err.error;
    this.ngxService.stop();
    this.openErrrorSnackBar(error.message);
  }));
}

// Get document type
async updateDocType(e, d,n){
  console.log(e,d)


  let formData = {
    "documentTypeId":d.documentType_id,
    "ip_Address":"1234556",
    "companyId":d.company_Id,
    "documentType":d.document_Type,
    "isCheck":n == 1?(e.checked?1:0):d.isCheck,
    "dependent":n == 2?(e.checked?1:0):d.dependent ,
    "expires":d.expires,
    "docImage":d.doc_Image
  }
  this.ngxService.start();
  await(this._api.updateDocumentType(formData).subscribe(res => {
    this.ngxService.stop();
    const response: any = res;
    if (response.success == true){

      this.openSnackBar(response.message);
      this.getDocType();
    }else{
      this.openErrrorSnackBar(response.message);
    }
    console.log(res);
  },err => {
    const error = err.error;
    this.ngxService.stop();
    this.openErrrorSnackBar(error.message);
  }));
}

//add Document type
async addDocType(){
  this.ngxService.start();
  await(this._api.addDocType(this.docTypeSet).subscribe(res => {
    this.ngxService.stop();
    const response: any = res;
    if (response.success == true){
      this.openSnackBar(response.message);
      this.docTypeSet = {
        "documentType":"",
        "docImage":"",
        "dependent":0,
        "expires":0,
        "isCheck":0,
        "ip_Address":"121212",
        "companyId":JSON.parse(localStorage.getItem('userData')).company_id
      }
      this.isCheck = false;
      this.isCheck1 = false;
      this.isCheck2 = false;
      this.getDocType();
    }else{
      this.openErrrorSnackBar(response.message);
    }
    console.log(res);
  },err => {
    const error = err.error;
    this.ngxService.stop();
    this.openErrrorSnackBar(error.message);
  }));
}

// delete Document
async deleteDocType(id){
  let data ={
    "leaveTypeId":id,
    "ip_Address":"123.22.22.22",
    "companyId":JSON.parse(localStorage.getItem('userData')).company_id ,
  }
  this.ngxService.start();
  await(this._api.deleteDocType(data).subscribe(res => {
    this.ngxService.stop();
    const response: any = res;
    if (response.success == true){
      this.openSnackBar(response.message);
      this.getDocType();
    }else{
      this.openErrrorSnackBar(response.message);
    }
    console.log(res);
  },err => {
    const error = err.error;
    this.ngxService.stop();
    this.openErrrorSnackBar(error.message);
  }));
}


// Update Theme
async updateTheme(){
  this.ngxService.start();
  await(this._api.updateTheme(this.themeData).subscribe(res => {
    this.ngxService.stop();
    const response: any = res;
    if (response.success == true){
      this.themeData = response.data[0];
      this.openSnackBar(response.message);
      this.getTheme()

      localStorage.setItem('userData',JSON.stringify(response.data[0]))
      this.sharedService.changeUser(JSON.stringify(response.data[0]));
    }else{
      this.openErrrorSnackBar(response.message);
    }
    console.log(res);
  },err => {
    const error = err.error;
    this.ngxService.stop();
    this.openErrrorSnackBar(error.message);
  }));

}

 // Get smtp
 async getsmtp(){
  this.ngxService.start();
  await(this._api.getSmtp().subscribe(res => {
    this.ngxService.stop();
    const response: any = res;
    if (response.success == true){
      this.smtpDataSet = response.data;
    }else{
      this.openErrrorSnackBar(response.message);
    }
    console.log(res);
  },err => {
    const error = err.error;
    this.ngxService.stop();
    this.openErrrorSnackBar(error.message);
  }));

}

// update smptp

async updateSmtp(){
  let data = {
    "smtpId":this.smtpDataSet.smtp_id,
    "mail_Server":this.smtpDataSet.mail_Server,
    "smtp_Port":this.smtpDataSet.smtp_Port,
    "userName":this.smtpDataSet.userName,
    "password":this.smtpDataSet.password,
    "server_Security":this.smtpDataSet.server_Security,
    "default_Sender":this.smtpDataSet.default_Sender,
    "default_SenderName":this.smtpDataSet.default_SenderName,
    "ip_Address":"12.32.32.22",
    "companyId":JSON.parse(localStorage.getItem('userData')).company_id
  }
  this.ngxService.start();
  await(this._api.smptypDetailUpdate(data).subscribe(res => {
    this.ngxService.stop();
    const response: any = res;
    if (response.success == true){
      this.openSnackBar(response.message);
      this.getsmtp();
    }else{
      this.openErrrorSnackBar(response.message);
    }
    console.log(res);
  },err => {
    const error = err.error;
    this.ngxService.stop();
    this.openErrrorSnackBar(error.message);
  }));
}

  // upload logo image
  async onSelect(event) {
    console.log(event);
    this.files = [...event.addedFiles];
    if(event.addedFiles.length > 0){

      await(this._api.uploadThemeDoc(event.addedFiles[0],'logo').subscribe(res => {
        this.ngxService.stop();
        const response: any = res;
        if (response.success == true){
          this.themeData.company_Logo = response.data;

        }else{
          this.openSnackBar(response.message);
        }
        console.log(res);
      },err => {
        const error = err.error;
        this.openErrrorSnackBar(error.message);
        this.ngxService.stop();
      }));
    }else{
      this.openErrrorSnackBar('Please select jpg, png, gif, jpeg input file type');
    }
  }

  onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  // upload favicon image
  async onFaviSelect(event) {
    console.log(event);
    this.files2 = [...event.addedFiles];
    if(event.addedFiles.length > 0){

      await(this._api.uploadThemeDoc(event.addedFiles[0],'favicon').subscribe(res => {
        this.ngxService.stop();
        const response: any = res;
        if (response.success == true){
          this.themeData.company_favicon = response.data[0];

        }else{
          this.openSnackBar(response.message);
        }
        console.log(res);
      },err => {
        const error = err.error;
        this.openErrrorSnackBar(error.message);
        this.ngxService.stop();
      }));
    }else{
      this.openErrrorSnackBar('Please select jpg, png, gif, jpeg input file type');
    }
  }

  onFaviRemove(event) {
    console.log(event);
    this.files2.splice(this.files.indexOf(event), 1);
  }

  // testing email

  // Get Theme
  async testEmail(){
    let  data = {
      user_id:JSON.parse(localStorage.getItem('userData')).user_id,
      company_id:JSON.parse(localStorage.getItem('userData')).company_id,
      email:JSON.parse(localStorage.getItem('userData')).email,
    }
    this.ngxService.start();
    await(this._api.testEmail(data).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true){
        this.openSnackBar(response.message)
      }else{
        this.openErrrorSnackBar(response.message);
      }
      console.log(res);
    },err => {
      const error = err.error;
      this.ngxService.stop();
      this.openErrrorSnackBar(error.message);
    }));

}


// Get Document Type
async getDocumentType(){
  this.ngxService.start();
  await(this._api.documentTypeList().subscribe(res => {
    this.ngxService.stop();
    const response: any = res;
    if (response.success == true){
      this.getDocumentTypeData = response.data;
    }else{
      this.openErrrorSnackBar(response.message);
    }
    console.log(res);
  },err => {
    const error = err.error;
    this.ngxService.stop();
    this.openErrrorSnackBar(error.message);
  }));

}


// sandwithch leave


async oncheckleave(event){
  console.log(event)
  this.checkleave = event.checked;
  let formData = {
    "companyId":JSON.parse(localStorage.getItem('userData')).company_id,
    "isSandwich":event.checked?1:0
  }
  this.ngxService.start();
  await(this._api.sandwichLeave(formData).subscribe(res => {
    this.ngxService.stop();
    const response: any = res;
    if (response.success == true){
      this.openSnackBar(response.message);
    }else{
      this.openErrrorSnackBar(response.message);
    }
    console.log(res);
  },err => {
    const error = err.error;
    this.ngxService.stop();
    this.openErrrorSnackBar(error.message);
  }));

}
async getsandwichleave(){
  let formData = {
    "companyId":JSON.parse(localStorage.getItem('userData')).company_id,
  }
  this.ngxService.start();
  await(this._api.getsandwichleave(formData).subscribe(res => {
    this.ngxService.stop();
    const response: any = res;
    if(response.data[0].is_sandwich == 0){
      this.togglValue = false
    }else{
      this.togglValue = true
    }

    console.log(res.data[0].is_sandwich);

  }
  ));

}

//doucment type data set
setDocImage(event){
  for(let item of this.getDocumentTypeData){
    if(item.DocType == event){
      this.docTypeSet.docImage = item.imagePath
    }else{
      this.docTypeSet.docImage = '';
    }
  }
}

 // alert message after api response success
openSnackBar(msg) {
  this._snackBar.open(msg, 'Ok', {
    duration: 3000,
    horizontalPosition: 'right',
    verticalPosition: 'top',
    panelClass: ['success-alert']
  });
}
// alert message after api response failure
openErrrorSnackBar(msg) {
  this._snackBar.open(msg, 'Ok', {
    duration: 3000,
    horizontalPosition: 'right',
    verticalPosition: 'top',
    panelClass: ['failure-alert']
  });
}

// confirm message for delete department
confirmDialog(id): void {
  const message = `Are you sure you want to delete this?`;

  const dialogData = new ConfirmDialogModel('Confirm Action', message);

  const dialogRef = this.dialog.open(ConfirmBoxComponent, {
    maxWidth: '400px',
    data: dialogData
  });

  dialogRef.afterClosed().subscribe(dialogResult => {
    if(dialogResult){
      this.deleteDepartment(id);
    }
  });
}
// confirm message for delete leave
confirmDialogLeave(id): void {
  const message = `Are you sure you want to delete this?`;

  const dialogData = new ConfirmDialogModel('Confirm Action', message);

  const dialogRef = this.dialog.open(ConfirmBoxComponent, {
    maxWidth: '400px',
    data: dialogData
  });

  dialogRef.afterClosed().subscribe(dialogResult => {
    if(dialogResult){
      this.deleteLeave(id);
    }
  });
}
// confirm message for delete salary type
confirmDialogSalary(id): void {
  const message = `Are you sure you want to delete this?`;

  const dialogData = new ConfirmDialogModel('Confirm Action', message);

  const dialogRef = this.dialog.open(ConfirmBoxComponent, {
    maxWidth: '400px',
    data: dialogData
  });

  dialogRef.afterClosed().subscribe(dialogResult => {
    if(dialogResult){
      this.deleteSalary(id);
    }
  });
}

// confirm message for delete holiday
confirmDialogHoliday(id): void {
  const message = `Are you sure you want to delete this?`;

  const dialogData = new ConfirmDialogModel('Confirm Action', message);

  const dialogRef = this.dialog.open(ConfirmBoxComponent, {
    maxWidth: '400px',
    data: dialogData
  });

  dialogRef.afterClosed().subscribe(dialogResult => {
    if(dialogResult){
      this.deleteHoliday(id);
    }
  });
}


// confirm message for delete holiday
confirmDialogDoc(id): void {
  const message = `Are you sure you want to delete this?`;

  const dialogData = new ConfirmDialogModel('Confirm Action', message);

  const dialogRef = this.dialog.open(ConfirmBoxComponent, {
    maxWidth: '400px',
    data: dialogData
  });

  dialogRef.afterClosed().subscribe(dialogResult => {
    if(dialogResult){
      this.deleteDocType(id);
    }
  });
}

//check Old and New Password
ChkOldNew(e){
  if(this.passwordData.oldpassword == e){
    console.log(e, this.passwordData.oldpassword)
    this.oldNewSame = true;
  }else{
    this.oldNewSame = false;
  }
}

// date formating
formatDate(date){
 return _moment(date).format('DD/MM/YYYY')
}

//Check mandat field
CheckDocmandat(e){
  console.log(e)
  this.isCheck = e.checked;
  this.docTypeSet.isCheck = e.checked?1:0;
}
//Check mandat dependent field
CheckDocmandatdep(e){
  console.log(e)
  this.isCheck1 = e.checked;
  this.docTypeSet['dependent'] = e.checked?1:0;
}
//Check expiry field
CheckExpiry(e){
  console.log(e)
  this.isCheck2 = e.checked;
  this.docTypeSet.expires = e.checked?1:0;
}

}
