import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Editor } from 'ngx-editor';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import { environment } from 'src/environments/environment';
import { NgForm } from '@angular/forms';
import { MyNutritionFilterComponent } from 'src/app/helpers/my-nutrition-filter/my-nutrition-filter.component';

@Component({
  selector: 'app-meal-plan-edit',
  templateUrl: './meal-plan-edit.component.html',
  styleUrls: ['./meal-plan-edit.component.scss']
})
export class MealPlanEditComponent implements OnInit {
  editor: Editor;
  value = {};
  segmentData: any = [];
  uploadType: any;
  formGroup = {
    "mealPlan_id": "",
    "meal_title": "",
    "meal_description": "",
    "meal_image": [],
    "coachingcat_id": "7",
    "ip_Address": "123",
    "days": [],
    "to_calories": null,
    "from_calories": null,
  }

  mediaType: any = ''
  recipeData: any = [];
  responseData: any;
  imgPath = environment.apiBaseUrl;
  dropDownList: any = [];
  showInput: boolean = false;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public dialog: MatDialog,
    public _api: CommonServiceService,
    public ngxService: NgxUiLoaderService,
    public _snackBar: MatSnackBar
  ) { }
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

    } else {
      console.log("Working");
      console.log(this.route.snapshot.params.id)
      this.PostDetails(this.route.snapshot.params.id)

    }
    this.getList()
    this.mealPlanList()
  }

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

  // Get Post Details
  async PostDetails(id) {
    console.log("Edit Id", id)
    let formGroup = {
      "mealPlan_id": id
    }
    console.log(formGroup)
    this.ngxService.start();
    await (this._api.mealDetail(formGroup).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        this.responseData = response.data[0];
        let meal_image: any = JSON.parse(this.responseData.meal_image)
        console.log(meal_image[0][0])
      
        this.mediaType = this.responseData.is_type

        this.formGroup.mealPlan_id = id;
        this.formGroup.meal_title = this.responseData.meal_title;
        this.formGroup.meal_description = this.responseData.meal_description;
        this.formGroup.meal_image = [meal_image];
        this.formGroup.to_calories = this.responseData.to_calories;
        this.formGroup.from_calories = this.responseData.from_calories;
        for (let item of this.responseData.days) {
          item.mealday = JSON.parse(item.mealday)
        }
        this.formGroup.days = this.responseData.days;
      } else {
      }
      console.log(res);
    }, err => {
      const error = err.error;
      this.ngxService.stop();
    }));

  }
  
// Get Post Details

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
        }
        this.formGroup.days.forEach((dayArray: any) => {
          dayArray.mealday.forEach((mealDayArray: any) => {
            mealDayArray['recipeArray'] = this.recipeData
          })
        })
        console.log(this.formGroup.days)
      } else {
      }
      console.log(res);
    }, err => {
      const error = err.error;
      this.ngxService.stop();
    }));

  }

  // add question
  async addHra() {
    this.ngxService.start();
    this.formGroup["is_type"] = this.mediaType;

    /*
        this.formGroup.meal_image.push(response.data)
    */


    await (this._api.mealUpdatePlan(this.formGroup).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        this.openSnackBar(response.message);
        localStorage.removeItem('dayId');
        localStorage.removeItem('mealId');
        localStorage.removeItem('mealForamData');
        localStorage.removeItem('mealPage');
        this.router.navigate(['/meal-plan']);

      } else {
        this.openErrrorSnackBar(response.message);
      }
      console.log(res);
    }, err => {
      const error = err.error;
      this.openErrrorSnackBar(error.message);
      this.ngxService.stop();
    }));
  }

  // upload logo image
  async onSelect(event) {
    this.ngxService.start();
    if (this.formGroup.meal_image.length === 0) {
      if (event.addedFiles.length === 1) {
        this.uploadType = event.addedFiles[0].type.split('/')[0]
        this.mediaType = this.uploadType
        for (let item of event.addedFiles) {
          console.log(item)
          await (this._api.uploadThemeDoc(item, 'logo').subscribe(res => {
            const response: any = res;
            if (response.success == true) {
              this.formGroup.meal_image.push(response.data);
              this.ngxService.stop();
            } else {
              this.openSnackBar(response.message);
            }
            console.log(res);
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

  //Open Recipe Filter
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
    if (parseDataArray.filterd.length != 0 && parseDataArray.indexes) {
      let daysIndex = parseDataArray.indexes.dayIndex;
      let mealTypeIndex = parseDataArray.indexes.mealtypeIndex;

      this.formGroup.days[daysIndex].mealday[mealTypeIndex].recipeArray = parseDataArray.filterd
    }
    else {
      this.formGroup.days.forEach((dayArray: any) => {
        dayArray.mealday.forEach((mealDayArray: any) => {
          mealDayArray['recipeArray'] = this.recipeData
        })
      })
    }
  }

  changeEditor(e) {
    this.formGroup.meal_description = e;
  }

  addMealPlan(data: any) {

    this.formGroup.meal_title = data
  }

  setOtherMeal(e: any) {
    this.formGroup.meal_title = e.target.value;
    console.log(e.target.value)
  }

  onRemove(event) {
    console.log(event);
    this.formGroup.meal_image.splice(this.formGroup.meal_image.indexOf(event), 1);
  }

  addOption() {
    this.formGroup.days.push({
      coachingcat_id: 7,
      created_At: "2021-03-02T12:49:53.000Z",
      created_by: null,
      ip_Address: null,
      isActive: "1",
      mealPlan_id: 6,
      mealday: [{ "type": "", "recipes": [] }],
      mealday_id: 0,
      status: "1",
      updated_at: "2021-03-02T12:49:53.000Z",
      updated_by: null
    })
  }

  removeOption(io) {
    this.formGroup.days.splice(io, 1);
  }

  addMore(i) {
    if (this.formGroup.days[i].mealday.length <= 3) {
      this.formGroup.days[i].mealday.push({ "type": "", "recipes": [] })
    }
  }

  removeMeal(i, ix) {
    this.formGroup.days[i].mealday.splice(ix, 1)
  }

  addRecipe(i, ix) {
    this.formGroup.days[i].mealday[ix].recipes.push('')
  }

  removeRecipe(i, ix, ixo) {
    this.formGroup.days[i].mealday[ix].recipes.splice(ixo, 1)
  }

  newRecipe(i, ix) {
    localStorage.setItem('dayId', i)
    localStorage.setItem('mealId', ix)
    localStorage.setItem('mealPage', this.route.snapshot.params.id)
    localStorage.setItem('mealForamData', JSON.stringify(this.formGroup))
    this.router.navigate(['/recipe-create'])
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

