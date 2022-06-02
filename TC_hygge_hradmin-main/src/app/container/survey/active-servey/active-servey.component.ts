import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { environment } from '../../../../environments/environment';
import jsPDF from 'jspdf';
import domtoimage from 'dom-to-image'
import * as _moment from 'moment';
import {
  MatSnackBar
} from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AccessServiceService } from 'src/app/service/access-service.service';
import { Router } from '@angular/router';
import { ViewSurveyComponent } from '../view-survey/view-survey.component';
@Component({
  selector: 'app-active-servey',
  templateUrl: './active-servey.component.html',
  styleUrls: ['./active-servey.component.scss']
})
export class ActiveServeyComponent implements OnInit {
downloadPdfHide = true;
// set header column
displayedColumns: string[] = ['profile_picture', 'name', 'email',  'attemptedQuestion', 'action'];

//set static data for table
dataSource = new MatTableDataSource([]);

// table sorting and pagination
@ViewChild(MatPaginator,{static:false}) paginator: MatPaginator;
@ViewChild(MatSort,{static:false}) sort: MatSort;

filePath = environment.apiBaseUrl
responseData:any = [];
csvFile:any = '';
newRequest:number = 0;
accessPermission:boolean;
userList:any= []
graphData:any
formData = {
  companyId:"",
  surveyQuestionsId:null
}

constructor(public router:Router, public _access:AccessServiceService, public dialog: MatDialog, public _api: CommonServiceService, public ngxService: NgxUiLoaderService, public _snackBar: MatSnackBar) { }

ngOnInit(): void {
  let url  = this.router.url.split('/')
  this.formData.surveyQuestionsId = parseInt(url.pop());
  this.formData.companyId = JSON.parse(localStorage.getItem('userData')).company_id;
//getting access permission
  this.accessPermission = this._access.getRouteAccess('User roles',JSON.parse(localStorage.getItem('userData')).moduleAccess);
  this.getList();
}

// Get Leave List
async getList(){
this.ngxService.start();
await(this._api.surveyDetail(this.formData).subscribe(res => {
  this.ngxService.stop();
  const response: any = res;
  if (response.success == true){

    this.responseData = response.data[0];
      console.log(Date.parse(_moment(this.responseData.survey_ExpiryDate).format('LLLL')), Date.parse(_moment().format('LLLL')))
       if(((Date.parse(_moment(this.responseData.survey_ExpiryDate).format('LLLL'))) - Date.parse(_moment().format('LLLL'))) < 864000000 && (Date.parse(this.responseData.survey_ExpiryDate) - Date.parse(_moment().format('LLLL'))) > 0){
        this.responseData.expiry = 'current';
        this.responseData.survey_ExpiryDate = ((Date.parse(_moment(this.responseData.survey_ExpiryDate).format('LLLL'))) - Date.parse(_moment().format('LLLL')))
      }else if(Date.parse(this.responseData.survey_ExpiryDate) <= Date.parse(_moment().format())){
        this.responseData.expiry = 'expired'

      }else{
        this.responseData.expiry = 'remain'
        this.responseData.survey_ExpiryDate = _moment(this.responseData.survey_ExpiryDate).format('DD MMM  YYYY')
      }
      this.graphData = JSON.stringify({label:['Attempt','Not Attempt'],percentage:[this.responseData.totalUserAttempted,this.responseData.totalQuestion - this.responseData.totalUserAttempted],colors:['#15C1DC','#FF6384']})
    this.dataSource = new MatTableDataSource([...this.responseData.user]);
    this.userList = this.responseData.user;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    console.log(this.dataSource);
  }else{
    this.openErrrorSnackBar('This survery has no user')
    this.router.navigate(['/survey-list'])
  }
  console.log(res);
}, err => {
  const error = err.error;
  this.ngxService.stop();
  this.openErrrorSnackBar('This survery has no user')
  this.router.navigate(['/survey-list'])
}));

}

// send reinder to user
async reminderSurvey(id){
  let formData = {
    "companyId":JSON.parse(localStorage.getItem('userData')).company_id,
    "surveyTypeId":id
    }
  this.ngxService.start();
  await(this._api.reminderAllUserSurvey(formData).subscribe(res => {
    this.ngxService.stop();
    const response: any = res;
    if (response.success == true){
      this.openSnackBar(response.message)
    }else{
      this.openErrrorSnackBar(response.message)
    }
    console.log(res);
  }, err => {
    const error = err.error;
    this.openErrrorSnackBar(error)
    this.ngxService.stop();
  }));

  }
// send reinder to user
async reminderByUSerSurvey(id){
  let formData = {
    "companyId":JSON.parse(localStorage.getItem('userData')).company_id,
    "userId":id,
    "surveyTypeId":this.formData.surveyQuestionsId
    }
  this.ngxService.start();
  await(this._api.reminderByUSerSurvey(formData).subscribe(res => {
    this.ngxService.stop();
    const response: any = res;
    if (response.success == true){
      this.openSnackBar(response.message)
    }else{
      this.openErrrorSnackBar(response.message)
    }
    console.log(res);
  }, err => {
    const error = err.error;
    this.openErrrorSnackBar(error)
    this.ngxService.stop();
  }));

  }

// get survery qustion by id
async openSurveyQuestion(){
  let formData = {
    "companyId":JSON.parse(localStorage.getItem('userData')).company_id,
    "surveyTypeId":this.formData.surveyQuestionsId
    }
  this.ngxService.start();
  await(this._api.getSurveryQuestion(formData).subscribe(res => {
    this.ngxService.stop();
    const response: any = res;
    if (response.success == true){
      console.log(response.data)
      const dialogRef = this.dialog.open(ViewSurveyComponent,{
        width: '90%',
        height:'90%',
        data:{
          hraP:JSON.stringify(response.data),
          formName:this.responseData.survey_Name,
          formDescription:this.responseData.survey_Description
        }
      },
      );

      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
        // this.getRole();
      });
    }else{
      this.openErrrorSnackBar(response.message)
    }
    console.log(res);
  }, err => {
    const error = err.error;
    this.openErrrorSnackBar(error)
    this.ngxService.stop();
  }));

  }

