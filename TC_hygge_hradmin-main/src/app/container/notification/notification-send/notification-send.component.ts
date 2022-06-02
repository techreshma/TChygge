import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonServiceService } from 'src/app/service/comman-service.service';

@Component({
  selector: 'app-notification-send',
  templateUrl: './notification-send.component.html',
  styleUrls: ['./notification-send.component.scss']
})
export class NotificationSendComponent implements OnInit {
  ageColumn:any = [{text:'All',value:'all'}];
  ageColumnDummy:any = []
  faqData:any;
  departmentData:any = [];
  userList:any = [];
  formData = {
    "body":"",
    "title":"",
    "age_Type":0,
    "gender_Type":0,
    "department_Type":0,
    "department":'',
    "user_Type":0,
    "user":[],
    "ageTo":0,
    "ageFrom":0,
    "company_Id":0,
    "gender":"",
    "departmentID":'',
  }
  userData:any
  constructor( public dialogRef: MatDialogRef<NotificationSendComponent>,public _api: CommonServiceService, public ngxService: NgxUiLoaderService, public _snackBar: MatSnackBar) {
    this.userData = JSON.parse(localStorage.getItem('userData'))
    this.formData.company_Id = JSON.parse(localStorage.getItem('userData')).company_id;
   }

  ngOnInit(): void {
    for(let i = 18;100 > i;i++){
      this.ageColumn.push({text:i.toString(),value:i.toString()})
      this.ageColumnDummy.push({text:i.toString(),value:i.toString()})
    }
    this.getDepartment();
    this.getUserList()
  }
// Get Department
async getDepartment(){
  this.ngxService.start();
  await(this._api.showDepartment().subscribe(res => {
    this.ngxService.stop();
    const response: any = res;
    if (response.success == true){
      this.departmentData = response.data;
      console.log(this.departmentData)
    }else{
      // this.openErrrorSnackBar(response.message);
    }
    console.log(res);
  },err => {
    const error = err.error;
    this.ngxService.stop();
    // this.openErrrorSnackBar(error.message);
  }));
}
  async sendNotification(){
    if(this.formData.department != ''){
      this.formData.departmentID = this.departmentData.filter(dp => dp.department_Type == this.formData.department)[0].department_id;
    }
    this.ngxService.start();
    await(this._api.setNotification(this.formData).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true){
        this.openSnackBar(response.message);
        this.dialogRef.close('Close');
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


  // Get Employee List
async getUserList(){
  this.ngxService.start();
  await(this._api.getEmployee().subscribe(res => {
    this.ngxService.stop();
    const response: any = res;
    if (response.success == true){
      console.log(response.data);
      this.userList = response.data
    }else{
    }
    console.log(res);
  }, err => {
    const error = err.error;
    this.ngxService.stop();
  }));

}

setDepartment(e){
  if(e.checked){
    this.formData.department_Type = 1
    this.formData.user_Type = 0
  }else{
    this.formData.department_Type = 0
  }
}
  setAge(e){
    if(e.checked){
      this.formData.age_Type = 1
      this.formData.user_Type = 0
    }else{
      this.formData.age_Type = 0
    }
  }

  setGender(e){
    if(e.checked){
      this.formData.gender_Type = 1
      this.formData.user_Type = 0
    }else{
      this.formData.gender_Type = 0
    }
  }

  setUser(e){
    if(e.checked){
      this.formData.user_Type = 1
      this.formData.department_Type = 0
      this.formData.age_Type = 0
      this.formData.gender_Type = 0
    }else{
      this.formData.user_Type = 0
    }
  }
  searchAgeFilter(value){
    if(!value){
      this.ageColumn = this.ageColumnDummy;
    } // when nothing has typed
    this.ageColumn = Object.assign([], this.ageColumnDummy).filter(
      item => item.text.toLowerCase().indexOf(value.toLowerCase()) > -1
    )
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
}
