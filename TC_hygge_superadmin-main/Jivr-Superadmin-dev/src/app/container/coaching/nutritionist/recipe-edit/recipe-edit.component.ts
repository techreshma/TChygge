import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.scss']
})
export class RecipeEditComponent implements OnInit {
  value = {};
  segmentData: any = [];
  uploadType: any;
  formGroup = {
    "recipes_id": "",
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
    "userId": "1",
    "ip_Address": "122.22.33.44",
    "coachingcat_Id": "9"
  }
  ingredient = []
  keywords = []
  responseData: any;
  imgPath = environment.apiBaseUrl;
  constructor(public route: ActivatedRoute, public router: Router, public dialog: MatDialog, public _api: CommonServiceService, public ngxService: NgxUiLoaderService, public _snackBar: MatSnackBar) { }

  mediaType: any = '';
  removedPassed: boolean = false;
  removedIngredient: boolean = false;

  removeCount: any = 0;
  ingredientRemoveCount: any = 0;

  ngOnInit(): void {
    this.PostDetails();
  }


  // Get Post Details
  async PostDetails() {
    let formGroup = {
      "recipes_id": this.route.snapshot.params.id
    }
    this.ngxService.start();
    await (this._api.detailRecipes(formGroup).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        this.responseData = response.data[0];
        for (let item of JSON.parse(this.responseData.keywords)) {
          this.keywords.push({ key: item })
        };
        for (let item of JSON.parse(this.responseData.ingredients)) {
          this.ingredient.push({ key: item })
        };


        this.mediaType = this.responseData.is_type

        this.formGroup = {
          "recipes_id": this.route.snapshot.params.id,
          "recipe_title": this.responseData.recipe_title,
          "recipe_image": [JSON.parse(this.responseData.recipe_image)],
          "calories": this.responseData.calories,
          "protein": this.responseData.protein,
          "fat": this.responseData.fat,
          "carbs": this.responseData.carbs,
          "preparation_time": this.responseData.preparation_time,
          "serving_size": this.responseData.servingsize,
          "ingredients": JSON.parse(this.responseData.ingredients),
          "instructions": this.responseData.instructions,
          "keywords": JSON.parse(this.responseData.keywords),
          "userId": "1",
          "ip_Address": "122.22.33.44",
          "coachingcat_Id": "9"
        }
      } else {
      }
      console.log(res);
    }, err => {
      const error = err.error;
      this.ngxService.stop();
    }));

  }


  // edit recipe
  async editRecipe() {
    this.ngxService.start();
    this.formGroup["is_type"] = this.mediaType
    this.formGroup.recipe_image = this.formGroup.recipe_image[0]
    for (let item of this.keywords) {
      this.formGroup.keywords.push(item.key)
    }
    for (let item of this.ingredient) {
      this.formGroup.ingredients.push(item.key)
    }
    await (this._api.editRecipes(this.formGroup).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        this.openSnackBar(response.message);
        this.router.navigate(['/recipe']);
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
    if (this.formGroup.recipe_image.length === 0) {
      if (event.addedFiles.length === 1) {
        this.uploadType = event.addedFiles[0].type.split('/')[0]
        this.mediaType = this.uploadType
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
            this.ngxService.stop();
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

  onRemove(event) {
    console.log(event);
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
    this.removeCount++
    this.removedPassed = true;
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
    this.removedIngredient = true;
    this.ingredientRemoveCount++;
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
