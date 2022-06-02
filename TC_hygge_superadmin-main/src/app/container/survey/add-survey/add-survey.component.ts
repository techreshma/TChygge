import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Console } from 'console';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import { ViewSurveyComponent } from '../view-survey/view-survey.component';

@Component({
  selector: 'app-add-survey',
  templateUrl: './add-survey.component.html',
  styleUrls: ['./add-survey.component.scss']
})
export class AddSurveyComponent implements OnInit {
  value = {};
  segmentData: any = [];
  formName = '';
  formDescription = '';
  parentOption: any = [];
  question: any = [
    {
      "survey_Type": "", //
      "survey_Title": "", //
      "survey_Description": "", //
      "survey_OptionArray": [{ "value": "", "id": 0 }], //
      "survey_SubQuestion": [], //
      "survey_SliderOption": { "left": 0, "label": '', "right": 100 },
      "parentOption": [],
      dependentQuestionId: 0, //
      dependentOption: [], //
      questionId: Math.floor(10000000 + Math.random() * 90000000), //
      "survey_Answer": "", //
      "survey_ColumnArray": [], //
      "survey_RowArray": [], //
      "survey_Score": 0,
      "isRequired": 0, //
      "ip_Address": "12.443.22.11", //
    }
  ];
  qeustionType = [
    { label: 'Rating', value: 'rating' },
    { label: 'Drop Down', value: 'dropdown' },
    { label: 'Radio Button', value: 'radio' },
    { label: 'Slider', value: 'slider' },
    { label: 'Open Ended', value: 'textarea' },
    { label: 'Multiple Choice', value: 'multiSelect' },
    { label: 'Matrix or Linkert', value: 'matrix' },
    { label: 'Text Box', value: 'text' }
  ]
  disTab = true;
  id: any;
  preId: any;
  removedPassed: boolean = false;
  removeCount: any = 0;

  removeQuestionArray: any[];

  constructor(public route: ActivatedRoute, public router: Router, public dialog: MatDialog, public _api: CommonServiceService, public ngxService: NgxUiLoaderService, public _snackBar: MatSnackBar) {
    this.loadAndSetId();
  }

  ngOnInit() { }

  loadAndSetId() {
    this.id = this.route.snapshot.params.id;
    this.preId = this.route.snapshot.params.preid;
    if (this.id) {
      this.openSurveyQuestion();
    }
    if (this.preId) {
      this.openPreSurveyQuestion();
    }
  }

