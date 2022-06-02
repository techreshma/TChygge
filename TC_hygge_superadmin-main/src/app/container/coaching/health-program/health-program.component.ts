import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-health-program',
  templateUrl: './health-program.component.html',
  styleUrls: ['./health-program.component.scss']
})
export class HealthProgramComponent implements OnInit {
  list: any = [];
  imgPath = environment.apiBaseUrl
  constructor(public router: Router, public _api: CommonServiceService, public ngxService: NgxUiLoaderService) { }

  ngOnInit(): void {
    this.getList()
  }
  // cateogory list
  async getList() {
    this.ngxService.start();
    await (this._api.getHealthCategory().subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        this.list = response.data
        console.log(this.list)
      } else {
      }
    }, err => {
      const error = err.error;
      this.ngxService.stop();
    }));
  }
}
