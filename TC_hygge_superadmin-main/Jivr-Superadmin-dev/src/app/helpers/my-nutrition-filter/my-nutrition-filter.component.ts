import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { element } from 'protractor';
import { CommonServiceService } from 'src/app/service/comman-service.service';

export interface FilterDialogData {
  detail: string;
}

@Component({
  selector: 'app-my-nutrition-filter',
  templateUrl: './my-nutrition-filter.component.html',
  styleUrls: ['./my-nutrition-filter.component.scss']
})
export class MyNutritionFilterComponent implements OnInit {

  constructor(
    public _api: CommonServiceService,
    @Inject(MAT_DIALOG_DATA) public data: FilterDialogData,
    public dialogRef: MatDialogRef<MyNutritionFilterComponent>
  ) { }

  keywordArray: any = [];
  cloneKeyArray: any = [];
  recipeListArray: any = [];
  filteredRecipe: any = [];
  recipeCountCheck: boolean = true


  ngOnInit(): void {
    this.getRecipeList();
  }

  //#region ListReceipe
  async getRecipeList() {
    await (this._api.listRecipe().subscribe(res => {
      const response: any = res;
      if (response.success == true) {
        this.recipeListArray = response.data.newArr;
        let recipeArray = [];
        this.recipeListArray.forEach((el: any) => {
          let parseKeyword: any = JSON.parse(el.keywords)
          parseKeyword.forEach((parse_el: any) => {
            recipeArray.push({ show: false, childShow: false, title: parse_el, recipename: el.recipe_title })
          })
        })
        //this.keyArray = [...new Set(recipeArray.map(item => item.title))];
        this.keywordArray = [...new Map(recipeArray.map((item: any) => [item["title"], item])).values()];
        this.cloneKeyArray = this.keywordArray

      } else {
      }
    }, err => {

    }));
  }
  //#endregion

  //#region Keyword Click
  keywordClick(title: any, check: boolean) {
    let selectedKeyword = [];
    this.keywordArray.forEach((csbel: any) => {
      if (csbel.title == title) csbel.show = !check
      if (csbel.show) selectedKeyword.push(csbel)
    })
    this.filteredRecipe = selectedKeyword;
  }
  //#endregion

  //#region Recipe Click
  recipeClickFun(data: any, check: any) {
    let recipeCount: any = 0;
    this.filteredRecipe.forEach((recipe_el: any) => {
      if (recipe_el.recipename == data) recipe_el.childShow = !check;
      if (recipe_el.childShow) { recipeCount++ };
    })
    this.recipeCountCheck = recipeCount === 0
    
  }
  //#endregion

  //#region search module filter
  searchModule(e: any) {
    if (e.target.value == '') {
      this.keywordArray = this.cloneKeyArray;
    }
    else {
      let keywordArr = []
      this.cloneKeyArray.forEach(element => {
        element.show = false;
        if (element.title.toLowerCase().indexOf(e.target.value) !== -1) {
          keywordArr.push(element)
        }
      });
      this.keywordArray = keywordArr;
    }
  }
  //#endregion

  //#region Function for Close Dialoge
  closeDialog() {
    this.dialogRef.close(JSON.stringify({ filterd: [] }));
  }
  //#endregion

  //#region Function for Reset Filter
  resetFilter() {
    this.dialogRef.close(JSON.stringify({ filterd: [] }));
  }
  //#endregion

  //#region Function for Apply Filter
  applyFilter() {
    let filteredArrayByKeword: any = [];
    this.recipeListArray.forEach((element: any) => {
      this.filteredRecipe.forEach((filtered_recipe: any) => {
        console.log(filtered_recipe.childShow)
        if (filtered_recipe.childShow) {
          if (filtered_recipe.recipename === element.recipe_title) {
            filteredArrayByKeword.push(element)
          }
        }
      })
    })
    console.log(filteredArrayByKeword)

    // this.dialogRef.close(JSON.stringify({ filterd: filteredArrayByKeword, indexes: this.data }));
  }
  //#endregion
}