import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import { ViewSurveyComponent } from '../view-survey/view-survey.component';

@Component({
  selector: 'app-add-survey',
  templateUrl: './add-survey.component.html',
  styleUrls: ['./add-survey.component.scss']
})
export class AddSurveyComponent implements OnInit {
  value ={};
  segmentData:any = [];
  formName ='';
  formDescription = '';


  question = [
    {
      "survey_Type":"",
      "survey_Title":"",
      "survey_Description":"",
      "survey_OptionArray":[{"value":""}],
      "survey_SubQuestion":[],
      "survey_SliderOption":{"left":0,"label":'',"right":100},
      "survey_Answer":"",
      "survey_ColumnArray": [],
      "survey_RowArray": [],
      "isRequired":0,
      "ip_Address" :"12.443.22.11",
      dependentQuestionId:0,
      questionId:Math.floor(10000000 + Math.random() * 90000000),
      dependentOption:[],
      parentOption:[],
    }
  ];
  qeustionType = [
    { label:'Rating',value:'rating'},
    { label:'Drop Down',value:'dropdown'},
    { label:'Radio Button',value:'radio'},
    { label:'Slider',value:'slider'},
    { label:'Open Ended',value:'textarea'},
    { label:'Multiple Choice',value:'multiSelect'},
    { label:'Matrix/Linkert',value:'matrix'},
    { label:'Text Box',value:'text'}
  ]
  disTab = true;
  id:any;
  preId:any;
  constructor(public route:ActivatedRoute, public router:Router , public dialog: MatDialog, public _api: CommonServiceService, public ngxService: NgxUiLoaderService, public _snackBar: MatSnackBar ) {

  this.id = this.route.snapshot.params.id;
  this.preId = this.route.snapshot.params.preid;
}

ngOnInit(): void {
  if(this.id){
    this.openSurveyQuestion()
  }
  if(this.preId){
    this.openPreSurveyQuestion()
  }
}
// get survery qustion by id
async openPreSurveyQuestion(){
let formData = {
  "surveytemplate_Id":this.preId
  }
this.ngxService.start();
await(this._api.getTemplateQuestions(formData).subscribe(res => {
  this.ngxService.stop();
  const response: any = res;
  if (response.success == true){
    console.log(response.data)
    for(let item of response.data){
      item.survey_ColumnArray = item.survey_ColumnArray?JSON.parse(item.survey_ColumnArray):[];
      item.survey_OptionArray = item.survey_OptionArray?JSON.parse(item.survey_OptionArray):[];
      item.survey_RowArray = item.survey_RowArray?JSON.parse(item.survey_RowArray):[];
      item.survey_SliderOption = item.survey_SliderOption?JSON.parse(item.survey_SliderOption):[];
      item.survey_SubQuestion = item.survey_SubQuestion?JSON.parse(item.survey_SubQuestion):[]
      item.survey_Type = item.type && item.type.toLowerCase()
      item.questionId = Math.floor(10000000 + Math.random() * 90000000)
    }

    this.question = response.data;
    this.formName = response.templateName;
    this.formDescription = this.question.length > 0 && this.question[0].survey_Description;
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

async openSurveyQuestion(){
let formData = {
  "companyId":0,
  "surveyTypeId":this.id
  }
this.ngxService.start();
await(this._api.getSurveryQuestion(formData).subscribe(res => {
  this.ngxService.stop();
  const response: any = res;
  if (response.success == true){
    console.log(response.data)
    if(response.data.length > 0){
      this.question = []
      for(let item of response.data){
        item.survey_ColumnArray = JSON.parse(item.survey_ColumnArray);
        item.survey_OptionArray = JSON.parse(item.survey_OptionArray);
        item.survey_RowArray = JSON.parse(item.survey_RowArray);
        item.survey_SliderOption = JSON.parse(item.survey_SliderOption);
        item.survey_SubQuestion = JSON.parse(item.survey_SubQuestion)
      }

      this.question = response.data;
      this.formName = response.data.length > 0 && response.data[0].survey_Name;
      this.formDescription = response.data.length > 0 && response.data[0].survey_Description;
    }
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


  next() {
        this.question.push({
          "survey_Type":"",
          "survey_Title":"",
          "survey_Description":"",
          "survey_OptionArray":[{"value":""}],
          "survey_SubQuestion":[],
          "survey_SliderOption":{"left":0,"label":'',"right":100},
          "survey_Answer":"",
          "survey_ColumnArray": [],
          "survey_RowArray": [],
          "isRequired":0,
          "ip_Address" :"12.443.22.11",
          dependentQuestionId:0,
          questionId:Math.floor(10000000 + Math.random() * 90000000),
          dependentOption:[],
          parentOption:[],
        })
  }

  ///get parent otpions
  getParentIds(e){
    console.log(e)
    for(let item of this.question){
      if(item.questionId == e){
        this.question[this.question.length - 1].parentOption = item.survey_OptionArray
      }
    }
  }

  // add question
  async addHra(){
    let  q = this.question[this.question.length - 1]
    if(this.formName == '' || this.formDescription == ''  ){
      this.openErrrorSnackBar('Please fill all field to move to next question');
    }else{
      for(let item of this.question){
        if(!item.survey_Answer)
        item['survey_Answer'] = ''
      }
     let formData =  {
        "survey_Name":this.formName,
        "survey_Description":this.formDescription,
        "userId":JSON.parse(localStorage.getItem('userData')).user_id,
        "companyId":JSON.parse(localStorage.getItem('userData')).company_id,
        "questionArray":this.question
        }
      this.ngxService.start();
      await(this._api.addSurveyQuestion(formData).subscribe(res => {
        this.ngxService.stop();
        const response: any = res;
        if (response.success == true){
          this.openSnackBar(response.message);
          this.router.navigate(['/survey-initiate']);
        }else{
          this.openErrrorSnackBar(response.message);
        }
        console.log(res);
      }, err => {
        const error = err.error;
        this.openErrrorSnackBar(error.message);
        this.ngxService.stop();
      }));
    }
  }

  addOption(i){
    this.question[i].survey_OptionArray.push({value:''})
  }

  removeOption(i,io){
    this.question[i].survey_OptionArray.splice(io,1);
  }

  addColumn(i){
    this.value = { label: "" };
    this.question[i].survey_ColumnArray.push(this.value)

  }

  removeColumn(i, idx) {
    this.question[i].survey_ColumnArray.splice(idx, 1)

  }

  addRow(i) {
    this.question[i].survey_RowArray.push({ title: "" })
    if(this.question[i].survey_ColumnArray.length == 0){
      this.question[i].survey_ColumnArray.push({ label: "" })
    }
  }

  removeRow(i, rawIndex) {
    this.question[i].survey_RowArray.splice(rawIndex, 1)
    if(this.question[i].survey_RowArray.length == 0){
      this.question[i].survey_ColumnArray = [];
    }
  }



  // copy code
  copy(i){
    let obj = this.question[i];
    this.question.push(obj);
  }

  // delete question
  delete(i){
    this.question.splice(i,1);
  }



  changeRequired(e,i){
    console.log(e)
    if(e.checked){
      this.question[i].isRequired = 1
    }else{
      this.question[i].isRequired = 0
    }
  }

// open hra question preview modal
openPreviewModal() {
  const dialogRef = this.dialog.open(ViewSurveyComponent,{
    width: '90%',
    height:'90%',
    data:{
      hraP:JSON.stringify(this.question),
      formName:this.formName,
      formDescription:this.formDescription
    }
  },
  );

  dialogRef.afterClosed().subscribe(result => {
    console.log(`Dialog result: ${result}`);
    // this.getRole();
  });
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
