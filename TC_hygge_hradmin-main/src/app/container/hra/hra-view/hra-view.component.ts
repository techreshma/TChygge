import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import { StarRatingComponent } from 'ng-starrating';

import {
  MatSnackBar
} from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
export interface DialogData {
  hraP: string;
}



@Component({
  selector: 'app-hra-view',
  templateUrl: './hra-view.component.html',
  styleUrls: ['./hra-view.component.scss']
})
export class HraViewComponent implements OnInit {
  question:any = [];
  tab:number = 0;
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
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, public _api: CommonServiceService, public ngxService: NgxUiLoaderService, public _snackBar: MatSnackBar, public dialogRef: MatDialogRef<HraViewComponent>) { }

  ngOnInit(): void {
    let question = JSON.parse(this.data.hraP)
    for(let item of question){
      item.columnArray = item.columnArray;
      item.optionArray = item.optionArray;
      item.rowArray = item.rowArray;
      item.sliderOption = item.sliderOption;
      item.subQuestion = item.subQuestion
    }

    console.log(question)
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
  onRate($event:{oldValue:number, newValue:number, starRating:StarRatingComponent}) {
    alert(`Old Value:${$event.oldValue},
      New Value: ${$event.newValue},
      Checked Color: ${$event.starRating.checkedcolor},
      Unchecked Color: ${$event.starRating.uncheckedcolor}`);
  }

}
