import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-report-detail',
  templateUrl: './report-detail.component.html',
  styleUrls: ['./report-detail.component.scss']
})
export class ReportDetailComponent implements OnInit {
  imgPath = environment.apiBaseUrl;
  HraBodyGauge:any;
  HraLifeGauge:any;
  HraMindGauge:any;
  overAllPercetange:any;
  user:object;
  constructor(public router:Router, public _api: CommonServiceService, public ngxService: NgxUiLoaderService, public _snackBar: MatSnackBar) {
    let url = this.router.url.split('/');
    let id = url.pop();
    // this.getHraById(this.id);
    this.getList(id)
  }

  ngOnInit(): void {
  }
// Get HRA detail
async getList(id){
  let formData = {
    "user_Id":id
  }
  this.ngxService.start();
  await(this._api.hraUserDetail(formData).subscribe(res => {
    this.ngxService.stop();
    const response: any = res;
    if (response.success == true){
      this.user = response.data[0].user;
      this.HraBodyGauge = JSON.stringify({label:'',percentage:((response.data[0].body*100)/50).toFixed(2),height:300,color:'pink'})
      this.HraMindGauge = JSON.stringify({label:'',percentage:((response.data[0].lifestyle*100)/30).toFixed(2),height:300})
      this.HraLifeGauge = JSON.stringify({label:'',percentage:((response.data[0].mind*100)/20).toFixed(2),height:300});
      this.overAllPercetange = JSON.stringify({label:'',percentage:(((response.data[0].body + response.data[0].lifestyle + response.data[0].mind)*100)/100).toFixed(2),height:300});;
      console.log(this.overAllPercetange)
    }else{
    }
    console.log(res);
  }, err => {
    const error = err.error;
    this.ngxService.stop();
  }));

  }
}
