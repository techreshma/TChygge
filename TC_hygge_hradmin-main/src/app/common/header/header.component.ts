import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ConfirmDialogModel } from 'src/app/confirm-box/confirm-box.component';
import { CallComponent } from 'src/app/container/other/chat/call/call.component';
import { ChatService } from 'src/app/service/chat-service.service';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import { SharedService } from 'src/app/service/shared.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  userData: any;
  elem: any;
  finalIndexOfCall = null;
  interval;
  listHeader = [];
  letMsgId = null;
  messageListHeader = [];
  isFullScreen: boolean;
  imgPath = environment.apiBaseUrl;
  plan: any;
  @Output('toggleMenu') toggelMenu: EventEmitter<any> = new EventEmitter();
  constructor(@Inject(DOCUMENT) private document: any, public sharedService: SharedService, public router: Router, public dialog: MatDialog, public _api: CommonServiceService, private chat: ChatService, public ngxService: NgxUiLoaderService, public _snackBar: MatSnackBar) {
    this.userData = JSON.parse(localStorage.getItem('userData'))
  }

  ngOnInit(): void {
    this.elem = document.documentElement;
    this.sharedService.currentUser.subscribe(data => {
      if (data != '') {
        this.userData = JSON.parse(data);
      }
    });
    this.plan = JSON.parse(localStorage.getItem('userData')).plan_Name.toLowerCase();
    // console.log('msg.message.groupDetailChat_Id', this.plan);
    if (this.plan == 'lite' || this.plan == 'plus' || this.plan == 'premium') {
      this.chat.messages.subscribe(msg => {
        if (JSON.parse(localStorage.getItem('userData')).user_id != msg.message.sender_Id) {
          this.letMsgId = this.listHeader.findIndex(item => item.groupDetailChat_Id == msg.message.groupDetailChat_Id);
          if (this.letMsgId != null && this.letMsgId > -1) {
            this.openSnackBar('You got a new message');
            if (msg.message.fileType == '3') {
              this.startTimer()
              this.openCall(msg.message.message)
            }
          }
        }
        if (this.letMsgId != -1) {
          this.groupList()
        }

      })

      this.groupList();
    }

  }

  getNotification() {
    this.router.navigate(['/notification'])
  }

  async groupList() {
    let formData = {
      user_Id: JSON.parse(localStorage.getItem('userData')).user_id
    }
    await (this._api.GroupList(formData).subscribe(res => {
      const response: any = res;
      if (response.success == true) {
        this.listHeader = response.data;
        let readsCount = 0
        for (let item of response.data) {
          readsCount += parseInt(item.readCount)
        }
        this.sharedService.changeCount(readsCount.toString());
        this.letMsgId = null;
      } else {
      }
      console.log(res);
    }, err => {
      const error = err.error;
    }));
  }

  startTimer() {
    this.interval = setInterval(() => {
      var audio = new Audio('./../../../../assets/ring.mp3');
      audio.play();
    }, 4000)
  }
  // open call screen
  openCall(msg): void {
    let message = `You got a call. please perform action`;

    const dialogData = new ConfirmDialogModel('Incoming Call', message);

    const dialogRef = this.dialog.open(CallComponent, {
      width: '300px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      clearInterval(this.interval);

      if (dialogResult) {
        let d = msg.message;
        window.open(d)
      }
    });
  }
  toggelChild(): void {
    this.toggelMenu.emit();
  }
  logout() {
    localStorage.clear();
    // localStorage.removeItem('userData');
    // localStorage.removeItem('token')
    this.router.navigate(['/login']);
  }

  // Open full screen
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


  // alert message after api response success
  openSnackBar(msg) {
    this._snackBar.open(msg, 'Ok', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['success-alert']
    });
  }
}
