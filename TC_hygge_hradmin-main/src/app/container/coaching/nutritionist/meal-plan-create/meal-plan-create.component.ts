import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Editor } from 'ngx-editor';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MyNutritionFilterComponent } from 'src/app/helpers/my-nutrition-filter/my-nutrition-filter.component';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-meal-plan-create',
  templateUrl: './meal-plan-create.component.html',
  styleUrls: ['./meal-plan-create.component.scss']
})
export class MealPlanCreateComponent implements OnInit {
  editor: Editor;
  value = {};
  segmentData: any = [];
  uploadType: any;
  formGroup = {
    "meal_title": "",
    "meal_description": "",
    "meal_image": [],
    "coachingcat_id": "7",
    "days": [],
    "to_calories": null,
    "from_calories": null,
  }

  mediaType: any = ''
  recipeData: any = [];

  imgPath = environment.apiBaseUrl;
  dropDownList: any = [];
  showInput: boolean = false;
  otherMealTitle: any = ''
  constructor(public router: Router, public dialog: MatDialog, public _api: CommonServiceService, public ngxService: NgxUiLoaderService, public _snackBar: MatSnackBar) { }
  @ViewChild('registerForm') registerForm: NgForm;

  ngOnInit(): void {
    this.editor = new Editor();
    if (localStorage.getItem('dayId')) {
      let formData = JSON.parse(localStorage.getItem('mealForamData'));
      this.formGroup.meal_title = formData.meal_title;
      this.formGroup.meal_description = formData.meal_description;
      this.formGroup.meal_image = formData.meal_image;
      this.formGroup.days = formData.days;
      this.formGroup.to_calories = formData.to_calories;
      this.formGroup.from_calories = formData.from_calories;
    }
    this.getList();
    this.mealPlanList();
  }

  // Get Leave List
  async getList() {
    this.ngxService.start();
    await (this._api.listRecipe().subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        this.recipeData = response.data.newArr;
        if (localStorage.getItem('dayId')) {
          this.formGroup.days[localStorage.getItem('dayId')].day[localStorage.getItem('mealId')].recipes.push(this.recipeData[this.recipeData.length - 1].recipes_id)
          console.log(this.formGroup.days)
        }
      } else {
      }
    }, err => {
      const error = err.error;
      this.ngxService.stop();
    }));

  }

  //Get Dropdown Data
  async mealPlanList() {
    this.ngxService.start();
    await (this._api.mealPlanlist().subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success) {

        let filterArray = [];
        response.data.newArr.forEach((el: any) => {
          filterArray.push(el.meal_title)
        })
        let uniqueData = Array.from(new Set(filterArray));
        this.dropDownList = uniqueData;
      }
    }, err => {
      const error = err.error;
      this.ngxService.stop();
    }));
  }

  // add question
  async addHra() {
    this.ngxService.start();
    this.formGroup["is_type"] = this.uploadType;

    if (this.registerForm.valid && this.formGroup.meal_description !== '') {
      this.formGroup.meal_image = this.formGroup.meal_image[0];
      await (this._api.mealAdd(this.formGroup).subscribe(res => {
        this.ngxService.stop();
        const response: any = res;
        if (response.success == true) {
          this.openSnackBar(response.message);
          localStorage.removeItem('dayId');
          localStorage.removeItem('mealId');
          localStorage.removeItem('mealPage');
          localStorage.removeItem('mealForamData');
          this.router.navigate(['/meal-plan']);

        } else {
          this.openErrrorSnackBar(response.message);
        }
      }, err => {
        const error = err.error;
        this.openErrrorSnackBar(error.message);
        this.ngxService.stop();
      }));
    }
    else {
      this.ngxService.stop();
      this.openErrrorSnackBar('Please fill all field to move to next question');
    }
  }

  // upload logo image
  async onSelect(event) {
    if (this.formGroup.meal_image.length === 0) {
      this.ngxService.start();
      if (event.addedFiles.length === 1) {
        this.uploadType = event.addedFiles[0].type.split('/')[0]
        for (let item of event.addedFiles) {
          await (this._api.uploadThemeDoc(item, 'logo').subscribe(res => {
            const response: any = res;
            if (response.success == true) {
              this.formGroup.meal_image.push(response.data);
              this.ngxService.stop();
            } else {
              this.openSnackBar(response.message);
              this.ngxService.stop();
            }
          }, err => {
            const error = err.error;
            this.openErrrorSnackBar(error.message);
          }));
        }
      } else {
        this.ngxService.stop();
        this.openErrrorSnackBar('You can upload only single Image / Video');
      }
    }
    else {
      this.ngxService.stop();
      this.openErrrorSnackBar('You can upload only single Image / Video');
    }
  }

  addMealPlan(data: any) {
    if (data === 'Other') {
      this.showInput = true;
    }
    else {
      this.formGroup.meal_title = data
      console.log(this.formGroup.meal_title)
      this.showInput = false;
    }
  }

  setOtherMeal(e: any) {
    this.formGroup.meal_title = e.target.value;
    console.log(e.target.value)
  }

  onRemove(event) {
    this.formGroup.meal_image.splice(this.formGroup.meal_image.indexOf(event), 1);
  }


  addOption() {
    this.formGroup.days.push({ "day": [{ "type": "", "recipes": [] }] })
    console.log(this.formGroup.days)
  }

  removeOption(io) {
    this.formGroup.days.splice(io, 1);
  }

  addMore(i) {
    if (this.formGroup.days[i].day.length <= 3) {
      this.formGroup.days[i].day.push({ "type": "", "recipes": [] })
    }
  }
  removeMeal(i, ix) {
    this.formGroup.days[i].day.splice(ix, 1)
  }
  addRecipe(i, ix) {
    this.formGroup.days[i].day[ix].recipes.push('')
    this.formGroup.days[i].day[ix]["recipeArray"] = this.recipeData
  }

  openRecipeFilter(dayIndex: any, mealtypeIndex: any, recipeIndex: any) {
    console.log(dayIndex, mealtypeIndex, recipeIndex)
    const dialogRef = this.dialog.open(MyNutritionFilterComponent, {
      width: '1000px',
      data: { dayIndex: dayIndex, mealtypeIndex: mealtypeIndex, recipeIndex: recipeIndex }
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      this.setFilteredRecipeFunction(dialogResult)
    });
  }

  setFilteredRecipeFunction(data: any) {
    let parseDataArray: any = JSON.parse(data);
    console.log(parseDataArray.filterd)
    if (parseDataArray.filterd.length != 0 && parseDataArray.indexes) {
      let daysIndex = parseDataArray.indexes.dayIndex;
      let mealTypeIndex = parseDataArray.indexes.mealtypeIndex;

      this.formGroup.days[daysIndex].day[mealTypeIndex].recipeArray = parseDataArray.filterd
    }
    else {
      this.formGroup.days.forEach((dayArray: any) => {
        dayArray.mealday.forEach((mealDayArray: any) => {
          mealDayArray['recipeArray'] = this.recipeData
        })
      })
    }
  }

  removeRecipe(i, ix, ixo) {
    this.formGroup.days[i].day[ix].recipes.splice(ixo, 1)
  }

  newRecipe(i, ix) {
    localStorage.setItem('dayId', i)
    localStorage.setItem('mealId', ix)
    localStorage.setItem('mealForamData', JSON.stringify(this.formGroup))
    this.router.navigate(['/recipe-create'])
  }

  changeEditor(e) {
    this.formGroup.meal_description = e;
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
