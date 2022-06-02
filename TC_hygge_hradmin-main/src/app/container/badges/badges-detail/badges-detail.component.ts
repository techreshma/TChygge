import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-badges-detail',
  templateUrl: './badges-detail.component.html',
  styleUrls: ['./badges-detail.component.scss']
})
export class BadgesDetailComponent implements OnInit {
  url:any;
  detail:any;
  displayedColumns: string[] = ['position','employee_Name', 'company_Name', 'redemption_Date'];
  dataSource = new MatTableDataSource([]);
  imgPath = environment.apiBaseUrl
  constructor(public router:Router,public _api: CommonServiceService, public ngxService: NgxUiLoaderService) { }

  ngOnInit(): void {
    this.url = this.router.url.split('/').pop();
    this.getList()
  }
 // cateogory list
 async getList(){
  this.ngxService.start();
  await(this._api.badgesList().subscribe(res => {
    this.ngxService.stop();
    const response: any = res;
    if (response.success == true){
      this.detail = (response.data.filter(item => item.badges_id == this.url))[0]
      console.log
    }else{
    }
    console.log(res);
  }, err => {
    const error = err.error;
    this.ngxService.stop();
  }));
}

}
