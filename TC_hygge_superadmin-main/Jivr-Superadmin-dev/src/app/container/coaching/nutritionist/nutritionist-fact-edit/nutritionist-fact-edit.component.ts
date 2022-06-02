import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Editor } from 'ngx-editor';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-nutritionist-fact-edit',
  templateUrl: './nutritionist-fact-edit.component.html',
  styleUrls: ['./nutritionist-fact-edit.component.scss']
})
export class NutritionistFactEditComponent implements OnInit {
  editor: Editor;
  value = {};
  segmentData: any = [];

  formGroup = {
    coachaddpost_id: null,
    title: '',
    description: '',
    image: [],
    keyOff: [],
    keywords: [],
    "ip_Address": "122.22.33.44"
  }
  imgPath = environment.apiBaseUrl;
  postid: any;
  catId: any;
  responseData: any;

  editTitle: any;

  uploadType: string = '';
  removedPassed: boolean = false;
  removeCount: any = 0;

  constructor(public route: ActivatedRoute, public router: Router, public dialog: MatDialog, public _api: CommonServiceService, public ngxService: NgxUiLoaderService, public _snackBar: MatSnackBar) {
    this.catId = this.route.snapshot.params.id;
    this.postid = this.route.snapshot.params.postid;
    this.formGroup.coachaddpost_id = this.postid;
  }

  ngOnInit(): void {
    if (this.catId === '4') {
      this.editTitle = "Nutritional Information"
    }
    if (this.catId === '5') {
      this.editTitle = "Smart Tips And Guidelines"
    }
    if (this.catId === '6') {
      this.editTitle = "Food Plate Method Eating"
    }
    this.editor = new Editor();
    this.PostDetails();
  }


  // Get Post Details
  async PostDetails() {
    let formGroup = {
      "coachaddpost_id": this.postid
    }

    this.ngxService.start();
    await (this._api.PostDetails(formGroup).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        this.responseData = response.data[0];

        for (let item of JSON.parse(this.responseData.keywords)) {
          this.formGroup.keyOff.push({ key: item })
        };
        // this.formGroup.image = JSON.parse(this.responseData.image)
        this.formGroup.image = [JSON.parse(this.responseData.image)]
        this.formGroup.title = this.responseData.fact_title;
        this.formGroup.description = this.responseData.fact_description;
      } else {
      }
      console.log(res);
    }, err => {
      const error = err.error;
      this.ngxService.stop();
    }));

  }

  // update fact
  async updatefact() {
    for (let item of this.formGroup.keyOff) {
      this.formGroup.keywords.push(item.key)
    }
    this.ngxService.start();
    this.formGroup["type"] = this.uploadType

    this.formGroup.image = this.formGroup.image[0]
    await (this._api.updatePost(this.formGroup).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        this.openSnackBar(response.message);
        this.router.navigate(['/be-your-own-nutritionist-info/' + this.catId]);
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
    if (this.formGroup.image.length === 0) {
      this.ngxService.start();
      if (event.addedFiles.length === 1) {
        console.log(event.addedFiles[0].type.split('/')[0])
        this.uploadType = event.addedFiles[0].type.split('/')[0]
        this.ngxService.start();
        for (let item of event.addedFiles) {
          await (this._api.uploadThemeDoc(item, 'logo').subscribe(res => {
            const response: any = res;
            if (response.success == true) {
              this.formGroup.image.push(response.data);
              this.ngxService.stop();
            } else {
              this.openSnackBar(response.message);
            }
          }, err => {
            const error = err.error;
            this.openErrrorSnackBar(error.message);
          }));
        }
      }
      else {
        this.ngxService.stop();
        this.openErrrorSnackBar('You can upload only single Image / Video');
      }
    }
    else {
      this.ngxService.stop();
      this.openErrrorSnackBar('You can upload only single Image / Video');
    }
  }

  onRemove(event) {
    console.log(event);
    this.formGroup.image.splice(this.formGroup.image.indexOf(event), 1);
  }

  addOption() {
    this.formGroup.keyOff.push({ key: '' })
    var lengthVar: any = this.formGroup.keyOff.length
    var currentIndex: any = lengthVar - 1;
    if (this.removedPassed) {
      if (lengthVar != 0) {
        let previousOfValue: any = this.formGroup.keyOff[currentIndex - this.removeCount].key
        this.formGroup.keyOff[currentIndex - this.removeCount] = { key: previousOfValue };
      }
    }
    this.removeCount = 0;
  }

  removeOption(Index: any) {
    this.formGroup.keyOff.splice(Index, 1);
    this.removedPassed = true;
    this.removeCount++;
  }

  changeEditor(e) {
    this.formGroup.description = e;
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
