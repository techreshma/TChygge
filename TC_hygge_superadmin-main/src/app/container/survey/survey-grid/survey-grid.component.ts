import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonServiceService } from 'src/app/service/comman-service.service';

@Component({
  selector: 'app-survey-grid',
  templateUrl: './survey-grid.component.html',
  styleUrls: ['./survey-grid.component.scss']
})
export class SurveyGridComponent implements OnInit {

  constructor(public _api: CommonServiceService, public ngxService: NgxUiLoaderService) { }
  responseData: any = [];
  surveyName: any;
  surveyDescription: any;
  ngOnInit(): void {
    this.getList();
  }

  // Get Leave List
  // async getList() {
  //   let formData = {
  //     companyId: JSON.parse(localStorage.getItem('userData')).company_id
  //   }
  //   this.ngxService.start();
  //   await (this._api.activeSurveyList(formData).subscribe(res => {
  //     this.ngxService.stop();
  //     const response: any = res;
  //     if (response.success == true) {
  //       this.responseData = response.data;
  //     } else {
  //     }
  //     console.log(res);
  //   }, err => {
  //     const error = err.error;
  //     this.ngxService.stop();
  //   }));

  // }

  async getList(){
    //copyApastSurveyApi

    this.ngxService.start();
    await (this._api.copyApastSurveyApi().subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
    
       this.responseData = response.data;
      } else {
      }
      console.log(res);
    }, err => {
      const error = err.error;
      this.ngxService.stop();
    }));
  }



}
