import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ConfirmBoxComponent, ConfirmDialogModel } from 'src/app/confirm-box/confirm-box.component';
import { AccessServiceService } from 'src/app/service/access-service.service';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-meal-plan-info',
  templateUrl: './meal-plan-info.component.html',
  styleUrls: ['./meal-plan-info.component.scss']
})
export class MealPlanInfoComponent implements OnInit {
  responseData: any;

  postId: any;
  accessPermission: any;
  images: any = [];
  keywords: any = []
  imgPath = environment.apiBaseUrl;
  title = '';
  days: any = []
  mealData: any = [];
  constructor(public route: ActivatedRoute, public dialog: MatDialog, public _access: AccessServiceService, public _api: CommonServiceService, public ngxService: NgxUiLoaderService, public _snackBar: MatSnackBar) {

    this.postId = this.route.snapshot.params.id;
    console.log(this.route.snapshot.url[0].path)
  }

  ngOnInit(): void {
    this.getRecipe()
    this.accessPermission = this._access.getRouteAccess('User roles', JSON.parse(localStorage.getItem('userData')).moduleAccess);


  }

  // Get Recipe List
  async getRecipe() {
    this.ngxService.start();
    await (this._api.listRecipe().subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        this.mealData = response.data;
      }
      console.log(res);

      this.PostDetails();
    }, err => {
      const error = err.error;
      this.ngxService.stop();
    }));

  }


  // Get Post Details
  async PostDetails() {
    let formGroup = {
      "mealPlan_id": this.postId
    }
    this.ngxService.start();
    await (this._api.mealDetail(formGroup).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {

        this.responseData = response.data[0];
        this.title = this.responseData.meal_title;
        this.responseData.days.map(async item => {
          item.mealday = JSON.parse(item.mealday)
          await item.mealday.map(async meal => {
            meal.recipeData = []
            await meal.recipes.map(async rec => {
              for (let recD of this.mealData) {
                if (recD.recipes_id == rec) {
                  let pImage = JSON.parse(recD.recipe_image)

                  //Check Image URL Start
                  recD.primeImage = pImage

                  if (!recD.primeImage.startsWith("http")) {
                    recD.primeImage = environment.apiBaseUrl + "" + recD.primeImage;
                  }
                  //Check Image URL End

                  recD["from_calories"] = this.responseData.from_calories;
                  recD["to_calories"] = this.responseData.to_calories;
                  meal.recipeData.push(recD)
                }
              }
            })

          })
        })

        this.days = this.responseData.days;
        console.log("Meal Detail", this.days)

      } else {
      }
    }, err => {
      const error = err.error;
      this.ngxService.stop();
    }));

  }


  // delete fact
  async deleteFact(id) {
    let formGroup = {
      "recipes_id": id,
      "ip_Address": "122.22.33.33",
      "userId": "1"
    }
    this.ngxService.start();
    await (this._api.deleteRecipes(formGroup).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        this.openSnackBar(response.message)
        this.PostDetails();
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

  async statusUpdate(id, status) {

    let formGroup = {
      "recipes_id": id,
      "status": status
    }
    this.ngxService.start();
    await (this._api.updateStatusRecipes(formGroup).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        this.openSnackBar(response.message)
        this.PostDetails();
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

  // confirm message
  confirmDialog(id): void {
    const message = `Are you sure you want to delete this?`;

    const dialogData = new ConfirmDialogModel('Confirm Action', message);

    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      maxWidth: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.deleteFact(id);
      }
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
