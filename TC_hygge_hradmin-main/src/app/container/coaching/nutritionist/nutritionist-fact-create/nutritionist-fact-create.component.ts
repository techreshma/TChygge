import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Editor } from 'ngx-editor';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-nutritionist-fact-create',
  templateUrl: './nutritionist-fact-create.component.html',
  styleUrls: ['./nutritionist-fact-create.component.scss']
})
export class NutritionistFactCreateComponent implements OnInit {
  value = {};
  segmentData: any = [];
  formGroup: any = {
    coachingcat_Id: null,
    title: '',
    description: '',
    image: [],
    keyOff: [{ key: '' }],
    keywords: []
  }
  imgPath = environment.apiBaseUrl;
  catId: any;
  uploadType: any;
  editor: Editor;
  addTitle: any = "";
  removedPassed: boolean = false;
  removeCount: any = 0;
  constructor(public route: ActivatedRoute, public router: Router, public dialog: MatDialog, public _api: CommonServiceService, public ngxService: NgxUiLoaderService, public _snackBar: MatSnackBar) {
    this.catId = this.route.snapshot.params.id;
    this.formGroup.coachingcat_Id = this.catId;
  }

  ngOnInit(): void {
    if (this.catId === '4') {
      this.addTitle = "Nutritional Information"
    }
    if (this.catId === '5') {
      this.addTitle = "Smart Tips And Guidelines"
    }
    if (this.catId === '6') {
      this.addTitle = "Food Plate Method Eating"
    }
    this.editor = new Editor();
  }

  // add fact
  async addfact() {
    for (let item of this.formGroup.keyOff) {
      this.formGroup.keywords.push(item.key)
    }

    this.formGroup["type"] = this.uploadType
    this.formGroup.image = this.formGroup.image[0]
    this.ngxService.start();
    await (this._api.factCreate(this.formGroup).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        this.openSnackBar(response.message);
        this.router.navigate(['/be-your-own-nutritionist-info/' + this.catId]);
      } else {
        this.openErrrorSnackBar(response.message);
      }
    }, err => {
      const error = err.error;
      this.openErrrorSnackBar(error.message);
      this.ngxService.stop();
    }));
  }

  // upload logo image
  async onSelect(event) {
    this.uploadType = event.addedFiles[0].type.split('/')[0]
    if (this.formGroup.image.length === 0) {
      this.ngxService.start();
      if (event.addedFiles.length === 1) {
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
      } else {
        this.openErrrorSnackBar('You can upload only single Image / Video');
        this.ngxService.stop();
      }
    }
    else {
      this.openErrrorSnackBar('You can upload only single Image / Video');
      this.ngxService.stop();
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
    this.removeCount++;
    this.removedPassed = true;
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
