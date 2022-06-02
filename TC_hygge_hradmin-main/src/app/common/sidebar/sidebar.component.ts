import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/service/chat-service.service';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import { SharedService } from 'src/app/service/shared.service';
import { environment } from './../../../environments/environment';
import * as PlansRoute from './../../helpers/plans.json';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  userData: any;
  moduleData: any = [];
  listHeader = [];
  readCount = 0;
  imgPath = environment.apiBaseUrl;
  plan: any
  pageRoute: any = PlansRoute;
  constructor(public router: Router, public sharedService: SharedService, public _api: CommonServiceService) {
    if (localStorage.getItem('userData')) {
      console.log(localStorage.getItem('userData'))
      this.userData = JSON.parse(localStorage.getItem('userData'));
      this.userData['letterPic'] =
        this.userData.first_name.charAt(0).toUpperCase() + "" + this.userData.last_name.charAt(0).toUpperCase()
    }
    this.sharedService.currentUser.subscribe(data => {
      if (data != '') {
        this.userData = JSON.parse(data);
        this.userData['letterPic'] =
          this.userData.first_name.charAt(0).toUpperCase() + "" + this.userData.last_name.charAt(0).toUpperCase()
      }
    });

    this.sharedService.messageCount.subscribe(data => {
      if (data != '') {
        this.readCount = Number(data);
      }
    });
    this.moduleData = JSON.parse(localStorage.getItem('userData')).moduleAccess;
    this.plan = this.userData.plan_Name.toLowerCase()
  }
  pages = []
  ngOnInit(): void {
    this.pages = this.pageRoute.default[this.plan]
    for (let item of this.pages) {
      if (item.children.length > 0) {
        for (let i of item.children) {
          if (i.url === this.router.url) {
            item.open = true;
          }
        }
      }
    }
    // for define access for user
    this.getRouteAccess(this.pages, this.moduleData);
  }

  getRouteAccess(page, module) {
    for (let item of page) {
      for (let mod of module) {
        if (mod.name == item.title) {
          item.access = mod.read;
          if (mod.children && mod.children.length > 0) {
            this.getRouteAccess(item.children, mod.children)
          }
        }
      }
    }
  }
}