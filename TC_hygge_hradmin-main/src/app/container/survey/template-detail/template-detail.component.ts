import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonServiceService } from 'src/app/service/comman-service.service';

@Component({
  selector: 'app-template-detail',
  templateUrl: './template-detail.component.html',
  styleUrls: ['./template-detail.component.scss']
})
export class TemplateDetailComponent implements OnInit {
  id: any;
  question: any = [];
  surveyName: any;
  surveyDescription: any;
  constructor(public route: ActivatedRoute, public _api: CommonServiceService, public ngxService: NgxUiLoaderService, public _snackBar: MatSnackBar) {
    this.id = this.route.snapshot.params.id;
  }

  ngOnInit(): void {
    this.openSurveyQuestion();
  }
  // get survery qustion by id
  async openSurveyQuestion() {
    let formData = {
      "companyId": 0,
      "surveyTypeId": this.id
    }
    this.ngxService.start();
    await (this._api.getSurveryQuestion(formData).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        console.log(response.data)
        for (let item of response.data) {
          item.survey_ColumnArray = JSON.parse(item.survey_ColumnArray);
          item.survey_OptionArray = JSON.parse(item.survey_OptionArray);
          item.survey_RowArray = JSON.parse(item.survey_RowArray);
          item.survey_SliderOption = JSON.parse(item.survey_SliderOption);
          item.survey_SubQuestion = JSON.parse(item.survey_SubQuestion)
        }

        this.question = response.data;
        this.surveyName = this.question.length > 0 && this.question[0].survey_Name;
        this.surveyDescription = this.question.length > 0 && this.question[0].survey_Description;
      } else {
        this.openErrrorSnackBar(response.message)
      }
      console.log(res);
    }, err => {
      const error = err.error;
      this.openErrrorSnackBar(error)
      this.ngxService.stop();
    }));

  }

  arrayOne(n: number): any[] {
    return Array(n);
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
