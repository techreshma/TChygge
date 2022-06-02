import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  branch: string;
}

@Component({
  selector: 'app-branch-access',
  templateUrl: './branch-access.component.html',
  styleUrls: ['./branch-access.component.scss']
})
export class BranchAccessComponent implements OnInit {
  userData:any;
  accessData:any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, public dialogRef: MatDialogRef<BranchAccessComponent>) {
    this.accessData = JSON.parse(this.data.branch);
  }

  ngOnInit(): void {
    this.userData = JSON.parse(localStorage.getItem('userData'))

  }


}
