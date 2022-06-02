import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-recipe-create',
  templateUrl: './recipe-create.component.html',
  styleUrls: ['./recipe-create.component.scss']
})
export class RecipeCreateComponent implements OnInit {
  value = {};
  uploadType: any;
  segmentData: any = [];
  formGroup = {
    "coachingcat_Id": "9",
    "recipe_title": "",
    "recipe_image": [],
    "calories": "",
    "protein": "",
    "fat": "",
    "carbs": "",
    "preparation_time": "",
    "serving_size": "",
    "ingredients": [],
    "instructions": "",
    "keywords": [],
    "userId": 1,
    "ip_Address": "122.33.33"
  }
  ingredient: any = [{ key: '' }]
  keywords: any = [{ key: '', id: 0 }]

  removedPassed: boolean = false;
  removedIngredient: boolean = false;

  removeCount: any = 0;
  ingredientRemoveCount: any = 0;

  imgPath = environment.apiBaseUrl;
  constructor(public router: Router, public dialog: MatDialog, public _api: CommonServiceService, public ngxService: NgxUiLoaderService, public _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  // add recipe
  async addRecipe() {
    this.ngxService.start();
    this.formGroup["is_type"] = this.uploadType;

    this.formGroup.recipe_image = this.formGroup.recipe_image[0]
    for (let item of this.keywords) {
      this.formGroup.keywords.push(item.key)
    }
    for (let item of this.ingredient) {
      this.formGroup.ingredients.push(item.key)
    }
    await (this._api.createRecipe(this.formGroup).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        this.openSnackBar(response.message);
        if (localStorage.getItem('dayId')) {
          if (localStorage.getItem('mealPage')) {
            this.router.navigate(['/meal-plan-edit/' + localStorage.getItem('mealPage')]);
          } else {
            this.router.navigate(['/meal-plan-create']);
          }
        } else {
          this.router.navigate(['/recipe']);
        }

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

  keyWordFunction(index: any) {
    this.keywords[index].id = index
    console.log(this.keywords)
  }

  // upload logo image
  async onSelect(event) {
    this.ngxService.start();
    if (this.formGroup.recipe_image.length === 0) {
      if (event.addedFiles.length === 1) {
        this.uploadType = event.addedFiles[0].type.split('/')[0]
        for (let item of event.addedFiles) {
          await (this._api.uploadThemeDoc(item, 'logo').subscribe(res => {
            const response: any = res;
            if (response.success == true) {
              this.formGroup.recipe_image.push(response.data);
              this.ngxService.stop();
            } else {
              this.openSnackBar(response.message);
            }
          }, err => {
            const error = err.error;
            this.openErrrorSnackBar(error.message);
          }));
        }
      }
      else {
        this.ngxService.stop();
        this.openErrrorSnackBar('You can upload only single Image / Video');
      }
    }
    else {
      this.ngxService.stop();
      this.openErrrorSnackBar('You can upload only single Image / Video');
    }
  }

  onRemove(event) {
    this.formGroup.recipe_image.splice(this.formGroup.recipe_image.indexOf(event), 1);
  }


  addOption() {
    this.keywords.push({ key: '', id: this.keywords.length })
    var lengthVar: any = this.keywords.length
    var currentIndex: any = lengthVar - 1;
    if (this.removedPassed) {
      if (lengthVar != 0) {
        let previousValue: any = this.keywords[currentIndex - this.removeCount].key
        this.keywords[currentIndex - this.removeCount] = { key: previousValue };
      }
    }
    this.removeCount = 0;
  }

  removeOption(Index: any) {
    this.keywords.splice(Index, 1);
    this.removedPassed = true;
    this.removeCount++
  }

  addIng() {
    this.ingredient.push({ key: '' })
    var lengthVar: any = this.ingredient.length
    var currentIndex: any = lengthVar - 1;
    if (this.removedIngredient) {
      if (lengthVar != 0) {
        let previousValue: any = this.ingredient[currentIndex - this.removeCount].key
        this.ingredient[currentIndex - this.removeCount] = { key: previousValue };
      }
    }
    this.ingredientRemoveCount = 0;
  }

  removeIng(io) {
    this.ingredient.splice(io, 1);
    this.ingredientRemoveCount++;
    this.removedIngredient = true;
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
