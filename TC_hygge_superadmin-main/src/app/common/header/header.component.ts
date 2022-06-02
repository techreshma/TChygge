import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  profilePic:any = '';
  firstNameInitial:any = '';
  lastNameInitial:any = '';
  elem: any;
  imgUrl: any = environment.apiBaseUrl
  isFullScreen: boolean;
  @Output('toggleMenu') toggelMenu: EventEmitter<any> = new EventEmitter();
  constructor(@Inject(DOCUMENT) private document: any,public router: Router) { }

  ngOnInit(): void {
    this.elem = document.documentElement;
    this.getUserData();
  }

  getUserData() {
    let superAdminData = JSON.parse(localStorage.getItem('userData'));
    this.profilePic = superAdminData.profile_picture;
    this.firstNameInitial = superAdminData.first_name.charAt(0).toUpperCase();
    this.lastNameInitial = superAdminData.last_name.charAt(0).toUpperCase();
  }

  toggelChild(): void {
    this.toggelMenu.emit();
  }
  logout() {
    localStorage.removeItem('userData');
    localStorage.removeItem('token')
    this.router.navigate(['/']);
  }

  openFullscreen() {
    if (this.elem.requestFullscreen) {
      this.elem.requestFullscreen();
    } else if (this.elem.mozRequestFullScreen) {
      /* Firefox */
      this.elem.mozRequestFullScreen();
    } else if (this.elem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      this.elem.webkitRequestFullscreen();
    } else if (this.elem.msRequestFullscreen) {
      /* IE/Edge */
      this.elem.msRequestFullscreen();
    }
    this.isFullScreen = true;
  }
  /* Close fullscreen */
  closeFullscreen() {
    if (this.document.exitFullscreen) {
      this.document.exitFullscreen();
    } else if (this.document.mozCancelFullScreen) {
      /* Firefox */
      this.document.mozCancelFullScreen();
    } else if (this.document.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      this.document.webkitExitFullscreen();
    } else if (this.document.msExitFullscreen) {
      /* IE/Edge */
      this.document.msExitFullscreen();
    }
    this.isFullScreen = false
  }
}
