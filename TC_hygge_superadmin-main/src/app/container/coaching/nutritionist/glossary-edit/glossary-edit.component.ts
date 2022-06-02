import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonServiceService } from 'src/app/service/comman-service.service';

@Component({
  selector: 'app-glossary-edit',
  templateUrl: './glossary-edit.component.html',
  styleUrls: ['./glossary-edit.component.scss']
})
export class GlossaryEditComponent implements OnInit {
  value = {};
  segmentData: any = [];
  responseData: any;
  formGroup = {
    "glossary_name": "",
    "glossary_meaning": "",
    "userId": 1,
    "ip_Address": "33.33.232.22.",
    "glossary_id": "",
    "coachingcat_Id": 8
  }
  constructor(public route: ActivatedRoute, public router: Router, public dialog: MatDialog, public _api: CommonServiceService, public ngxService: NgxUiLoaderService, public _snackBar: MatSnackBar) {
    this.formGroup.glossary_id = this.route.snapshot.params.id
  }

  ngOnInit(): void {
    this.PostDetails();
  }


  // Get Post Details
  async PostDetails() {
    let formGroup = {
      "glossary_id": this.formGroup.glossary_id
    }
    this.ngxService.start();
    await (this._api.detailGlossary(formGroup).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        this.responseData = response.data[0];
        this.formGroup.glossary_name = this.responseData.glossary_name
        this.formGroup.glossary_meaning = this.responseData.glossary_meaning;
      } else {
      }
      console.log(res);
    }, err => {
      const error = err.error;
      this.ngxService.stop();
    }));

  }


  // edit glossary
  async editGlossary() {
    this.ngxService.start();
    await (this._api.glossaryEdit(this.formGroup).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        this.openSnackBar(response.message);
        this.router.navigate(['/glossary']);
      } else {
        this.openErrrorSnackBar(response.message);
      }
      console.log(res);
    }, err => {
      const error = err.error;
      this.openErrrorSnackBar(error.message);
      this.ngxService.stop();
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
}
