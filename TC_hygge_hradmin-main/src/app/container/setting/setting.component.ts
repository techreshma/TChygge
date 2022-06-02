import { Component, OnInit } from '@angular/core';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import {
  MatSnackBar
} from '@angular/material/snack-bar';
import { AccessServiceService } from 'src/app/service/access-service.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Editor } from 'ngx-editor';

import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { defaultFormat as _rollupMoment } from 'moment';
import { environment } from 'src/environments/environment';
import { AddFaqComponent } from './add-faq/add-faq.component';
import { EditFaqComponent } from './edit-faq/edit-faq.component';
import { ConfirmBoxComponent, ConfirmDialogModel } from 'src/app/confirm-box/confirm-box.component';
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

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class SettingComponent implements OnInit {
  editor: Editor;
  fieldconPass: boolean;
  fieldNewPass: boolean;
  fieldOldPass: boolean;
  oldNewSame: boolean;
  imgPath = environment.apiBaseUrl
  files: File[] = [];
  files2: File[] = [];
  themeDataSet: any;

  themeData = {
    "superAdmin_id": "",
    "first_name": "",
    "last_name": "",
    "email": "",
    "profile_picture": "",
    "address": "",
    "mobile": "",
    "ip_Address": "12.23.22.322"
  }
  passwordData = {
    "oldpassword": "",
    "newpassword": "",
    "confirmpassword": ""
  }

  privacyPolicyForm = {
    "privacyPolicy_id": "1",
    "description": "",
    "ip_Address": "12.22.22.22"
  }

  faqData: any;
  tempFaqData: any;
  privacyPolicyData: any;
  passNotMatched: boolean = false;
  currentDate = new Date();
  accessPermission: boolean;
  getDocumentTypeData: any = [];
  
  constructor(public router: Router, public dialog: MatDialog, public sharedService: SharedService, public _access: AccessServiceService, public _api: CommonServiceService, public ngxService: NgxUiLoaderService, public _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.editor = new Editor();
    //getting access permission
    this.accessPermission = this._access.getRouteAccess('User roles', JSON.parse(localStorage.getItem('userData')).moduleAccess);

    this.getFaq()
    this.getProfile();
    this.getPV();
  }

  // Security setting (Update password)
  async updatePassword() {
    if (this.passwordData.newpassword !== this.passwordData.confirmpassword) {
      this.passNotMatched = true;
    } else {
      this.ngxService.start();
      this.passNotMatched = false;
      await (this._api.superAdminChangePassword(this.passwordData).subscribe(res => {
        this.ngxService.stop();
        const response: any = res;
        if (response.success == true) {
          this.openSnackBar(response.message);
          localStorage.removeItem('userData');
          localStorage.removeItem('token')
          this.router.navigate(['/login']);
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

  }

  // Get Theme
  async getProfile() {
    this.ngxService.start();
    let formData = {
      "superAdmin_Id": JSON.parse(localStorage.getItem('userData')).superAdmin_id
    }
    await (this._api.superAdminProfile(formData).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        this.themeDataSet = response.data[0];
        this.themeData = {
          "superAdmin_id": this.themeDataSet.superAdmin_id,
          "first_name": this.themeDataSet.first_name,
          "last_name": this.themeDataSet.last_name,
          "email": this.themeDataSet.email,
          "profile_picture": this.themeDataSet.profile_picture,
          "address": this.themeDataSet.address,
          "mobile": this.themeDataSet.mobile,
          "ip_Address": '22.2.32'
        }

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

  // Update Theme
  async updateTheme() {
    this.ngxService.start();
    await (this._api.superAdminProfileUpdate(this.themeData).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        this.themeDataSet = response.data[0];
        this.themeData = {
          "superAdmin_id": this.themeDataSet.superAdmin_id,
          "first_name": this.themeDataSet.first_name,
          "last_name": this.themeDataSet.last_name,
          "email": this.themeDataSet.email,
          "profile_picture": this.themeDataSet.profile_picture,
          "address": this.themeDataSet.address,
          "mobile": this.themeDataSet.mobile,
          "ip_Address": '22.2.32'
        }
        this.openSnackBar(response.message);
        this.getProfile()

        localStorage.setItem('userData', JSON.stringify(response.data[0]))
        this.sharedService.changeUser(JSON.stringify(response.data[0]));
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

  // Get Theme
  async getFaq() {
    this.ngxService.start();
    await (this._api.getFaq().subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        this.faqData = response.data;
        this.tempFaqData = response.data;

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

  // Get privacy policy
  async getPV() {
    this.ngxService.start();
    await (this._api.getPrivacyPolicy().subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        this.privacyPolicyForm = response.data[0];

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

  // upload logo image
  async onSelect(event) {
    console.log(event);
    this.files = [...event.addedFiles];
    if (event.addedFiles.length > 0) {

      await (this._api.uploadThemeDoc(event.addedFiles[0], 'logo').subscribe(res => {
        this.ngxService.stop();
        const response: any = res;
        if (response.success == true) {
          this.themeData.profile_picture = response.data;

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

  onRemove(event) {
    console.log(this.files)
    this.files.splice(this.files.indexOf(event), 1);
  }

  // open add faq modal
  openAddFaqModal() {
    const dialogRef = this.dialog.open(AddFaqComponent, {
      width: '100%',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.getFaq();
    });
  }

  // open add faq modal
  openEditFaqModal(e) {
    const dialogRef = this.dialog.open(EditFaqComponent, {
      width: '100%',
      data: {
        faqData: JSON.stringify(e)
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.getFaq();
    });
  }

  // Get Theme
  async deleteFaq(id) {
    this.ngxService.start();
    await (this._api.deleteFaq({ faq_id: id }).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        this.openSnackBar(response.message);
        this.getFaq();
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

  // update privacy policy
  async updatePv() {
    this.ngxService.start();
    await (this._api.updatePrivacyPolicy(this.privacyPolicyForm).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        this.openSnackBar(response.message);
        this.getPV();
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

  // confirm message
  confirmDialog(id): void {
    const message = `Are you sure you want to delete this?`;

    const dialogData = new ConfirmDialogModel('Confirm Action', message);

    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      maxWidth: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.deleteFaq(id);
      }
    });
  }

  //Searching
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue && filterValue != '') {
      this.faqData = Object.assign([], this.faqData).filter(
        item => item.question.toLowerCase().indexOf(filterValue.toLowerCase()) > -1
      )
    } else {
      this.faqData = this.tempFaqData
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

  changeEditor(e) {
    this.privacyPolicyForm.description = e;
  }
  // date formating
  formatDate(date) {
    return _moment(date).format('DD/MM/YYYY')
  }

  //check Old and New Password
  ChkOldNew(e) {
    if (this.passwordData.oldpassword == e) {
      console.log(e, this.passwordData.oldpassword)
      this.oldNewSame = true;
    } else {
      this.oldNewSame = false;
    }
  }
  // make sure to destory the editor
  ngOnDestroy(): void {
    this.editor.destroy();
  }

}
