import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonServiceService } from 'src/app/service/comman-service.service';

@Component({
  selector: 'app-my-coach',
  templateUrl: './my-coach.component.html',
  styleUrls: ['./my-coach.component.scss']
})
export class MyCoachComponent implements OnInit {
  list:any = [];
  constructor(public _api: CommonServiceService, public ngxService: NgxUiLoaderService) { }

  ngOnInit(): void {
    this.getList()
  }
// cateogory list
async getList(){
  this.ngxService.start();
  await(this._api.coachingCategory().subscribe(res => {
    this.ngxService.stop();
    const response: any = res;
    if (response.success == true){
      this.list = response.data
    }else{
    }
    console.log(res);
  }, err => {
    const error = err.error;
    this.ngxService.stop();
  }));
}
}
