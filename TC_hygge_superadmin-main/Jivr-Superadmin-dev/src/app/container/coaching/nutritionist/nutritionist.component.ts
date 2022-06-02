import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-nutritionist',
  templateUrl: './nutritionist.component.html',
  styleUrls: ['./nutritionist.component.scss']
})
export class NutritionistComponent implements OnInit {
  list: any = [];
  imgPath = environment.apiBaseUrl
  lineChartGraphData: any;
  constructor(public router: Router, public _api: CommonServiceService, public ngxService: NgxUiLoaderService) { }

  ngOnInit(): void {
    this.getList()
  }

  async getList() {
    let formData = {
      "coachingcat_id": "3"
    }
    this.ngxService.start();
    await (this._api.coachingSubCategory(formData).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        this.list = response.data;
        response.data.forEach((el: any) => {
          if (el.coachingcat_id == 4 || el.coachingcat_id == 5 || el.coachingcat_id == 6) {
            this.nutritionApiFunction(el);
          }
          else if (el.coachingcat_id == 7) {
            this.getMealPlanList();
          }
          else if (el.coachingcat_id == 8) {
            this.getGlossaryList();
          }
          else if (el.coachingcat_id == 9) {
            this.getRecipeList();
          }
        })
      } else {
      }
    }, err => {
      const error = err.error;
      this.ngxService.stop();
    }));
  }


  gotToLink(id) {
    if (id == 7) {
      this.router.navigate(['/meal-plan'])
    } else if (id == 8) {
      this.router.navigate(['/glossary'])
    } else if (id == 9) {
      this.router.navigate(['/recipe'])
    } else {
      this.router.navigate(['/be-your-own-nutritionist-info/' + id])
    }
  }

  //#region here we can call api's 
  async nutritionApiFunction(record: any) {
    let formGroup = {
      "coachingcat_Id": record.coachingcat_id
    }
    await (this._api.factList(formGroup).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        let likeDislikeView: any = {}
        response.data.likeDislikeViewArr.forEach((element: any) => {
          likeDislikeView = element
        })
        this.list.forEach((nutrition_el: any) => {
          if (nutrition_el.coachingcat_id === record.coachingcat_id) {
            nutrition_el.dislikes = likeDislikeView.TotalDislikes;
            nutrition_el.likes = likeDislikeView.TotalLikes;
            nutrition_el.views = likeDislikeView.TotalViews
          }
        })
      } else {
      }
    }, err => {
      const error = err.error;
    }));
  }

  async getMealPlanList() {
    await this._api.mealPlanlist().subscribe(
      (res) => {
        const response: any = res;
        if (response.success == true) {
          let likeDislikeView: any = {}
          response.data.ViewArr.forEach((element: any) => {
            likeDislikeView = element
          })

          this.list.forEach((nutrition_el: any) => {
            if (nutrition_el.coachingcat_id == 7) {
              nutrition_el.dislikes = likeDislikeView.TotalDislikes ? likeDislikeView.TotalDislikes : 0;
              nutrition_el.likes = likeDislikeView.TotalLikes ? likeDislikeView.TotalDislikes : 0;
              nutrition_el.views = likeDislikeView.TotalViews
            }
          })
        } else {
        }
      },
      (err) => {
        const error = err.error;
        this.ngxService.stop();
      }
    );
  }

  async getGlossaryList() {
    await (this._api.listGlossary().subscribe(res => {
      const response: any = res;
      if (response.success == true) {
        let likeDislikeView: any = {}
        response.data.ViewArr.forEach((element: any) => {
          likeDislikeView = element
        })

        this.list.forEach((nutrition_el: any) => {
          if (nutrition_el.coachingcat_id == 8) {
            nutrition_el.dislikes = likeDislikeView.TotalDislikes ? likeDislikeView.TotalDislikes : 0;
            nutrition_el.likes = likeDislikeView.TotalLikes ? likeDislikeView.TotalDislikes : 0;
            nutrition_el.views = likeDislikeView.TotalViews
          }
        })
      } else {
      }
    }, err => {
      const error = err.error;
    }));
  }

  async getRecipeList() {
    await (this._api.listRecipe().subscribe(res => {
      const response: any = res;
      if (response.success == true) {
        let likeDislikeView: any = {}
        response.data.ViewArr.forEach((element: any) => {
          likeDislikeView = element
        })

        this.list.forEach((nutrition_el: any) => {
          if (nutrition_el.coachingcat_id == 9) {
            nutrition_el.dislikes = likeDislikeView.TotalDislikes ? likeDislikeView.TotalDislikes : 0;
            nutrition_el.likes = likeDislikeView.TotalLikes ? likeDislikeView.TotalDislikes : 0;
            nutrition_el.views = likeDislikeView.TotalViews
          }
        })
      } else {
      }
    }, err => {
      const error = err.error;
      this.ngxService.stop();
    }));
  }

  //#endregion
}
