import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { environment } from '../../../../environments/environment';

import {
  MatSnackBar
} from '@angular/material/snack-bar';
import { SubAdminAddComponent } from '../sub-admin-add/sub-admin-add.component';
import { SubAdminEditComponent } from '../sub-admin-edit/sub-admin-edit.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmBoxComponent, ConfirmDialogModel } from 'src/app/confirm-box/confirm-box.component';
import { AccessServiceService } from 'src/app/service/access-service.service';

@Component({
  selector: 'app-sub-admin-list',
  templateUrl: './sub-admin-list.component.html',
  styleUrls: ['./sub-admin-list.component.scss']
})
export class SubAdminListComponent implements OnInit {
  imgPath = `${environment.apiBaseUrl}`;
  // set header column
  displayedColumns: string[] = ['position', 'name', 'email', 'designation', 'status', 'action'];

  //set static data for table
  dataSource = new MatTableDataSource([]);

  // table sorting and pagination
  @ViewChild(MatPaginator,{static:false}) paginator: MatPaginator;
  @ViewChild(MatSort,{static:false}) sort: MatSort;
  accessPermission:boolean;
  constructor(public _access:AccessServiceService, public dialog: MatDialog, public _api: CommonServiceService, public ngxService: NgxUiLoaderService, public _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    //getting access permission
    this.accessPermission = this._access.getRouteAccess('User roles',JSON.parse(localStorage.getItem('userData')).moduleAccess);
    console.log(this.accessPermission)
    this.getList();
  }

 // Get Sub Admin List
 async getList(){
  this.ngxService.start();
  await(this._api.getSubAdmin().subscribe(res => {
    this.ngxService.stop();
    const response: any = res;
    if (response.success == true){
      console.log(response.data);
      const arr = [];
      for (const item of response.data){
        const obj = {position: `${item.profile_picture}`, name: item.first_name + ' ' + item.last_name, email: item.email, designation: item.roleName, status: item.status,id:item.superAdmin_id,role:item.role, address:item.address,mobile:item.mobile};
        arr.push(obj);
      }
      this.dataSource = new MatTableDataSource([...arr]);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log(this.dataSource);
    }else{
    }
    console.log(res);
  }, err => {
    const error = err.error;
    this.ngxService.stop();
  }));

}


// Delete Sub Admin
async deleteSubAdmin(id){
  this.ngxService.start();
  let formData = {
    superAdmin_id:id
  }
  await(this._api.deleteSubAdmin(formData).subscribe(res => {
    this.ngxService.stop();
    const response: any = res;
    if (response.success == true){
      this.openSnackBar(response.message);
      this.getList();
    }else{
      this.openErrrorSnackBar(response.message);
    }


    console.log(res);
  }, err => {
    const error = err.error;
    this.openErrrorSnackBar(error.message);
    this.ngxService.stop();
  }));

}

// Update Sub Admin status
async statusSubAdmin(id,status){
  this.ngxService.start();
  let formData = {
    "superAdmin_id":id,
    "status":status ,
    "ip_Address":"1111"
  }
  await(this._api.updateSubAdminStatus(formData).subscribe(res => {
    this.ngxService.stop();
    const response: any = res;
    if (response.success == true){
      this.openSnackBar(response.message);
      this.getList();
    }else{
      this.openErrrorSnackBar(response.message);
    }


    console.log(res);
  }, err => {
    const error = err.error;
    this.openErrrorSnackBar(error.message);
    this.ngxService.stop();
  }));

}

  // open add Sub Admin modal
  openSubAddModal() {
    const dialogRef = this.dialog.open(SubAdminAddComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.getList()
    });
  }

  // open add Sub Admin modal
  openSubEditModal(e) {
    const dialogRef = this.dialog.open(SubAdminEditComponent, {
      data: {
        subAdmin: JSON.stringify(e)
      }});

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.getList()
    });
  }


  //Searching
  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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

// confirm message
confirmDialog(id): void {
  const message = `Are you sure you want to delete this?`;

  const dialogData = new ConfirmDialogModel('Confirm Action', message);

  const dialogRef = this.dialog.open(ConfirmBoxComponent, {
    maxWidth: '400px',
    data: dialogData
  });

  dialogRef.afterClosed().subscribe(dialogResult => {
    if(dialogResult){
      this.deleteSubAdmin(id);
    }
  });
}

}
