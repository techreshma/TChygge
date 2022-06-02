import { Component, Input, OnInit } from '@angular/core';
import { yearsPerPage } from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AccessServiceService } from 'src/app/service/access-service.service';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import { environment } from '../../../../environments/environment';

import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { defaultFormat as _rollupMoment } from 'moment';

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
  selector: 'app-challange-view',
  templateUrl: './challange-view.component.html',
  styleUrls: ['./challange-view.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class ChallangeViewComponent implements OnInit {

  ageColumn: any = [{ text: 'All', value: 'all' }];
  ageColumnDummy: any = [{ text: 'All', value: 'all' }];
  searchAge: any;
  companyShow: boolean;
  openform1 = false;
  minDate = new Date();
  parentArray: any = [];
  files: File[] = [];
  imgUpload: any;
  filter: any = [];
  filePath = environment.apiBaseUrl;
  gen: any;
  dap: any;
  activeLink = 0;
  breadcrumb = 'Profile';
  checkleave;
  bydefault;
  togglValue;
  togglecheck;
  departmentToggle: any;
  responseData: any;
  formData =
    {
      "challengeName": "",
      "description": "",
      "challengeImage": "download.png",
      "challengeConfiguration": [],
      "RewardPoints": "",
      "age": 0,
      "ageTo": 0,
      "ageFrom": 0,
      "Gender": 0,
      "genderType": "",
      "createdBy": "",
      "expiryDate": "",
      "ip_Address": "20.202.230.120",
      "company_Id": 0,
      "challengePredefined_Id": null
    }

  extrafield = { label: '', condition: '', "filterchild": [] }
  passNotMatched: boolean = false;
  designationList: any = [];
  planData: any = [{ id: 'JitterBug' }, { id: 'Swing' }, { id: 'Jive' }];
  imgShow: any = '';
  contract: any = '';
  accessPermission: any = '';
  workingDay: any;
  uname: string = "";
  companyData: any = [];
  userData: any;
  routeState: any;
  routeData: any
  constructor(public router: Router, public _access: AccessServiceService, public _api: CommonServiceService, public ngxService: NgxUiLoaderService, public _snackBar: MatSnackBar) {
    this.userData = JSON.parse(localStorage.getItem('userData'))
    this.formData.createdBy = this.userData.user_id;
    this.accessPermission = this._access.getRouteAccess('User roles', JSON.parse(localStorage.getItem('userData')).moduleAccess);

    if (this.router.getCurrentNavigation().extras.state) {
      this.routeState = this.router.getCurrentNavigation().extras.state;
      console.log(this.routeState)
      if (this.routeState) {
        this.routeData = this.routeState.data ? JSON.parse(this.routeState.data) : null;
        if (!this.routeData) {
          this.router.navigate(['/challange-list'])
        }
        console.log(this.routeData)
        this.formData.challengePredefined_Id = this.routeData.challengePredefined_id;
        this.formData.challengeName = this.routeData.challenege_Name;
        this.formData.challengeImage = this.routeData.challenge_image;
        if (this.routeData.challengePredefined_id == 1) {
          this.formData.challengeConfiguration.push({
            key: 'Condition',
            value: ''
          },
            {
              key: '# of steps per day',
              value: ''
            },
            {
              key: 'No of days',
              value: ''
            })
        } else if (this.routeData.challengePredefined_id == 2) {
          this.formData.challengeConfiguration.push({
            key: 'Condition',
            value: ''
          },
            {
              key: '# of KM per days',
              value: ''
            },
            {
              key: 'No of days',
              value: ''
            })
        } else if (this.routeData.challengePredefined_id == 3) {
          this.formData.challengeConfiguration.push({
            key: 'Condition',
            value: ''
          }, {
            key: '# of time late at work',
            value: ''
          })
        } else if (this.routeData.challengePredefined_id == 4) {
          this.formData.challengeConfiguration.push({
            key: 'Condition',
            value: ''
          },
            {
              key: '# of Medical Leaves taken',
              value: ''
            })
        } else if (this.routeData.challengePredefined_id == 5) {
          this.formData.challengeConfiguration.push({
            key: 'Documents Completed',
            value: 'Yes'
          })
        } else if (this.routeData.challengePredefined_id == 6) {
          this.formData.challengeConfiguration.push({
            key: 'Profile Completed',
            value: 'Yes'
          })
        } else if (this.routeData.challengePredefined_id == 7) {
          this.formData.challengeConfiguration.push({
            key: 'Condition',
            value: ''
          },
            {
              key: '# of Surveys taken',
              value: ''
            })
        } else if (this.routeData.challengePredefined_id == 8) {
          this.formData.challengeConfiguration.push({
            key: 'No of days food log updated/ entered',
            value: ''
          })
        } else if (this.routeData.challengePredefined_id == 9) {
          this.formData.challengeConfiguration.push({
            key: 'No of days stress level measured',
            value: ''
          })
        } else if (this.routeData.challengePredefined_id == 10) {
          this.formData.challengeConfiguration.push({
            key: 'No of days Blood Pressure measured',
            value: ''
          })
        } else if (this.routeData.challengePredefined_id == 11) {
          this.formData.challengeConfiguration.push({
            key: 'Condition',
            value: ''
          },
            {
              key: 'Hours per Day',
              value: ''
            },
            {
              key: 'No of days',
              value: ''
            })
        } else if (this.routeData.challengePredefined_id == 12) {
          this.formData.challengeConfiguration.push({
            key: 'Condition',
            value: ''
          }, {
            key: '# of goals Achieved',
            value: ''
          })
        } else if (this.routeData.challengePredefined_id == 13) {
          this.formData.challengeConfiguration.push({
            key: 'Condition',
            value: ''
          }, {
            key: '# of feedback given',
            value: ''
          })
        } else if (this.routeData.challengePredefined_id == 14) {
          this.formData.challengeConfiguration.push({
            key: 'Condition',
            value: ''
          },
            {
              key: 'For # of Days',
              value: ''
            })
        } else if (this.routeData.challengePredefined_id == 15) {
          this.formData.challengeConfiguration.push({
            key: 'Condition',
            value: ''
          },
            {
              key: 'Minutes per day',
              value: ''
            },
            {
              key: 'For # of Days',
              value: ''
            })
        }
      } else {
        this.router.navigate(['/challange-list'])
      }
    } else {
      this.router.navigate(['challange-list'])
    }
  }

  
  ngOnInit(): void {
    this.getCompany();
    for (let i = 18; 100 > i; i++) {
      this.ageColumn.push({ text: i.toString(), value: i.toString() })
      this.ageColumnDummy.push({ text: i.toString(), value: i.toString() })
    }
    console.log(this.ageColumn)
  }

  onRemove(event) {
    console.log(event)
    this.files.splice(this.files.indexOf(event), 1);
  }

  async onSelect(event) {
    this.files = [...event.addedFiles];
    if (event.addedFiles.length > 0) {

      await (this._api.uploadThemeDoc(event.addedFiles[0], 'logo').subscribe(res => {
        this.ngxService.stop();
        const response: any = res;
        if (response.success == true) {
          console.log(response.data)
          this.formData.challengeImage = response.data;

        } else {
          this.openSnackBar(response.message);
        }
        console.log(res);
      }, err => {
        const error = err.error;
        this.openErrrorSnackBar(error.message);
        this.ngxService.stop();
      }));
    } else {
      this.openErrrorSnackBar('Please select jpg, png, gif, jpeg input file type');
    }
  }


  searchAgeFilter(value) {
    if (!value) {
      this.ageColumn = this.ageColumnDummy;
    } // when nothing has typed
    this.ageColumn = Object.assign([], this.ageColumnDummy).filter(
      item => item.text.toLowerCase().indexOf(value.toLowerCase()) > -1
    )
  }

  // Get Company List
  async getCompany() {
    this.ngxService.start();
    await (this._api.getCompany().subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        this.companyData = response.data;
        console.log(response.data)
      } else {
      }
      console.log(res);
    }, err => {
      const error = err.error;
      this.ngxService.stop();
    }));

  }

  //update working day

  async companyWorkingDaySet() {
    let d = false;
    for (let item of this.workingDay) {
      if (!item.OnOff) {
        if (item.inTime === '' || item.outTime === '') {
          d = true;
        }
      }
    }
  }

  // employee working hour on off setup
  setOnOff(e, id) {
    this.workingDay[id].OnOff = (e == 'true' ? true : false)
  }

  tabClick(e) {
    this.breadcrumb = e.tab.textLabel
  }

  async save() {
    this.formData.expiryDate = _moment(this.formData.expiryDate).format('YYYY-MM-DD')
    this.ngxService.start();
    await (this._api.getaddchallanges(this.formData).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        this.openSnackBar(response.message);
        this.router.navigate(['/challange-list'])
      } else {
        this.openErrrorSnackBar(response.message);
      }
      console.log(res);
    }, err => {
      const error = err.error;
      this.ngxService.stop();
      this.openErrrorSnackBar(error.message);
    }));
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

  // myfunctoin sameer
  openform() {
    this.openform1 = true;
  }

  next() {
    this.filter.push(this.extrafield)
  }


  setCompany(e) {
    if (e.checked) {

    } else {
      this.formData.company_Id = 0
    }
  }

  setAge(e) {
    if (e.checked) {
      this.formData.age = 1
    } else {
      this.formData.age = 0
    }
  }

  setGender(e) {
    if (e.checked) {
      this.formData.Gender = 1
    } else {
      this.formData.Gender = 0
    }
  }


}








