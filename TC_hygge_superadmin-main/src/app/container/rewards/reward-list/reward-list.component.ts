import { Component, OnInit, ViewChild } from "@angular/core";
import { CommonServiceService } from "src/app/service/comman-service.service";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { environment } from "../../../../environments/environment";

import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { AccessServiceService } from "src/app/service/access-service.service";
import {
  ConfirmBoxComponent,
  ConfirmDialogModel,
} from "src/app/confirm-box/confirm-box.component";

@Component({
  selector: "app-reward-list",
  templateUrl: "./reward-list.component.html",
  styleUrls: ["./reward-list.component.scss"],
})
export class RewardListComponent implements OnInit {
  // set header column
  displayedColumns: string[] = [
    "reward_Image",
    "reward_Name",
    "reward_Points",
    "acceptedReward",
    "status",
    "action",
  ];

  //set static data for table
  dataSource = new MatTableDataSource([]);

  // table sorting and pagination
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  imgPath = environment.apiBaseUrl;
  leaveBalance = [];
  salaryBalance = [];
  graphData: any;
  departmentGraph: any;
  redeemRewardGraph: any;
  redeemLineChart: any;
  pointsLineChart: any;
  responseData: any = [];
  csvFile: any = "";
  accessPermission: boolean;
  colors = [
    "#3F51B5",
    "#5363BC",
    "#6876C4",
    "#7C88CB",
    "#5363BC",
    "#6876C4",
    "#7C88CB",
    "#BAC0E1",
    "#CED2E8",
    "#5363BC",
    "#7C88CB",
    "#A5ADDA",
    "#BAC0E1",
    "#CED2E8",
    "#E3E5F0",
    "#F7F7F7",
    "#3F51B5",
    "#5363BC",
    "#6876C4",
    "#7C88CB",
    "#5363BC",
    "#6876C4",
    "#7C88CB",
    "#BAC0E1",
    "#CED2E8",
    "#5363BC",
    "#7C88CB",
    "#A5ADDA",
    "#BAC0E1",
    "#CED2E8",
    "#E3E5F0",
    "#F7F7F7",
  ];

  constructor(
    public _access: AccessServiceService,
    public dialog: MatDialog,
    public _snackBar: MatSnackBar,
    public api: CommonServiceService,
    public ngxService: NgxUiLoaderService,
    public snackBar: MatSnackBar
  ) {
    this.accessPermission = this._access.getRouteAccess(
      "User roles",
      JSON.parse(localStorage.getItem("userData")).moduleAccess
    );
  }

  ngOnInit(): void {
    //getting access permission

    this.getList();
    this.getGraphData();
    this.getTopRedeemGraphData();
    this.getRedeemGraphData();
  }

  // Get Department
  async getList() {
    this.ngxService.start();
    await this.api.listReward().subscribe(
      (res) => {
        this.ngxService.stop();
        const response: any = res;
        if (response.success == true) {

          console.log(response.data)

          response.data.forEach((el: any) => {
            if (!el.reward_Image.startsWith("http")) {
              console.log(el)
              el.reward_Image = environment.apiBaseUrl + "" + el.reward_Image;
            }
            //el.reward_Image.split('://')
          });

          this.dataSource = new MatTableDataSource([...response.data]);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        } else {
          // this.openErrrorSnackBar(response.message);
        }
        console.log(res);
      },
      (err) => {
        const error = err.error;
        this.ngxService.stop();
        // this.openErrrorSnackBar(error.message);
      }
    );
  }

