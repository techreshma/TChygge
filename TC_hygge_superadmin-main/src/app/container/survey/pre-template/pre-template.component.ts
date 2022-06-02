import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonServiceService } from 'src/app/service/comman-service.service';

@Component({
  selector: 'app-pre-template',
  templateUrl: './pre-template.component.html',
  styleUrls: ['./pre-template.component.scss']
})
export class PreTemplateComponent implements OnInit {

  constructor(public _api: CommonServiceService, public ngxService: NgxUiLoaderService) { }
  responseData:any = [];
  surveyName:any;
  surveyDescription:any;
  ngOnInit(): void {
    this.getList();
  }

  // Get Leave List
  async getList(){
  this.ngxService.start();
  await(this._api.templates().subscribe(res => {
    this.ngxService.stop();
    const response: any = res;
    if (response.success == true){
      this.responseData = response.data;

    }else{
    }
    console.log(res);
  }, err => {
    const error = err.error;
    this.ngxService.stop();
  }));

  }

}
