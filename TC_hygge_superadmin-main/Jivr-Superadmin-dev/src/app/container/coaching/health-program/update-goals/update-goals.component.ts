import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-update-goals',
  templateUrl: './update-goals.component.html',
  styleUrls: ['./update-goals.component.scss']
})
export class UpdateGoalsComponent implements OnInit {
  formGroup = {
    programGoal_id: null,
    goal_image: [],
  }
  imgPath = environment.apiBaseUrl;
  title: any;
  catId: any;
  subId: any;
  constructor(public route: ActivatedRoute, public router: Router, public dialog: MatDialog, public _api: CommonServiceService, public ngxService: NgxUiLoaderService, public _snackBar: MatSnackBar) {
    this.catId = this.route.snapshot.params.catId;
    this.subId = this.route.snapshot.params.id;
    this.formGroup.programGoal_id = this.subId;
  }

  goalBreadCrum: any = {
    10: '',
    11: '',
    12: '',
    13: '',
    14: '',
    15: '',
    16: ''
  }

  ngOnInit(): void {
    console.log(this.catId)
    this.getList();
  }
  // cateogory list
  async getList() {
    let formData = {
      "coachingcat_Id": this.catId
    }
    this.ngxService.start();
    await (this._api.getHealthSubCategory(formData).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        const respData = response.data.filter(item => item.programGoal_id == this.subId);
        console.log(respData)
        this.title = respData[0].goal_name
        this.formGroup.goal_image = JSON.parse(respData[0].goal_image);
      } else {
      }
      console.log(res);
    }, err => {
      const error = err.error;
      this.ngxService.stop();
    }));
  }

  // update
  async update() {
    this.ngxService.start();
    await (this._api.updateGoal(this.formGroup).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        this.openSnackBar(response.message);
        this.router.navigate(['/health-goals/' + this.catId]);
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

  // upload logo image
  async onSelect(event) {
    this.ngxService.start();
    if (event.addedFiles.length > 0) {
      for await (let item of event.addedFiles) {
        console.log(item)
        await (this._api.uploadThemeDoc(item, 'logo').subscribe(res => {
          const response: any = res;
          if (response.success == true) {
            this.formGroup.goal_image.push(response.data[0]);
          } else {
            this.openSnackBar(response.message);
          }
          console.log(res);
        }, err => {
          const error = err.error;
          this.openErrrorSnackBar(error.message);
        }));
      }

      this.ngxService.stop();
    } else {
      this.ngxService.stop();
      this.openErrrorSnackBar('File size is too large');
    }
  }

  onRemove(event) {
    console.log(event);
    this.formGroup.goal_image.splice(this.formGroup.goal_image.indexOf(event), 1);
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
