import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import { isNullOrUndefined } from 'util';
import { HraViewComponent } from '../hra-view/hra-view.component';

@Component({
  selector: 'app-hra-add',
  templateUrl: './hra-add.component.html',
  styleUrls: ['./hra-add.component.scss']
})
export class HraAddComponent implements OnInit {
  tab:number = 0;
  value ={};
  lifeStyleScore = 100;
  bodyScore = 100;
  disLabel:boolean;
  mindScore = 100;
  segmentData:any = [];
  parentOption:any = [];
  questionSelction:any =[];
  data: any;
  question = [
    {
      type:'',
      title:'',
      category:'',
      segments:'',
      description:'',
      optionArray:[{value:'none',point:null}],
      special:[],
      subQuestion:[],
      sliderOption:{left:0,label:'',right:100},
      answer:'',
      columnArray: [],
      rowArray: [],
      score:null,
      isRequired:0,
      dependentQuestionId:0,
      questionId:Math.floor(10000000 + Math.random() * 90000000),
      dependentOption:[],
      parentOption:[],
			"ip_Address"    :"12.443.22.11"
    }
  ];
  qeustionType = [
    { label:'Rating',value:'rating'},
    { label:'Drop Down',value:'dropdown'},
    { label:'Radio Button',value:'radio'},
    { label:'Slider',value:'slider'},
    { label:'Open Ended',value:'textarea'},
    { label:'Multiple Choice',value:'multiSelect'},
    { label:'Text Box',value:'text'}
  ]
  disTab = true;
  constructor(public router:Router , public dialog: MatDialog, public _api: CommonServiceService, public ngxService: NgxUiLoaderService, public _snackBar: MatSnackBar ) { }

  ngOnInit(): void {
    this.getList()
  }

// Get HRA List
async getList(){
  this.ngxService.start();
  await(this._api.hraList().subscribe(res => {
    this.ngxService.stop();
    const response: any = res;
    if (response.success == true){
      this.questionSelction = [...response.data, ...this.question];
    }else{
    }
    console.log(res);
  }, err => {
    const error = err.error;
    this.ngxService.stop();
  }));

  }
  next(i) {
    let  q = this.question[i]
    if(q.type == '' || q.title == '' || q.score == '' || q.category == '' || q.segments == '' || q.description == '' ){
      this.openErrrorSnackBar('Please fill all field to move to next question')

    }else{

      this.tab++;
      if (this.tab >= this.question.length) {
        this.question.push({
          type:'',
          title:'',
          category:'',
          segments:'',
          description:'',
          optionArray:[{value:'',point:null}],
          special:[],
          subQuestion:[],
          sliderOption:{left:0,label:'',right:100},
          answer:'',
          columnArray: [],
          rowArray: [],
          score:null,
          isRequired:0,
          dependentQuestionId:0,
          parentOption:[],
          questionId:Math.floor(10000000 + Math.random() * 90000000),
          dependentOption:[],
          "ip_Address"    :"12.443.22.11"
        })
      }
      this.questionSelction = [...this.questionSelction,this.question];
    }
  }
  prev() {
    if (this.tab > 0) {
      this.tab--;
    }
  }


  // add question
  async addHra(){
    let  q = this.question[this.question.length - 1]
    if(q.type == '' || q.title == '' || q.category == '' || q.segments == '' ){
      this.openErrrorSnackBar('Please fill all field to move to next question');
    }else{
      let data = {
          data:this.question
        };
      this.ngxService.start();
      await(this._api.addHra(data).subscribe(res => {
        this.ngxService.stop();
        const response: any = res;
        if (response.success == true){
          this.openSnackBar(response.message);
          this.router.navigate(['/hra']);
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
    this.question[i].optionArray.push({value:'',point:null})
    // this.data.splice(0, 0, i);
    // console.log(this.data.splice())
  }

  removeOption(i,io){
    this.question[i].optionArray.splice(io,1);
  }

  setSpecial(i,value){
    this.question[i].special.push(value)
  }

  addColumn(i) {
    this.value = { label: "" };
    this.question[i].columnArray.push(this.value)
    if(this.question[i].rowArray.length == 0){
      this.question[i].rowArray.push({ label: "",correct:1 })
    }
  }

  removeColumn(i, idx) {
    this.question[i].columnArray.splice(idx, 1)
    if(this.question[i].columnArray.length == 0){
      this.question[i].rowArray = [];
    }
  }

  addRow(i) {
    this.question[i].rowArray.push({ label: "",correct:1 })
    console.log(this.question[i])
  }

  removeRow(i, rawIndex) {
    this.question[i].rowArray.splice(rawIndex, 1)
  }

  countScore(q){
    if(q.category == 'mind'){
      if(this.mindScore < q.score){
        this.openErrrorSnackBar('Sorry you can not add this question total score of this category is greator than 100')
        this.disTab = false;
      }else{
        this.mindScore = this.mindScore - q.score;
        this.disTab = true
      }
    }
    if(q.category == 'body'){
      if(this.bodyScore < q.score){
        this.openErrrorSnackBar('Sorry you can not add this question total score of this category is greator than 100')
        this.disTab = false;
      }else{
        this.bodyScore = this.bodyScore - q.score;
        this.disTab = true
      }
    }
    if(q.category == 'lifestyle'){
      if(this.lifeStyleScore < q.score){
        this.openErrrorSnackBar('Sorry you can not add this question total score of this category is greator than 100')
        this.disTab = false;
      }else{
        this.lifeStyleScore = this.lifeStyleScore - q.score;
        this.disTab = true
      }
    }
  }


  // copy code
  copy(i){
    let obj = this.question[i];
    this.question.push(obj);
    this.tab++;
  }

  // delete question
  delete(i){
    this.question.splice(i,1);
    this.tab--;
    this.questionSelction = [...this.questionSelction,this.question];
  }

  setSegment(e){
    console.log(e)
    if(e == 'body'){
      this.segmentData = ['Personal','Biometrics','Clinical History','Screening','Family history','Occupational history']
    }else if(e == 'mind'){
      this.segmentData = ['Stress and mental wellbeing','Readiness assessment']
    }else if(e == 'lifestyle'){
      this.segmentData = ['Diet','Physical activity','Tobacco Use','Sleep','Alcohol']
    }
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
  const dialogRef = this.dialog.open(HraViewComponent,{
    width: '90%',
    height:'90%',
    data:{
      hraP:JSON.stringify(this.question)
    }
  },
  );

  dialogRef.afterClosed().subscribe(result => {
    console.log(`Dialog result: ${result}`);
    // this.getRole();
  });
}


///get parent otpions
getParentIds(e){
  console.log(e)
  for(let item of this.questionSelction){
    if(item.questionId == e){
      this.questionSelction[this.questionSelction.length - 1].parentOption = JSON.parse(item.optionArray)
    }
  }
  console.log(this.questionSelction)
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
