import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  moduleData: any = [];
  userData: any;
  imgPath = environment.apiBaseUrl;
  constructor(public router: Router) {
    if (localStorage.getItem('userData')) {
      this.userData = JSON.parse(localStorage.getItem('userData'))

      if (!this.userData.profile_picture.startsWith("http")) {
        this.userData.profile_picture = environment.apiBaseUrl + "" + this.userData.profile_picture;
      }
      //el.reward_Image.split('://')
    };

    this.moduleData = JSON.parse(localStorage.getItem('userData')).moduleAccess;
    // console.log(this.moduleData)
  }

  pages = [
    {
      title: 'Dashboard',
      url: '/dashboard',
      open: false,
      icon: 'dashboard',
      children: [],
      access: true,
    },
    {
      title: 'Companies',
      url: '/company',
      open: false,
      icon: 'business',
      children: [],
      access: true,
    },
    {
      title: 'HRA Questionnaire',
      url: '/dasbhoard',
      open: false,
      icon: 'spa',
      children: [
        {
          title: 'Health & Wellness',
          url: '/hra',
          open: false,
          icon: 'stop_circle',
          children: [],
          access: true,
        },
        {
          title: 'Reports',
          url: '/hra-reports',
          open: false,
          icon: 'stop_circle',
          access: true,
          children: []
        },
      ],
      access: true,
    },
    {
      title: 'Roles & access',
      url: '/dashboard',
      open: false,
      icon: 'accessibility',
      access: true,
      children: [
        {
          title: 'User roles',
          url: '/user-roles',
          open: false,
          icon: 'stop_circle',
          children: [],
          access: true,
        },
        {
          title: 'Access',
          url: '/access',
          open: false,
          icon: 'stop_circle',
          access: true,
          children: []
        },
      ]
    },
    {
      title: 'Sub Admin',
      url: '/sub-admin',
      open: false,
      icon: 'supervisor_account',
      access: true,
      children: []
    },
    {
      title: 'Surveys',
      url: '/dashboard',
      open: false,
      icon: 'fact_check',
      access: true,
      children: [
        {
          title: 'Active Survey',
          url: '/survey-list',
          open: false,
          icon: 'stop_circle',
          children: [],
          access: true,
        },
        {
          title: 'Create New',
          url: '/select-survey',
          open: false,
          icon: 'stop_circle',
          children: [],
          access: true,
        },
        {
          title: 'Initiate Survey', //Initiate 
          url: '/survey-initiate',
          open: false,
          icon: 'stop_circle',
          children: [],
          access: true,
        },
        {
          title: 'Response & Status',
          url: '/expired-survey',
          open: false,
          icon: 'stop_circle',
          children: [],
          access: true,
        },
      ]
    },
    {
      title: 'Announcements',
      url: '/notification',
      open: false,
      icon: 'announcement',
      children: [],
      access: true,
    },
    {
      title: 'My Coach',
      url: '/my-coach',
      open: false,
      icon: 'model_training',
      access: true,
      children: []
    },
    {
      title: "Reports",
      url: "/reports",
      open: false,
      icon: "dns",
      children: [],
      access: true
    },
    {
      title: 'divider',
      url: '/dashboard',
      open: false,
      icon: 'sentiment_satisfied',
      children: [],
      access: true,
    },
    {
      title: 'Challenges',
      url: '/challange-list',
      open: false,
      icon: 'task',
      children: [],
      access: true,
    },
    {
      title: 'Rewards',
      url: '/reward-list',
      open: false,
      icon: 'emoji_events',
      access: true,
      children: []
    },
    {
      title: 'Badges',
      url: '/badges',
      open: false,
      icon: 'verified',
      access: true,
      children: []
    },
    {
      title: 'divider',
      url: '/dashboard',
      open: false,
      icon: 'sentiment_satisfied',
      children: [],
      access: true,
    },
    {
      title: 'Setting',
      url: '/setting',
      open: false,
      icon: 'admin_panel_settings',
      access: true,
      children: []
    },
  ]
  ngOnInit(): void {
    // for(let item of this.pages){
    //   if(item.children.length > 0){
    //     for(let i of item.children){
    //       if(i.url === this.router.url){
    //         item.open = true;
    //       }
    //     }
    //   }
    // }
    // // for define access for user
    // this.getRouteAccess(this.pages,this.moduleData);
  }

  getRouteAccess(page, module) {
    // for(let item of page){
    //   for(let mod of module){
    //     if(mod.name == item.title){
    //       item.access = mod.read;
    //       if(mod.children && mod.children.length > 0){
    //         this.getRouteAccess(item.children,mod.children)
    //       }
    //     }
    //   }
    // }
  }

}
