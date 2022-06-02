import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AccessServiceService } from 'src/app/service/access-service.service';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-recipe-view',
  templateUrl: './recipe-view.component.html',
  styleUrls: ['./recipe-view.component.scss']
})
export class RecipeViewComponent implements OnInit {

  graphData: any;
  responseData: any;

  catId: any;
  postId: any;
  accessPermission: any;
  images: any = [];
  keywords: any = []
  ingredients: any = []
  imgPath = environment.apiBaseUrl;
  constructor(public route: ActivatedRoute, public _access: AccessServiceService, public _api: CommonServiceService, public ngxService: NgxUiLoaderService) {
    this.catId = this.route.snapshot.params.catid;
    this.postId = this.route.snapshot.params.id;
  }

  ngOnInit(): void {
    this.accessPermission = this._access.getRouteAccess('User roles', JSON.parse(localStorage.getItem('userData')).moduleAccess);
    this.PostDetails();

  }


  // Get Post Details
  async PostDetails() {
    let formGroup = {
      "recipes_id": this.postId
    }
    this.ngxService.start();
    await (this._api.detailRecipes(formGroup).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        this.responseData = response.data[0];
        this.graphData = JSON.stringify({ label: ['Views', 'Likes', 'Dislikes'], percentage: [this.responseData.views, this.responseData.likes, this.responseData.dislikes], colors: ['#15C1DC', '#FFAA27', '#F44336'] })
        this.keywords = JSON.parse(this.responseData.keywords)
        this.ingredients = JSON.parse(this.responseData.ingredients)
        for (let item of JSON.parse(this.responseData.recipe_image)) {
          let im = item.split('.');
          if (im[1].toLowerCase() == 'png' || im[1].toLowerCase() == 'jpg' || im[1].toLowerCase() == 'jpeg' || im[1].toLowerCase() == 'gif') {
            let obj = {
              image: `${this.imgPath}${item}`,
              thumbImage: `${this.imgPath}${item}`,
              alt: '',
              title: ''
            }
            this.images.push(obj)
          } else {
            this.images.push({
              video: `${this.imgPath}${item}`,
              posterImage: './assets/img/thumb.jpg',
              title: '',
              alt: ''
            })
          }
        }
      } else {
      }
      console.log(res);
    }, err => {
      const error = err.error;
      this.ngxService.stop();
    }));

  }

}
