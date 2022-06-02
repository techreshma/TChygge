import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { environment } from '../../../../environments/environment';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reward-detail',
  templateUrl: './reward-detail.component.html',
  styleUrls: ['./reward-detail.component.scss'],
})

export class RewardDetailComponent implements OnInit {
  length: number = 100;
  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  pageEvent: PageEvent;

  detail: any;
  // set header column
  displayedColumns: string[] = [
    'position',
    'employee_Name',
    'points_Value',
    'redemption_Date',
  ];

  redeemLineChart: any;
  //set static data for table
  dataSource = new MatTableDataSource([]);

  imgPath = environment.apiBaseUrl;
  // table sorting and pagination
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  constructor(
    public route: ActivatedRoute,
    public dialog: MatDialog,
    public api: CommonServiceService,
    public ngxService: NgxUiLoaderService,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getData();
    this.getList();
    this.getRedeemGraphData();
  }

  paginationChange(e) {
    this.pageEvent = e;
    console.log(this.pageEvent);
  }

  // Get Department
  async getList() {
    this.ngxService.start();
    let formData = {
      reward_id: Number(this.route.snapshot.params.id),
      company_Id: JSON.parse(localStorage.getItem('userData')).company_id,
    };
    await this.api.detailReward(formData).subscribe(
      (res) => {
        this.ngxService.stop();
        const response: any = res;
        if (response.success == true) {
          this.dataSource = new MatTableDataSource(
            response.data.length > 0 ? [...response.data[0].history] : []
          );
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
  async getRedeemGraphData() {
    this.ngxService.start();
    await this.api
      .graphRedeemReward({
        company_Id: JSON.parse(localStorage.getItem('userData')).company_id,
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
              label.push(item.month);
              point.push(item.reward_Number);
              color.push('#56b3fb');
            }
            this.redeemLineChart = JSON.stringify({
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
  // Get Department
  async getData() {
    this.ngxService.start();
    let formData = {
      reward_id: this.route.snapshot.params.id,
      company_Id: JSON.parse(localStorage.getItem('userData')).company_id,
    };
    await this.api.getSingleReward(formData).subscribe(
      (res) => {
        this.ngxService.stop();
        const response: any = res;
        if (response.success == true) {
          this.detail = response.data[0];
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
}
