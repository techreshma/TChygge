import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import { environment } from 'src/environments/environment';

import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import {defaultFormat as _rollupMoment} from 'moment';
import { Router } from '@angular/router';

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
  selector: 'app-reward-create',
  templateUrl: './reward-create.component.html',
  styleUrls: ['./reward-create.component.scss'],
  providers: [
  {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class RewardCreateComponent implements OnInit {
  departmentData:any = [];
  searchAge:any;
  ageColumn:any = [{text:'All',value:'all'}];
  ageColumnDummy:any = [{text:'All',value:'all'}];
  imgPath = environment.apiBaseUrl
  files: File[] = [];
  minDate = new Date();
  formData = {
    "reward_Name"        : "",
    "reward_Description" : "",
    "reward_Image"       : "",
    "reward_Points"      : null,
    "reward_limit"       : null,
    "start_Date"         : "",
    "end_Date"           : "",
    "company_Id"         : 0,
    "age_Type"           : 0,
    "age_From"           : 0,
    "age_To"             : 0,
    "gender_Type"        :0,
    "gender"             :"",
    "department_Type"    :0,
    "department_Name"    :"",
    "terms_Condition"    :"",
    "ip_Address"         : "12.23.22.33"
  }
  userData:any;
  constructor(public router:Router, public ngxService: NgxUiLoaderService, public _api: CommonServiceService, public _snackBar: MatSnackBar) {
    this.userData = JSON.parse(localStorage.getItem('userData'))
    this.formData.company_Id = JSON.parse(localStorage.getItem('userData')).company_id;
  }

  ngOnInit(): void {
    for(let i = 18;100 > i;i++){
      this.ageColumn.push({text:i.toString(),value:i.toString()})
      this.ageColumnDummy.push({text:i.toString(),value:i.toString()})
    }
    this.getDepartment()
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

// save reward
async save(){
  this.ngxService.start();
  this.formData.start_Date = _moment(this.formData.start_Date).format('YYYY-MM-DD')
  this.formData.end_Date = _moment(this.formData.end_Date).format('YYYY-MM-DD')
  await(this._api.createReward(this.formData).subscribe(res => {
    this.ngxService.stop();
    const response: any = res;
    if (response.success == true){
      this.openSnackBar(response.message);
      this.router.navigate(['/reward-list'])
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

    await(this._api.uploadThemeDoc(event.addedFiles[0],'reward').subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true){
        this.formData.reward_Image = response.data[0];

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


  setDepartment(e){
    if(e.checked){
      this.formData.department_Type = 1
    }else{
      this.formData.department_Type = 0
    }
  }

  setAge(e){
    if(e.checked){
      this.formData.age_Type = 1
    }else{
      this.formData.age_Type = 0
    }
  }

  setGender(e){
    if(e.checked){
      this.formData.gender_Type = 1
    }else{
      this.formData.gender_Type = 0
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