// end surey
async endSurvey(id){
  let formData = {
    "companyId":JSON.parse(localStorage.getItem('userData')).company_id,
    "initiateSurvey_id":id
    }
  this.ngxService.start();
  await(this._api.endSurvey(formData).subscribe(res => {
    this.ngxService.stop();
    const response: any = res;
    if (response.success == true){
      this.openSnackBar(response.message)
    }else{
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
applyFilter(event: Event){
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
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

  currentTime(){
    return _moment().format('hh : mm : ss')
  }


   async downloadPDF(){

  this.ngxService.start();
    document.getElementById('table_pdf').style.display = 'table';
    this.downloadPdfHide = false;
    var node = document.getElementById('main');
    var img;
    var filename;
    var newImage;
     await domtoimage.toPng(node, { bgcolor: '#fff' }).then(async (dataUrl)=> {
      img = new Image();
      img.src = dataUrl;
      newImage = img.src;
      img.onload = async () =>{
      var pdfWidth = img.width;
      var pdfHeight = img.height;

      // FileSaver.saveAs(dataUrl, 'my-pdfimage.png'); // Save as Image
      var doc;

      if(pdfWidth > pdfHeight)
      {
        doc = new jsPDF('l', 'px', [pdfWidth , pdfHeight]);
      }
      else
      {
        doc = new jsPDF('p', 'px', [pdfWidth , pdfHeight]);
      }


      var width = doc.internal.pageSize.getWidth();
      var height = doc.internal.pageSize.getHeight();


      await doc.addImage(newImage, 'PNG',  10, 10, width, height);
      filename = 'Survey_Report' + '.pdf';
      doc.save(filename);
    };

  })
  .catch(function(error) {



  });

  this.ngxService.stop();
  this.downloadPdfHide = true
  document.getElementById('table_pdf').style.display = 'none';


}

}
