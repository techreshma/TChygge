import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
export interface DialogData {
  img: string;
}
@Component({
  selector: 'app-payslip-detail',
  templateUrl: './payslip-detail.component.html',
  styleUrls: ['./payslip-detail.component.scss']
})
export class PayslipDetailComponent implements OnInit {
  tempData:any;
  tempNo:any;
  userData:any
  imgPath = environment.apiBaseUrl;
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,public dialogRef: MatDialogRef<PayslipDetailComponent>) { 
    this.userData = JSON.parse(localStorage.getItem('userData'))
  }

  ngOnInit(): void {
    this.tempData = this.data.img;
  }

}
