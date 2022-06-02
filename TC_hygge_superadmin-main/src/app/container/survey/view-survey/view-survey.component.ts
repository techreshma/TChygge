import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';


import {
  MatSnackBar
} from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
export interface DialogData {
  hraP: string;
  formName: string;
  formDescription: string;
}


@Component({
  selector: 'app-view-survey',
  templateUrl: './view-survey.component.html',
  styleUrls: ['./view-survey.component.scss']
})
export class ViewSurveyComponent implements OnInit {
  question:any = [];
  tab:number = 0;
  formName:any;
  formDescription:any;
  qeustionType = [
    { label:'Rating',value:'rating'},
    { label:'Drop Down',value:'dropdown'},
    { label:'Radio Button',value:'radio'},
    { label:'Slider',value:'slider'},
    { label:'Open Ended',value:'textarea'},
    { label:'Multiple Choice',value:'multiSelect'},
    { label:'Linkert',value:'linkert'},
    { label:'Matrix',value:'matrix'},
    { label:'Text Box',value:'text'}
  ]
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, public _api: CommonServiceService, public ngxService: NgxUiLoaderService, public _snackBar: MatSnackBar, public dialogRef: MatDialogRef<ViewSurveyComponent>) { }

  ngOnInit(): void {
    let question = JSON.parse(this.data.hraP)
    this.formName = this.data.formName;
    this.formDescription = this.data.formDescription;
    console.log(question)
    // for(let item of question){
    //   item.survey_ColumnArray = JSON.parse(item.survey_ColumnArray);
    //   item.survey_OptionArray = JSON.parse(item.survey_OptionArray);
    //   item.survey_RowArray = JSON.parse(item.survey_RowArray);
    //   item.survey_SliderOption = JSON.parse(item.survey_SliderOption);
    //   item.survey_SubQuestion = JSON.parse(item.survey_SubQuestion)
    // }

    // console.log(question)
    this.question = question;
  }

  next() {

    if (this.tab < this.question.length) {
      this.tab++;
    }
  }
  prev() {
    if (this.tab > 0) {
      this.tab--;
    }
  }

  arrayOne(n: number): any[] {
    return Array(n);
  }


}
