import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import * as moment from 'moment';
import { PayslipOneComponent } from '../payslip-one/payslip-one.component';
import { Router } from '@angular/router';
import { PayslipTwoComponent } from '../payslip-two/payslip-two.component';
import { PayslipThreeComponent } from '../payslip-three/payslip-three.component';
import { PayslipFourComponent } from '../payslip-four/payslip-four.component';
import { PayslipFiveComponent } from '../payslip-five/payslip-five.component';
import { PayslipSixComponent } from '../payslip-six/payslip-six.component';

@Component({
  selector: 'app-payslip-generate',
  templateUrl: './payslip-generate.component.html',
  styleUrls: ['./payslip-generate.component.scss']
})
export class PayslipGenerateComponent implements OnInit {
  @ViewChild(PayslipOneComponent) payslipeone:PayslipOneComponent;

  @ViewChild(PayslipTwoComponent) payslipetwo:PayslipTwoComponent;

  @ViewChild(PayslipThreeComponent) payslipethree:PayslipThreeComponent;

  @ViewChild(PayslipFourComponent) payslipefour:PayslipFourComponent;

  @ViewChild(PayslipFiveComponent) payslipefive:PayslipFiveComponent;

  @ViewChild(PayslipSixComponent) payslipesix:PayslipSixComponent;

  @ViewChild('screen') screen: ElementRef;
  data={
    address:true,
    department:true,
    designation:true,
    passport:true,
    template:true,
    count:0
  }
  departmentData:any = [];
  employeeData :any;
  payslipNo = 0;
  responseData:any = [];
  salarySlipId = 1000;
  constructor(public router:Router, public _api: CommonServiceService, public ngxService: NgxUiLoaderService, public _snackBar: MatSnackBar) {

   }

  ngOnInit(): void {
    this.getDepartment();
    this.getPayslipId()
    this.getList()
    this.getEmployeeList()
    this.getSelectedPayslip();
  }



// Get Department
async getDepartment(){
  this.ngxService.start();
  await(this._api.showDepartment().subscribe(res => {
    this.ngxService.stop();
    const response: any = res;
    if (response.success == true){
      this.departmentData = response.data;
    }else{
      this.openErrrorSnackBar(response.message);
    }
    console.log(res);
  },err => {
    const error = err.error;
    this.ngxService.stop();
    this.openErrrorSnackBar(error.message);
  }));
}

// Get getSelectedPayslip
async getSelectedPayslip(){
  this.ngxService.start();
  let data = {
    "isType":"1",
    "companyId":JSON.parse(localStorage.getItem('userData')).company_id,
    "salary_TemplateID":"0"
  }
  await(this._api.showPaySliptemplate(data).subscribe(res => {
    this.ngxService.stop();
    const response: any = res;
    if (response.success == true){
      this.payslipNo = response.data;
    }else{
    }
    console.log(res);
  }, err => {
    const error = err.error;
    this.ngxService.stop();
  }));

}

  //Get last payslip id
  async getPayslipId(){
    this.ngxService.start();
    await(this._api.showLastPaySlipId().subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true){
        this.salarySlipId = parseInt(response.data)
      }else{
      }
      console.log(res);
    }, err => {
      const error = err.error;
      this.ngxService.stop();
    }));
  }

  // Get compansation List
  async getList(){
    this.ngxService.start();
    await(this._api.compensationTemplate().subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true){
        console.log(response.data);
        this.responseData = response.data[0];
        this.data.department = this.responseData.department == 1?true:false;
        this.data.designation = this.responseData.designation == 1?true:false;
        this.data.passport = this.responseData.passport == 1?true:false;
        this.data.address = this.responseData.workLocation == 1?true:false;
        this.data.template = this.responseData.templateId == 1?true:false;
      }else{
      }
      console.log(res);
    }, err => {
      const error = err.error;
      this.ngxService.stop();
    }));

  }

  // Get Employee List
async getEmployeeList(){
  this.ngxService.start();
  await(this._api.getEmployee().subscribe(res => {
    const response: any = res;
    if (response.success == true){
      console.log(response.data);
      let arr = []
      for(let item of response.data){
        if(item.status == 1){
          arr.push(item)
        }
      }
      this.responseData = arr;
      for(let item of this.responseData){
        let total = 0
        let salAr = [];
        if(item.salaryBalance != null){
          let sal = JSON.parse(item.salaryBalance)
          for(let i =0;i< sal.length;i++){
            for (var key in sal[i]) {
              salAr.push({label:key,value:sal[i][key]})
              total+= parseInt(sal[i][key]);
            }
          }
        }

        item['salary'] =  isNaN(total)?0:total;
        item['salaryArray'] = salAr;
      }
      // this.generateSlip()
    }else{

    this.ngxService.stop();
    }
    console.log(res);

  }, err => {
    const error = err.error;
    this.ngxService.stop();
  }));

}
async generateSlip(){

  if(this.responseData){
   for(let item of this.responseData) {
      this.ngxService.start();
      if(this.payslipNo == 1){
        this.data.count = await this.payslipeone.getCount();
      }else if(this.payslipNo == 2){
        this.data.count = await this.payslipetwo.getCount();
      }else if(this.payslipNo == 3){
        this.data.count = await this.payslipethree.getCount();
      }else if(this.payslipNo == 4){
        this.data.count = await this.payslipefour.getCount();
      }else if(this.payslipNo == 5){
        this.data.count = await this.payslipefive.getCount();
      }else if(this.payslipNo == 6){
        this.data.count = await this.payslipesix.getCount();
      }
      let userDetail = [];
      this.salarySlipId+= 1;
      let name = item.first_name+' '+item.last_name;
      userDetail.push({key:'name',value:name})
      userDetail.push({key:'dateOfJoining',value:item.employee_joiningDate})
      this.data.department && userDetail.push({key:'department',value:item.department})
      this.data.designation && userDetail.push({key:'designation',value:item.designation})
      this.data.address && userDetail.push({key:'workLocation',value:''})
      this.data.passport && userDetail.push({key:'passport',value:item.passport})
      let obj = {
        "userId":item.user_id,
        "userDetail":userDetail,
        "userEarning":item.salaryArray,
        "userDeduction":[],
        "paySlipId":this.salarySlipId,
        "netSalary":item.salary,
        "salaryDate":moment().format('MM-DD-YYYY'),
        "department":item.department,
        "ip_Address":"12.32.33.22",
        "companyId":JSON.parse(localStorage.getItem('userData')).company_id,
        "departmentID":this.departmentData.filter(dp => dp.department_Type == item.department)[0].department_id,
        "paySlipImage":await html2canvas(this.screen.nativeElement).then(canvas => {
          return canvas.toDataURL();
        })
      }
      console.log(obj.paySlipImage)
      console.log(this.data.count , this.responseData.length)
      let subscription = await(this._api.addPatSlip(obj).subscribe( async res => {
        const response: any = res;
        if (response.success == true){

          if(this.data.count >= this.responseData.length){

            this.openSnackBar('Salary slips generated successfully');
            this.ngxService.stop();
            this.router.navigate(['/employee-salary'])
          }
        }else{
          this.openErrrorSnackBar(response.msg)
          return;
        }
        console.log(res);
      }, err => {
        const error = err.error;
        subscription.unsubscribe()
        this.ngxService.stop();
        if(this.data.count >= this.responseData.length){
          this.openErrrorSnackBar('Something Went wrong please try again');
          this.ngxService.stop();
          this.router.navigate(['/employee-salary'])
        }
      }));
    };

  }
}
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