  // Get Graph Data
  async getGraphData() {
    this.ngxService.start();
    await (this.api.graphReward({
      "company_Id": JSON.parse(localStorage.getItem('userData')).company_id
    }).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        let respData = response.data;
        let Department: any = [];
        let DepartmentCount: any = [];
        let graphMale = 0;
        let graphFemale = 0;
        for (let item of respData) {
          graphMale += item.male;
          graphFemale += item.female
          for (let dep of item.DepartmentnewArray ? item.DepartmentnewArray : []) {
            let index = Department.findIndex(subDep => subDep == dep.department)
            if (index > -1) {
              DepartmentCount[index] += dep.count;
            } else {
              Department.push(dep.department)
              DepartmentCount.push(dep.count)
            }
          }
        }
        let isDeptExist = JSON.stringify({ label: Department, percentage: DepartmentCount, colors: this.colors, dataName: "Rewards", width: 300 })
        let isGenExist = JSON.stringify({ label: ['Male', 'Female'], percentage: [graphMale, graphFemale], colors: ['#3F51B5', '#576DE6'], dataName: "Points", width: 300 })


        let isDeptParticipant = (Department.length === 0 && DepartmentCount.length === 0)
        let isGenderParticipant = (graphMale === 0 && graphFemale === 0)

        this.graphData = (isDeptParticipant) ? "" : isGenExist;
        this.departmentGraph = (isGenderParticipant) ? "" : isDeptExist;

      } else {
        // this.openErrrorSnackBar(response.message);
      }
      console.log(res);
    }, err => {
      const error = err.error;
      this.ngxService.stop();
      // this.openErrrorSnackBar(error.message);
    }));
  }

  // Get Graph Data
  async getTopRedeemGraphData() {
    this.ngxService.start();
    await this.api
      .graphTopRedeemReward({
        company_Id: 0,
      })
      .subscribe(
        (res) => {
          this.ngxService.stop();
          const response: any = res;
          if (response.success == true) {
            let respData = response.data;
            let label = [];
            let point = [];
            let color = [];
            for (let item of respData) {
              label.push(item.reward_Name);
              point.push(item.redeem_Point);
              color.push("#FFAA00");
            }
            this.redeemRewardGraph = JSON.stringify({
              label: label,
              percentage: point,
              colors: color,
            });
          } else {
            // this.openErrrorSnackBar(response.message);
          }
          console.log(res);
        },
        (err) => {
          const error = err.error;
          this.ngxService.stop();
          // this.openErrrorSnackBar(error.message);
        }
      );
  }

  // Get Graph Data
  async getRedeemGraphData() {
    this.ngxService.start();
    await this.api
      .graphRedeemReward({
        company_Id: 0,
      })
      .subscribe(
        (res) => {
          this.ngxService.stop();
          const response: any = res;
          if (response.success == true) {
            let respData = response.data;
            let label = [];
            let point = [];
            let point1 = [];
            let color = [];
            let color1 = [];
            for (let item of respData) {
              label.push(item.month);
              point.push(item.reward_Number);
              point1.push(item.reward_point);
              color.push("#008cf8");
              color1.push("#f8007c");
            }
            this.redeemLineChart = JSON.stringify({
              label: label,
              percentage: point,
              colors: color,
            });
            this.pointsLineChart = JSON.stringify({
              label: label,
              percentage: point1,
              colors: color1,
            });
          } else {
            // this.openErrrorSnackBar(response.message);
          }
          console.log(res);
        },
        (err) => {
          const error = err.error;
          this.ngxService.stop();
          // this.openErrrorSnackBar(error.message);
        }
      );
  }

  // Delete Reward
  async deleteReward(id) {
    this.ngxService.start();
    let formData = {
      reward_id: id,
      company_Id: 0,
      ip_Address: "12.23.233.222",
    };
    await this.api.deleteReward(formData).subscribe(
      (res) => {
        this.ngxService.stop();
        const response: any = res;
        if (response.success == true) {
          this.openSnackBar(response.message);
          this.getList();
        } else {
          this.openErrrorSnackBar(response.message);

          this.getList();
        }

        console.log(res);
      },
      (err) => {
        this.getList();
        const error = err.error;
        this.openErrrorSnackBar(error.message);
        this.ngxService.stop();
      }
    );
  }

  // Update Reward status
  async updateRewardStatus(id, status) {
    this.ngxService.start();
    let formData = {
      reward_id: id,
      status: Number(status),
      ip_Address: "12.23.22.22",
      company_Id: 0,
    };
    await this.api.statusReward(formData).subscribe(
      (res) => {
        this.ngxService.stop();
        const response: any = res;
        if (response.success == true) {
          this.openSnackBar(response.message);
          this.getList();
        } else {
          this.openErrrorSnackBar(response.message);
        }

        console.log(res);
      },
      (err) => {
        const error = err.error;
        this.openErrrorSnackBar(error.message);
        this.ngxService.stop();
      }
    );
  }

  // confirm message
  confirmDialog(id): void {
    const message = `Are you sure you want to delete this?`;

    const dialogData = new ConfirmDialogModel("Confirm Action", message);

    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      maxWidth: "400px",
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        this.deleteReward(id);
      }
      else {
        this.getList()
      }
    });
  }

  //Searching
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // alert message after api response success
  openSnackBar(msg) {
    this._snackBar.open(msg, "Ok", {
      duration: 3000,
      horizontalPosition: "right",
      verticalPosition: "top",
      panelClass: ["success-alert"],
    });
  }
  // alert message after api response failure
  openErrrorSnackBar(msg) {
    this._snackBar.open(msg, "Ok", {
      duration: 3000,
      horizontalPosition: "right",
      verticalPosition: "top",
      panelClass: ["failure-alert"],
    });
  }
}
