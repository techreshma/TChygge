import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-goals',
  templateUrl: './goals.component.html',
  styleUrls: ['./goals.component.scss']
})
export class GoalsComponent implements OnInit {
  list:any = [];
  imgPath = environment.apiBaseUrl;
  id:any;
  constructor(public route:ActivatedRoute ,public router:Router,public _api: CommonServiceService, public ngxService: NgxUiLoaderService) {
    this.id = this.route.snapshot.params.id
  }

  
  goalBreadCrum: any = {
    10: "Heart Healthy And Cholesterol",
    11: "Diabetes Management",
    12: "Sleep Management",
    13: "Anti-Inflammatory & Pain Management",
    14: "Energy And Metabolism",
    15: "Weight Loss Program",
    16: "Stress Management Program"
  }

  ngOnInit(): void {
    this.getList()
  }
 // cateogory list
 async getList(){
   let formData = {
    "coachingcat_Id":this.id
  }
  this.ngxService.start();
  await(this._api.getHealthSubCategory(formData).subscribe(res => {
    this.ngxService.stop();
    const response: any = res;
    if (response.success == true){
      for(let item of  response.data){
          item.primeImage = JSON.parse(item.goal_image)[0]
      }
      this.list = response.data
    }else{
    }
    console.log(res);
  }, err => {
    const error = err.error;
    this.ngxService.stop();
  }));
}

getExt(item){
  let ext = item.split('.');
  return ext[1];
}
}
