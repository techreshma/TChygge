import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { TableComponent } from 'src/app/component/table/table.component';
import { AccessServiceService } from 'src/app/service/access-service.service';
import { BranchCreateComponent } from '../branch-create/branch-create.component';
import { BranchAccessComponent } from '../branch-access/branch-access.component';
import { AlertService } from 'src/app/service/alert.service';
import { BranchEditComponent } from '../branch-edit/branch-edit.component';

@Component({
  selector: 'app-branch-list',
  templateUrl: './branch-list.component.html',
  styleUrls: ['./branch-list.component.scss'],
})
export class BranchListComponent implements OnInit {
  // set header column
  displayedColumns: any[] = [
    //'branch_id',
    'branch_Name',
    'company_Contact',
    'corporate_Email',
    'branch_Type',
    'status',
    'action',
  ];
  displayedColumnsTitle: any[] = [
    //'Branch Id',
    'Branch Name',
    'Contact',
    'Email',
    'Branch Type',
    'Status',
    'Action',
  ];
  actionColumn: any[] = ['status', 'delete', 'update', 'preview'];
  @ViewChild(TableComponent) table: TableComponent;
  graphData: any;
  departmentGraph: any;
  heatGraph: any;
  responseData: any = [];
  accessPermission: boolean;
  departmentData: any = [];
  activeChallanges: number = 0;
  totalParticipant: number = 0;
  graphDetail: any;
  graphMale: number = 0;
  graphFemale: number = 0;
  data: any;
  userData: any;
  colors = [
    '#3F51B5',
    '#5363BC',
    '#6876C4',
    '#7C88CB',
    '#5363BC',
    '#6876C4',
    '#7C88CB',
    '#BAC0E1',
    '#CED2E8',
    '#5363BC',
    '#7C88CB',
    '#A5ADDA',
    '#BAC0E1',
    '#CED2E8',
    '#E3E5F0',
    '#F7F7F7',
    '#3F51B5',
    '#5363BC',
    '#6876C4',
    '#7C88CB',
    '#5363BC',
    '#6876C4',
    '#7C88CB',
    '#BAC0E1',
    '#CED2E8',
    '#5363BC',
    '#7C88CB',
    '#A5ADDA',
    '#BAC0E1',
    '#CED2E8',
    '#E3E5F0',
    '#F7F7F7',
  ];
  constructor(
    public _alert: AlertService,
    public router: Router,
    public dialog: MatDialog,
    public _api: CommonServiceService,
    public ngxService: NgxUiLoaderService,
    public _snackBar: MatSnackBar,
    public _access: AccessServiceService
  ) {
    this.accessPermission = this._access.getRouteAccess(
      'User roles',
      JSON.parse(localStorage.getItem('userData')).moduleAccess
    );
    this.userData = JSON.parse(localStorage.getItem('userData'));
  }

  ngOnInit(): void {
    this.getBranchList();
  }

  // Branch list
  async getBranchList() {
    this.data = undefined;
    this.ngxService.start();
    await this._api.getBranch().subscribe(
      (res) => {
        this.ngxService.stop();
        const response = res;
        if (response.success == true) {
          this.data = response.data;
          //branch_Name
        } else {
          this._alert.openErrrorSnackBar(response.message);
        }
      },
      (err) => {
        const error = err.error;
        this._alert.openErrrorSnackBar(error.message);
        this.ngxService.stop();
      }
    );
  }

  // open add Employee modal
  openAddModal() {
    const dialogRef = this.dialog.open(BranchCreateComponent, {
      width: '50%',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      this.getBranchList();
    });
  }

  // open access module(){
  onViewAccess(e, data) {
    const dialogRef = this.dialog.open(BranchAccessComponent, {
      width: '50%',
      data: {
        branch: data.access,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      this.getBranchList();
    });
  }

  async goToUpdate(event, element) {
    const dialogRef = this.dialog.open(BranchEditComponent, {
      width: '50%',
      data: {
        branch: JSON.stringify(element),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      this.getBranchList();
    });
  }

  async statusUpdate(event, elemetn, status) {
    this.ngxService.start();
    let formData = {
      company_Id: this.userData.company_id,
      branch_Id: elemetn.branch_id,
      status: status,
      ip_Address: '12.21.22.11',
      user_Id: this.userData.user_id,
    };
    await this._api.updateBranchStatus(formData).subscribe(
      (res) => {
        this.ngxService.stop();
        const response = res;
        if (response.success == true) {
          this._alert.openSnackBar(response.message);
          this.getBranchList();
        } else {
          this._alert.openErrrorSnackBar(response.message);
        }
      },
      (err) => {
        const error = err.error;
        this._alert.openErrrorSnackBar(error.message);
        this.ngxService.stop();
      }
    );
  }

  async onDelete(event, element) {
    this.ngxService.start();
    let formData = {
      company_Id: this.userData.company_id,
      branch_Id: element.branch_id,
      isActive: 0,
      ip_Address: '12.21.22.11',
      user_Id: this.userData.user_id,
    };
    await this._api.deleteBranchStatus(formData).subscribe(
      (res) => {
        this.ngxService.stop();
        const response = res;
        if (response.success == true) {
          this._alert.openSnackBar(response.message);
          this.getBranchList();
        } else {
          this._alert.openErrrorSnackBar(response.message);
        }
      },
      (err) => {
        const error = err.error;
        this._alert.openErrrorSnackBar(error.message);
        this.ngxService.stop();
      }
    );
  }
  // open add Employee modal
  openDetailModal(event, e) {
    // if(e.actin_Required == 1){
    //   const dialogRef = this.dialog.open(ChallangeDetailComponent, {
    //     width:'50%',
    //     data: {
    //       detail: JSON.stringify(e)
    //     }});
    //   dialogRef.afterClosed().subscribe(result => {
    //     console.log(`Dialog result: ${result}`);
    //   });
    // }
  }

  //Searching
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.table.filter(filterValue);
  }
}
