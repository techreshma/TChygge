import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
export interface DialogData {
  detail: string;
}
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-challange-detail',
  templateUrl: './challange-detail.component.html',
  styleUrls: ['./challange-detail.component.scss']
})
export class ChallangeDetailComponent implements OnInit {
  detail:any
  config:any;
  filePath = environment.apiBaseUrl;
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,public dialogRef: MatDialogRef<ChallangeDetailComponent>) { }
   
  ngOnInit(): void {
    this.detail = JSON.parse(this.data.detail).Details[0];
    console.log(this.detail)
    if(this.detail.challenge_Configuration){
      this.config = JSON.parse(this.detail.challenge_Configuration)
    }
  }
}
