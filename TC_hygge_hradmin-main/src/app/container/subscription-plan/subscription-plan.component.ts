import { Component, OnInit } from '@angular/core';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatSnackBar} from '@angular/material/snack-bar';



@Component({
  selector: 'app-company-profile',
  templateUrl: './subscription-plan.component.html',
  styleUrls: ['./subscription-plan.component.scss']
})
export class SubscriptionPlanComponent implements OnInit {
  files: File[] = [];
  faqData:any;
  privacyPolicyData:any;
  themeDataSet:any;
  smtpDataSet:any;

  constructor(public _api: CommonServiceService, public ngxService: NgxUiLoaderService, public _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getData()
  }

  async getData(){
    this.ngxService.start();
    await(this._api.showData().subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true){
        this.privacyPolicyData = response.data;
        console.log(this.privacyPolicyData)
        this.openSnackBar(response.message);
      }else{
        this.openSnackBar(response.message);
      }
      console.log(res);
    },err => {
      const error = err.error;
      this.ngxService.stop();
      this.openSnackBar(error.message);
    }));

}

openSnackBar(msg) {
  this._snackBar.open(msg, 'Ok', {
    duration: 3000,
    horizontalPosition: 'right',
    verticalPosition: 'top',
  });
}

}
