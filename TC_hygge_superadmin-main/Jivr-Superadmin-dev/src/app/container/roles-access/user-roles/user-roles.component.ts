import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RoleAddComponent } from '../role-add/role-add.component';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import {
  MatSnackBar
} from '@angular/material/snack-bar';
import { RoleEditComponent } from '../role-edit/role-edit.component';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmBoxComponent, ConfirmDialogModel } from 'src/app/confirm-box/confirm-box.component';
import { AccessServiceService } from 'src/app/service/access-service.service';

@Component({
  selector: 'app-user-roles',
  templateUrl: './user-roles.component.html',
  styleUrls: ['./user-roles.component.scss']
})
export class UserRolesComponent implements OnInit, AfterViewInit {
  roleData = new MatTableDataSource(ELEMENT_DATA);
  displayedColumns: string[] = ['role_Type', 'nouser', 'accesslevel', 'status', 'actionsrequired'];
  accessPermission: boolean;
  // table sorting and pagination
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(public _access: AccessServiceService, public dialog: MatDialog, public _api: CommonServiceService, public ngxService: NgxUiLoaderService, public _snackBar: MatSnackBar) {

  }


  ngOnInit(): void {
    //getting access permission
    this.accessPermission = this._access.getRouteAccess('User roles', JSON.parse(localStorage.getItem('userData')).moduleAccess);
    console.log(this.accessPermission)
  }

  ngAfterViewInit() {
    this.getRole();
  }
  // Get Role Type
  async getRole() {
    this.ngxService.start();
    await (this._api.getRole().subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        console.log(response.data)
        let arr = []
        for (let item of response.data) {
          let obj = { superadminRole_id: item.superadminRole_id, role_Type: item.role_Type, nouser: item.userCount, accesslevel: item.accessLevel, status: item.status, actionsrequired: 'No Permission' }
          arr.push(obj);
        }
        this.roleData = new MatTableDataSource([...arr]);

        this.roleData.paginator = this.paginator;
        this.roleData.sort = this.sort;
        console.log(this.roleData)
      } else {
      }
      console.log(res);
    }, err => {
      const error = err.error;
      this.ngxService.stop();
    }));

  }

  // update role status
  async udpateStatus(id, status) {
    let data = {
      "superadminRole_id": id,
      "status": status,
      "ip_Address": "1233"
    }
    this.ngxService.start();
    await (this._api.editRoleStatus(data).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        this.openSnackBar(response.message);
        this.getRole();
      } else {
        this.openSnackBar(response.message);
      }
      console.log(res);
    }, err => {
      const error = err.error;
      this.openSnackBar(error.message);
      this.ngxService.stop();
    }));

  }

  // delete role status
  async deleteRole(id, status) {
    let data = {
      "superadminRole_id": id,
      "isActive": status,
      "ip_Address": "123.123.343"
    }
    this.ngxService.start();
    await (this._api.deleteRole(data).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        this.openSnackBar(response.message);
        this.getRole();
      } else {
        this.openErrrorSnackBar(response.message);
      }
      console.log(res);
    }, err => {
      const error = err.error;
      this.openErrrorSnackBar(error.message);
      this.ngxService.stop();
    }));

  }

  // open add role modal
  openRoleAddModal() {
    const dialogRef = this.dialog.open(RoleAddComponent, {
      width: '50%'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.getRole();
    });
  }

  // open add role modal
  openRoleEditModal(e) {
    const dialogRef = this.dialog.open(RoleEditComponent, {
      width: '50%',
      data: {
        role: JSON.stringify(e)
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.getRole();
    });
  }

  //Searching
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.roleData.filter = filterValue.trim().toLowerCase();
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
  confirmDialog(id, status): void {
    const message = `Are you sure you want to delete this?`;

    const dialogData = new ConfirmDialogModel('Confirm Action', message);

    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      maxWidth: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.deleteRole(id, status);
      }
    });
  }

}
export interface PeriodicElement {
  superadminRole_id: number;
  role_Type: string;
  nouser: number;
  accesslevel: string;
  status: string;
  actionsrequired: number;
}
const ELEMENT_DATA: PeriodicElement[] = [];
