import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ConfirmBoxComponent, ConfirmDialogModel } from 'src/app/confirm-box/confirm-box.component';
import { AccessServiceService } from 'src/app/service/access-service.service';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import { NotificationSendComponent } from '../notification-send/notification-send.component';
import * as moment from 'moment';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent implements OnInit {
  notificationList: any;
  accessPermission: boolean;
  // set header column
  displayedColumns: string[] = ['title', 'body', 'userCount', 'date', 'action'];

  //set static data for table
  dataSource = new MatTableDataSource([]);
  notificationListClone: any = []

  picker: any = ''

  // table sorting and pagination
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  constructor(public dialog: MatDialog, public _access: AccessServiceService, public _api: CommonServiceService, public ngxService: NgxUiLoaderService, public _snackBar: MatSnackBar) {

  }

  ngOnInit(): void {
    this.accessPermission = this._access.getRouteAccess('User roles', JSON.parse(localStorage.getItem('userData')).moduleAccess);
    this.getList()

  }

  filterRecordByDate(date: any) {
    let filterArray: any = []
    this.notificationListClone.forEach((el: any) => {
      if (moment(el.created_At).format('YYYY-MM-DD') === date) {
        filterArray.push(el)
      }
    })
    this.dataSource = new MatTableDataSource([...filterArray])
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // Get Notification list
  async getList() {
    this.ngxService.start();
    await (this._api.getNotification().subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        this.notificationList = response.data;
        this.notificationListClone = response.data
        this.dataSource = new MatTableDataSource([...response.data])
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

      } else {
        this.openErrrorSnackBar(response.message);
      }
      console.log(res);
    }, err => {
      const error = err.error;
      this.ngxService.stop();
      this.openErrrorSnackBar(error.message);
    }));

  }

  confirmDialog(id): void {
    const message = `Are you sure you want to delete this?`;

    const dialogData = new ConfirmDialogModel('Confirm Action', message);

    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      maxWidth: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.deleteNotification(id);
      }
      else {
        this.getList()
      }
    });
  }

  async deleteNotification(id) {
    this.ngxService.start();
    const formData = {
      announcements_id: id
    }
    await (this._api.deleteNotification(formData).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        this.openSnackBar(response.message);
        this.getList();
      } else {
        this.openErrrorSnackBar(response.message);
      }
    }, err => {
      const error = err.error;
      this.openErrrorSnackBar(error.message);
      this.ngxService.stop();
    }));
  }


  // open add faq modal
  openEditNotificationModal() {
    const dialogRef = this.dialog.open(NotificationSendComponent, {
      width: '50%'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.getList();
    });
  }



  //Searching
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  // -------------
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