  // get survery qustion by id
  async openPreSurveyQuestion() {
    let formData = {
      "surveytemplate_Id": this.preId
    }
    this.ngxService.start();
    await (this._api.getTemplateQuestions(formData).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        for (let item of response.data) {
          item.survey_ColumnArray = item.survey_ColumnArray ? JSON.parse(item.survey_ColumnArray) : [];
          item.survey_OptionArray = item.survey_OptionArray ? JSON.parse(item.survey_OptionArray) : [];
          item.survey_RowArray = item.survey_RowArray ? JSON.parse(item.survey_RowArray) : [];
          item.survey_SliderOption = item.survey_SliderOption ? JSON.parse(item.survey_SliderOption) : [];
          item.survey_SubQuestion = item.survey_SubQuestion ? JSON.parse(item.survey_SubQuestion) : []
          item.survey_Type = item.type && item.type.toLowerCase()
        }

        this.question = response.data;
        this.formName = response.templateName;
        this.formDescription = this.question.length > 0 && this.question[0].survey_Description;
      } else {
        this.openErrrorSnackBar(response.message)
      }
      console.log(res);
    }, err => {
      const error = err.error;
      this.openErrrorSnackBar(error)
      this.ngxService.stop();
    }));

  }


  // show serey queation
  async openSurveyQuestion() {
    let formData = {
      "companyId": 0,
      "surveyTypeId": this.id
    }
    this.ngxService.start();
    await (this._api.getSurveryQuestion(formData).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        console.log(response.data)
        if (response.data.length > 0) {
          this.question = []
          for (let item of response.data) {
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
      } else {
        this.openErrrorSnackBar(response.message)
      }
      console.log(res);
    }, err => {
      const error = err.error;
      this.openErrrorSnackBar(error)
      this.ngxService.stop();
    }));
  }

  // add new question
  next() {
    this.question.push({
      "survey_Type": "",
      "survey_Title": "",
      "survey_Description": "",
      "survey_OptionArray": [{ "value": "" }],
      "survey_SubQuestion": [],
      "survey_SliderOption": { "left": 0, "label": '', "right": 100 },
      "survey_Answer": "",
      "survey_ColumnArray": [],
      "survey_RowArray": [],
      "isRequired": 0,
      "ip_Address": "12.443.22.11",
      dependentQuestionId: 0,
      questionId: Math.floor(10000000 + Math.random() * 90000000),
      dependentOption: [],
      parentOption: [],
    })
  }

  //get parent otpions
  getParentIds(e) {
    console.log(e)
    for (let item of this.question) {
      if (item.questionId == e) {
        this.question[this.question.length - 1].parentOption = item.survey_OptionArray
      }
    }
  }

  // add question
  async addHra() {
    let q = this.question[this.question.length - 1];
    let qCount: any = 0;
    q.survey_OptionArray.forEach((el: any) => {
      if (/\S/.test(el.value)) {
        qCount++;
      }
      else {
        qCount--;
      }
    })
    console.log(this.formName == '', this.formDescription == '', q.survey_Type == '', q.survey_Title == '', q.survey_Description == '')
    if (this.formName == '' || this.formDescription == '' || q.survey_Type == '' || q.survey_Title == '' || q.survey_Description == '') {
      this.openErrrorSnackBar('Please fill all field to move to next question');
    } else {
      let formData = {
        "survey_Name": this.formName,
        "survey_Description": this.formDescription,
        "userId": JSON.parse(localStorage.getItem('userData')).superAdmin_id,
        "companyId": 0,
        "questionArray": this.question
      }

      formData.questionArray.forEach((el: any) => {
        console.log(el.dependentOption)
        //el.dependentOption = JSON.parse(el.dependentOption);
      })

      this.ngxService.start();
      await (this._api.addSurveyQuestion(formData).subscribe(res => {
        this.ngxService.stop();
        const response: any = res;
        if (response.success == true) {
          this.openSnackBar(response.message);
          this.router.navigate(['/survey-initiate']);
        } else {
          this.openErrrorSnackBar(response.message);
        }
      }, err => {
        const error = err.error;
        this.openErrrorSnackBar(error.message);
        this.ngxService.stop();
      }));
    }
  }

  //add option
  addOption(i: any) {
    this.question[i].survey_OptionArray.push({ value: '' })
    var lengthVar: any = this.question[i].survey_OptionArray.length
    var currentIndex: any = lengthVar - 1;
    if (this.removedPassed) {
      if (lengthVar != 0) {
        let previousOfValue: any = this.question[i].survey_OptionArray[currentIndex - this.removeCount].value
        this.question[i].survey_OptionArray[currentIndex - this.removeCount] = { value: previousOfValue };
      }
    }
    this.removeCount = 0;
  }

  // remove option
  removeOption(i: any, io: any) {
    this.question[i].survey_OptionArray.splice(io, 1);
    this.removeCount++;
    this.removedPassed = true;
  }

  // add matrix columne
  addColumn(i) {
    this.value = { label: "" };
    this.question[i].survey_ColumnArray.push(this.value)
  }

  // remove matrix columne
  removeColumn(i, idx) {
    this.question[i].survey_ColumnArray.splice(idx, 1)
  }

  //add matrix row
  addRow(i) {
    this.question[i].survey_RowArray.push({ title: "" })
    if (this.question[i].survey_ColumnArray.length == 0) {
      this.question[i].survey_ColumnArray.push({ label: "" })
    }
  }

  // remove matrix row
  removeRow(i, rawIndex) {
    this.question[i].survey_RowArray.splice(rawIndex, 1)
    if (this.question[i].survey_RowArray.length == 0) {
      this.question[i].survey_ColumnArray = [];
    }
  }

  // copy code
  copy(i) {
    this.question.push({
      "survey_Type": this.question[i].survey_Type,
      "survey_Title": this.question[i].survey_Title,
      "survey_Description": this.question[i].survey_Description,
      "survey_OptionArray": this.question[i].survey_OptionArray,
      "survey_SubQuestion": this.question[i].survey_SubQuestion,
      "survey_SliderOption": this.question[i].survey_SliderOption,
      "survey_Answer": this.question[i].survey_Answer,
      "survey_ColumnArray": this.question[i].survey_ColumnArray,
      "survey_RowArray": this.question[i].survey_RowArray,
      "isRequired": this.question[i].isRequired,
      "ip_Address": this.question[i].ip_Address,
      dependentQuestionId: this.question[i].dependentQuestionId,
      questionId: Math.floor(10000000 + Math.random() * 90000000 + i),
      dependentOption: this.question[i].dependentOption,
      parentOption: this.question[i].parentOption,
    })
  }

  // delete question
  delete(i) {
    this.question.splice(i, 1);
  }


  // question requrired set
  changeRequired(e, i) {
    if (e.checked) {
      this.question[i].isRequired = 1
    } else {
      this.question[i].isRequired = 0
    }
  }


  // open hra question preview modal
  openPreviewModal() {
    const dialogRef = this.dialog.open(ViewSurveyComponent, {
      width: '90%',
      height: '90%',
      data: {
        hraP: JSON.stringify(this.question),
        formName: this.formName,
        formDescription: this.formDescription
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
