import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonServiceService } from 'src/app/service/comman-service.service';

@Component({
  selector: 'app-hra-edit',
  templateUrl: './hra-edit.component.html',
  styleUrls: ['./hra-edit.component.scss'],
})
export class HraEditComponent implements OnInit {
  responseData: any = {};
  segmentData: any = [];
  parentOption: any = [];
  id: any;
  questionSelction: any = [];
  constructor(
    public router: Router,
    public _api: CommonServiceService,
    public ngxService: NgxUiLoaderService,
    public _snackBar: MatSnackBar
  ) {
    let url = this.router.url.split('/');
    this.id = url.pop();
    this.getHraById(this.id);
    this.getList();
  }

  ngOnInit(): void {}
  // Get HRA question
  async getHraById(id) {
    let data = {
      healthQuestionsId: id,
    };
    this.ngxService.start();
    await this._api.getHraById(data).subscribe(
      (res) => {
        this.ngxService.stop();
        const response: any = res;
        if (response.success == true) {
          console.log(response.data);
          //#region here we parse some stringified array
          let arrayParsing = ['optionArray','sliderOption','dependentOption','subQuestion','rowArray','columnArray']
          arrayParsing.map((item:any)=>{
            response.data[0][item] = JSON.parse(response.data[0][item])
          })
          //#endregion 
          this.responseData = response.data[0];
        } else {
        }
        console.log(res);
      },
      (err) => {
        const error = err.error;
        this.ngxService.stop();
      }
    );
  }

  // Get HRA List
  async getList() {
    this.ngxService.start();
    await this._api.hraList().subscribe(
      (res) => {
        this.ngxService.stop();
        const response: any = res;
        if (response.success == true) {
          this.questionSelction = [...response.data];
          for (let item of this.questionSelction) {
            if (item.healthQuestions_id === this.id) {
              this.responseData.parentOption = JSON.parse(item.optionArray);
            }
          }
        } else {
        }
        console.log(res);
      },
      (err) => {
        const error = err.error;
        this.ngxService.stop();
      }
    );
  }
  // edit question
  async editHra() {
    let formData = {
      healthQuestions_id: this.responseData.healthQuestions_id,
      type: this.responseData.type,
      title: this.responseData.title,
      category: this.responseData.category,
      description: this.responseData.description,
      optionArray: this.responseData.optionArray,
      subQuestion: this.responseData.subQuestion,
      sliderOption:this.responseData.sliderOption,
      answer: this.responseData.answer,
      columnArray: this.responseData.columnArray,
      rowArray: this.responseData.rowArray,
      score: this.responseData.score,
      isRequired: this.responseData.isRequired,
      ip_Address: '32.44.33.22',
      segments: this.responseData.segments,
      dependentQuestionId: this.responseData.dependentQuestionId,
      questionId: this.responseData.questionId,
      dependentOption: this.responseData.dependentOption,
    };
    this.ngxService.start();
    await this._api.editHra(formData).subscribe(
      (res) => {
        this.ngxService.stop();
        const response: any = res;
        if (response.success == true) {
          this.openSnackBar(response.message);
          this.router.navigate(['/hra']);
        } else {
          this.openErrrorSnackBar(response.message);
        }
        console.log(res);
      },
      (err) => {
        const error = err.error;
        this.openErrrorSnackBar(error.message);
        this.ngxService.stop();
      }
    );
  }
  ///get parent otpions
  getParentIds(e) {
    console.log(e);
    for (let item of this.questionSelction) {
      if (item.questionId == e) {
        this.responseData.parentOption = JSON.parse(item.optionArray);
      }
    }
    console.log(this.questionSelction);
  }
  setSegment(e) {
    console.log(e);
    if (e == 'body') {
      this.segmentData = [
        'Personal',
        'Biometrics',
        'Clinical History',
        'Screening',
        'Family history',
        'Occupational history',
      ];
    } else if (e == 'mind') {
      this.segmentData = [
        'Stress and mental wellbeing',
        'Readiness assessment',
      ];
    } else if (e == 'lifestyle') {
      this.segmentData = [
        'LifeStyle History - Diet',
        'Lifestyle history - physical activity',
        'Lifestyle history - physical activity',
        'Lifestyle history - Sleep',
        'Lifestyle history - alcohol',
      ];
    }
  }
  changeRequired(e) {
    console.log(e);
    if (e.checked) {
      this.responseData.isRequired = 1;
    } else {
      this.responseData.isRequired = 0;
    }
  }

  // alert message after api response success
  openSnackBar(msg) {
    this._snackBar.open(msg, 'Ok', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['success-alert'],
    });
  }
  // alert message after api response failure
  openErrrorSnackBar(msg) {
    this._snackBar.open(msg, 'Ok', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['failure-alert'],
    });
  }
}
