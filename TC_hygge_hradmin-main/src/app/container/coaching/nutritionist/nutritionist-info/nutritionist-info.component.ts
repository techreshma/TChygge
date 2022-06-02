import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { environment } from '../../../../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AccessServiceService } from 'src/app/service/access-service.service';
import { ActivatedRoute } from '@angular/router';
import { ConfirmBoxComponent, ConfirmDialogModel } from 'src/app/confirm-box/confirm-box.component';
import * as _moment from 'moment';

@Component({
  selector: 'app-nutritionist-info',
  templateUrl: './nutritionist-info.component.html',
  styleUrls: ['./nutritionist-info.component.scss'],
})

export class NutritionistInfoComponent implements OnInit {
  // set header column
  displayedColumns: string[] = ['srno', 'fact_title', 'views', 'likes', 'dislikes', 'status', 'action'];

  //set static data for table
  dataSource = new MatTableDataSource([]);

  // Table sorting and pagination
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  filePath = environment.apiBaseUrl
  responseData: any = [];
  csvFile: any = '';
  newRequest: number = 0;
  accessPermission: boolean;
  formData = {
    "companyId": 0,
  }
  catId: number
  graphData: any
  titlePage: any;
  totalView = 0;
  totalLike = 0;
  totalDisLike = 0;
  toggle_variable = false;

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
  likeDislikeViewGraphChart: any;
  tdId: number;

  constructor(public route: ActivatedRoute, public _access: AccessServiceService, public dialog: MatDialog, public _api: CommonServiceService, public ngxService: NgxUiLoaderService, public _snackBar: MatSnackBar) {
    this.catId = this.route.snapshot.params.id;
    if (this.catId == 4) {
      this.titlePage = 'Nutritional Information'
    } else if (this.catId == 5) {
      this.titlePage = 'Smart Tips and Guidelines'
    } else if (this.catId == 6) {
      this.titlePage = 'Food Plate Method Eating'
    }
  }

  ngOnInit(): void {
    //getting access permission
    this.accessPermission = this._access.getRouteAccess('User roles', JSON.parse(localStorage.getItem('userData')).moduleAccess);
    this.getList();
  }

  // Get Leave List
  async getList() {
    let formGroup = {
      "coachingcat_Id": this.catId
    }
    this.ngxService.start();
    await (this._api.factList(formGroup).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        this.responseData = response.data;
        //Here we convert array into object //ViewArr
        let likeDislikeView: any = {}
        this.responseData.likeDislikeViewArr.forEach((element: any) => {
          likeDislikeView = element
        })

        this.totalView = likeDislikeView.TotalViews;
        this.totalLike = likeDislikeView.TotalLikes;
        this.totalDisLike = likeDislikeView.TotalDislikes;

        //Here we can check wheater object belongs to catId 4 or not
        let percentageArray = (this.catId == 4) ?
          [
            { name: 'Like', data: this.responseData.TotalLikeCountByYear.map((item: any) => item.totalLikeCount) },
            { name: 'Dislike', data: this.responseData.TotalDislikesByYear.map((item: any) => item.totalDislikeCount) },
            { name: 'View', data: this.responseData.TotalViewCountByYear.map((item: any) => item.TotalViewCount) }
          ] :
          [
            { name: 'View', data: this.responseData.TotalViewCountByYear.map((item: any) => item.TotalViewCount) }
          ]

        //Set Graph record  
        this.likeDislikeViewGraphChart = JSON.stringify({
          label: this.responseData.TotalDislikesByYear.map((item: any) => item["YEAR"]),
          percentage: percentageArray,
          colors: ['#0190FF', '#ff9b44'],
          height: 250,
          seriesType: true
        });

        let displayViewInChart: any = this.totalView == 0 ? 1 : this.totalView;
        let displayLikeInChart: any = (this.catId > 4) ? 0 : this.totalLike == 0 ? 1 : this.totalLike;
        let displayDislikeInChart: any = (this.catId > 4) ? 0 : this.totalDisLike == 0 ? 1 : this.totalDisLike;

        this.graphData = JSON.stringify(
          {
            label: ['Views', 'Likes', 'Dislikes'],
            percentage: [displayViewInChart, displayLikeInChart, displayDislikeInChart],
            colors: ['#15C1DC', '#FFAA27', '#F44336']
          }
        )

        this.responseData.newArr.forEach((el: any) => {
          el.fact_description = el.fact_description.replace(/<[^>]+>/g, '')
        })

        this.responseData.newArr.forEach((el: any) => {
          el["expandStatus"] = false;
        })

        this.dataSource = new MatTableDataSource([...this.responseData.newArr]);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      } else {
      }
    }, err => {
      const error = err.error;
      this.ngxService.stop();
    }));
  }

  //delete fact
  async deleteFact(id) {
    let formGroup = {
      "coachaddpost_id": id
    }
    this.ngxService.start();
    await (this._api.deletePost(formGroup).subscribe(res => {
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

  toggleFunction(toggle_variable) {
    this.toggle_variable = toggle_variable === false ? true : false;
    console.log(this.toggle_variable)
  }

  async statusUpdate(id, status) {

    let formGroup = {
      "coachaddpost_id": id,
      "status": status
    }
    this.ngxService.start();
    await (this._api.updateStatusPost(formGroup).subscribe(res => {
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
        console.log("Cancel delete")
        this.getList();
      }
    });
  }

  //#region expandContent Function
  expandContent(check: boolean, id: number) {
    this.responseData.newArr.forEach((el: any) => {
      el["expandStatus"] = el.coachaddpost_id == id && check
    })
    console.log(this.responseData)
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