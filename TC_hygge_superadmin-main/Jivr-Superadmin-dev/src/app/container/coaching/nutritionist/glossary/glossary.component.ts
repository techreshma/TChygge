import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { environment } from '../../../../../environments/environment';
import { MatAccordion } from '@angular/material/expansion';

import * as _moment from 'moment';
import {
  MatSnackBar
} from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AccessServiceService } from 'src/app/service/access-service.service';
import { ConfirmBoxComponent, ConfirmDialogModel } from 'src/app/confirm-box/confirm-box.component';

@Component({
  selector: 'app-glossary',
  templateUrl: './glossary.component.html',
  styleUrls: ['./glossary.component.scss']
})
export class GlossaryComponent implements OnInit {
  // set header column
  displayedColumns: string[] = ['srno', 'glossary_name', 'views', 'status', 'action'];
  panelOpenState: any = false;
  //set static data for table
  dataSource = new MatTableDataSource([]);
  tdId: number;
  tdCheck: boolean = true;

  // table sorting and pagination
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatAccordion) accordion: MatAccordion;

  filePath = environment.apiBaseUrl
  responseData: any = [];
  csvFile: any = '';
  newRequest: number = 0;
  accessPermission: boolean;
  graphData: any;
  totalView = 0;
  ViewGraphChart: any;
  heightRecord: any = {
    isDefault: true,
    dasboard1: 'dashboard_card',
    dasboard2: 'dashboard_radar',
    dasboard3: 'dashboard_gauage',
    dasboard4: 'dashboard_maxline ',
    dasboard5: 'dashboard_donut',
    dasboard6: 'dashboard_line',
    dasboard7: 'dashboard_heatmap'
  }

  constructor(public _access: AccessServiceService, public dialog: MatDialog, public _api: CommonServiceService, public ngxService: NgxUiLoaderService, public _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    //getting access permission
    this.accessPermission = this._access.getRouteAccess('User roles', JSON.parse(localStorage.getItem('userData')).moduleAccess);
    this.getList();
    // this.graphData = JSON.stringify({ label: ['Views'], percentage: ['60'], colors: ['#15C1DC'] })
  }

  // Get Leave List
  async getList() {
    this.ngxService.start();
    await (this._api.listGlossary().subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        this.responseData = response.data;

        //Here we have converted the array into object and set bottom title
        let ViewObj: any = {}
        this.responseData.ViewArr.forEach((element: any) => {
          ViewObj = element
        })
        this.totalView = ViewObj.TotalViews;

        //Here we can set line chart response
        this.ViewGraphChart = JSON.stringify({
          label: this.responseData.TotalViewCountByYear.map((item: any) => item["YEAR"]),
          percentage: [{
            name: 'View',
            data: this.responseData.TotalViewCountByYear.map((item: any) => item.TotalViewCount)
          }],
          colors: ['#0190FF', '#ff9b44'],
          height: 250,
          seriesType: true
        });

        this.totalView = ViewObj.TotalViews;
        this.graphData = JSON.stringify({ label: ['Views'], percentage: [this.totalView], colors: ['#15C1DC'] })
       
        
        this.responseData.newArr.forEach((el: any) => {
          el["expandStatus"] = false;
        })

        this.dataSource = new MatTableDataSource([...this.responseData.newArr]);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      } else {
      }
      console.log(res);
    }, err => {
      const error = err.error;
      this.ngxService.stop();
    }));

  }

  // delete fact
  async deleteFact(id) {
    let formGroup = {
      "glossary_id": id,
      "ip_Address": "24.33.222.34",
      "userId": "1"
    }
    this.ngxService.start();
    await (this._api.deleteGlossary(formGroup).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        this.openSnackBar(response.message)
        this.getList();
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

  //Update Status
  async statusUpdate(id: any, status: any) {
    let statusForm = {
      "glossary_id": id,
      "status": status
    }

    this.ngxService.start();
    await (this._api.updateGlossaryStatus(statusForm).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        this.openSnackBar(response.message)
        this.getList();
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

  //Searching
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // confirm message
  confirmDialog(id): void {
    const message = `Are you sure you want to delete this?`;

    const dialogData = new ConfirmDialogModel('Confirm Action', message);

    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      maxWidth: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.deleteFact(id);
      }
      else {
        this.getList()
      }
    });
  }


 //#region expandContent Function
 expandContent(check: boolean, id: number) {
  this.responseData.newArr.forEach((el: any) => {
    el["expandStatus"] = el.glossary_id == id && check
  })
  this.dataSource = new MatTableDataSource([...this.responseData.newArr]);
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
}
//#endregion expandContent Function

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
