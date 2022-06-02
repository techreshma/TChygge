import { AfterViewInit, Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subscription } from 'rxjs';
import { SpeedDialFabPosition } from 'src/app/helpers/speed-dial-fab/speed-dial-fab.component';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import { environment } from 'src/environments/environment';
import { ChatService } from '../../../service/chat-service.service';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { UploadComponent } from './upload/upload.component';
import { ConfirmBoxComponent, ConfirmDialogModel } from 'src/app/confirm-box/confirm-box.component';
import { CallComponent } from './call/call.component';
import { BackupComponent } from './backup/backup.component';
import { SharedService } from 'src/app/service/shared.service';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('scrollDi', { static: true }) scroll: any;
  @HostListener("window:scroll", ['$event'])
  selectedTab = 0;
  slectedChatUser: any;
  addGroupShow: boolean;
  selectedUserId = null;
  memberShow: boolean;
  selectable = true;
  removable = true;
  offset: number = 0;
  formGroup = {
    "group_Name": "",
    "groupAdmin_Id": JSON.parse(localStorage.getItem('userData')).user_id,
    "company_Id": JSON.parse(localStorage.getItem('userData')).company_id,
    "group_Description": "",
    "profile_picture": "",
    "ip_Address": "12.43.22.22",
    "isGroup": "0",
    "userDetail": []
  }
  grpName: string = '';
  chatSearch = '';
  searchShow: boolean = false;
  tabShow = false;
  showEmo: boolean;
  list = [];
  public speedDialFabButtons = [
    {
      icon: 'insert_drive_file',
      tooltip: 'Attach doc',
      color: 'info'
    },
    {
      icon: 'camera_alt',
      tooltip: 'Attach image',
      color: 'accent'
    },
  ];
  interval;
  listUser: any = []
  listUserTemp: any = []
  selectedUser = [];
  imgPath = environment.apiBaseUrl
  SpeedDialFabPosition = SpeedDialFabPosition;
  speedDialFabColumnDirection = 'column';
  speedDialFabPosition = SpeedDialFabPosition.Top;
  speedDialFabPositionClassName = 'speed-dial-container-bottom';
  subscribeChat: Subscription;
  userId: any;
  setMessageDataType: boolean
  GroupMembers: any = []
  finalIndexOfCall = null;
  addMoreUser: boolean;
  newMessage: string = '';
  messageList = [];
  letMsgId = null;
  userData: any;
  interval1;
  constructor(public sharedService: SharedService, public dialog: MatDialog, public _api: CommonServiceService, private chat: ChatService, public ngxService: NgxUiLoaderService, public _snackBar: MatSnackBar,) {
    this.userData = JSON.parse(localStorage.getItem('userData'))
    this.userId = JSON.parse(localStorage.getItem('userData')).user_id
  }

  ngOnInit() {

    this.startGroupTimer()
    this.chat.messages.subscribe(msg => {
      this.startGroupTimer()
      this.selectedUserId = null;
      this.finalIndexOfCall = this.findLastIndex(this.messageList, 'fileType', 3)
      this.chatViewByUser();
      if (JSON.parse(localStorage.getItem('userData')).user_id != msg.message.sender_Id) {
        this.letMsgId = this.list.findIndex(item => item.groupDetailChat_Id == msg.message.groupDetailChat_Id);
      }
      if (this.letMsgId > -1) {
        this.groupList()
        this.getList();
      }
      if (msg.message.groupDetailChat_Id == this.slectedChatUser.groupDetailChat_Id) {
        this.messageList.push(msg.message)
        setTimeout(() => {
          this.scroll.nativeElement.scrollTop = this.scroll.nativeElement.scrollHeight;
        }, 500)

      }


    })
    this.getList();
    this.groupList();
  }

  startGroupTimer() {
    this.interval1 = setInterval(() => {
      if (this.list.length == 0) {
        this.groupList()
      } else {
        clearInterval(this.interval1);
      }
    }, 10000)
  }

  startTimer() {
    this.interval = setInterval(() => {
      var audio = new Audio('./../../../../assets/ring.mp3');
      audio.play();
    }, 4000)
  }
  scrollMe(event) {
    if (this.scroll.nativeElement.scrollTop == 0) {
      this.chatMessage(this.slectedChatUser, 0)
    }
  }
  sendMessage() {
    let message = {
      "userAssignChat_Id": JSON.parse(localStorage.getItem('userData')).user_id,
      "groupDetailChat_Id": this.slectedChatUser.groupDetailChat_Id,
      "sender_Id": JSON.parse(localStorage.getItem('userData')).user_id,
      "message": this.newMessage,
      "ip_Address": "12345",
      "fileType": 0,
      "messageTime": moment().format('HH:mm'),
      "messageDate": moment().format('YYYY-MM-DD'),
      "name": JSON.parse(localStorage.getItem('userData')).first_name
    }
    this.chat.sendMsg(message);
    this.newMessage = '';
    setTimeout(() => {
      this.scroll.nativeElement.scrollTop = this.scroll.nativeElement.scrollHeight;
    }, 500)
  }
  ngAfterViewInit() {

  }
  action = (a) => { };

  addEmoji = (e) => {
    this.newMessage = this.newMessage + e.char;
  }

  //Searching
  applyFilter(event: Event) {
    if (!event) {
      this.getList()
    } else {
      const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
      this.listUser = this.listUserTemp.filter(item => item.name.toLowerCase().includes(filterValue));
    }
  }



  // Get Employee List
  async getList() {
    // this.ngxService.start();
    let formData = {
      "company_id": JSON.parse(localStorage.getItem('userData')).company_id,
      "user_Id": JSON.parse(localStorage.getItem('userData')).user_id
    }
    await (this._api.ChatUserList(formData).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        this.listUser = response.data;
        this.listUserTemp = response.data;
      } else {
      }
    }, err => {
      const error = err.error;
      this.ngxService.stop();
    }));

  }


  async addGroup(grp) {
    this.formGroup.userDetail.push({ user_Id: JSON.parse(localStorage.getItem('userData')).user_id, ip_Address: '444' })
    for (let item of this.selectedUser) {
      this.formGroup.userDetail.push({
        "user_Id": item.user_id,
        "ip_Address": "12.2.32"
      })
    }
    this.formGroup.isGroup = grp;
    this.ngxService.start();
    await (this._api.createGroup(this.formGroup).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        if (grp == 1) {
          this.openSnackBar(response.message)

        }
        this.selectedUserId = response.data
        this.formGroup.userDetail = [];
        this.selectedUser = [];
        this.tabShow = false;
        this.addGroupShow = false;
        this.selectedTab = 0;
        this.groupList()
      } else {
        this.openErrrorSnackBar(response.message);
      }
    }, err => {
      const error = err.error;
      this.ngxService.stop();
      this.openErrrorSnackBar(error.message);
    }));
  }

  async UpdateGroup() {
    for (let item of this.selectedUser) {
      this.formGroup.userDetail.push({
        "user_Id": item.user_id,
        "ip_Address": "12.2.32", "groupDetailChat_Id": this.slectedChatUser.groupDetailChat_Id
      })
    }
    this.ngxService.start();
    await (this._api.updateGroup(this.formGroup).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        this.openSnackBar(response.message)
        this.formGroup.userDetail = [];
        this.selectedUser = [];
        this.tabShow = false;
        this.addGroupShow = false;
        this.selectedTab = 0;
        this.memberShow = false;
        this.addMoreUser = false;
        this.groupList()
        this.groupUserList()
      } else {
        this.openErrrorSnackBar(response.message);
      }
    }, err => {
      const error = err.error;
      this.ngxService.stop();
      this.openErrrorSnackBar(error.message);
    }));
  }

  async groupList() {
    let colors = ['#3F51B5', ' #FFAA00', '#C86CE6', '#FF4081', '#15C1DC']
    let formData = {
      user_Id: JSON.parse(localStorage.getItem('userData')).user_id
    }
    await (this._api.GroupList(formData).subscribe(res => {

      this.list = []
      const response: any = res;
      if (response.success == true) {
        for (let item of response.data) {
          item.color = colors[Math.floor(Math.random() * colors.length)]
          item.notBatch = false;
        }
        for (let item of response.data) {
          if (item.isUserDelete == 1) {
            this.list.push(item)
          }
        }
        let readsCount = 0
        for (let item of this.list) {
          readsCount += parseInt(item.readCount)
        }
        this.sharedService.changeCount(readsCount.toString());
        let id = this.list.findIndex(item => item.groupDetailChat_Id == this.selectedUserId);
        id > -1 && (this.chatMessage(this.list[id], 0));
        if (id > -1 && this.list[id].readCount != 0) {
          this.chatViewByUser()
        }
        if (!this.setMessageDataType) {
          this.chatMessage(this.list[0], 0)
        }

        this.letMsgId = null;
      } else {
        this.openErrrorSnackBar(response.message);
      }
    }, err => {
      const error = err.error;
      this.openErrrorSnackBar(error.message);
    }));
  }


  async chatMessage(item, num) {
    if (item && item.groupDetailChat_Id) {
      if (this.slectedChatUser && this.slectedChatUser.groupDetailChat_Id != item.groupDetailChat_Id) {
        this.messageList = [];
        this.offset = 0;
      }
      // if(this.letMsgId !== null && this.list[this.letMsgId].groupDetailChat_Id == item.groupDetailChat_Id){
      //   this.groupList()
      // }
      this.slectedChatUser = item;
      this.slectedChatUser.notBatch = false;
      this.chatViewByUser();
      this.groupUserList()

      let formData = {
        userAssignChat_Id: JSON.parse(localStorage.getItem('userData')).user_id,
        groupDetailChat_Id: item.groupDetailChat_Id,
        search: this.chatSearch,
        offset: this.offset
      }
      await (this._api.chatMessage(formData).subscribe(res => {
        this.selectedUserId = null;
        const response: any = res;
        if (response.success == true) {
          this.messageList = [...response.data, ...this.messageList];
          this.finalIndexOfCall = this.findLastIndex(this.messageList, 'fileType', 3)
          this.setMessageDataType = true;
          if (this.offset == 0) {
            setTimeout(() => {
              this.scroll.nativeElement.scrollTop = this.scroll.nativeElement.scrollHeight;
            }, 500)
          }
          if (num == 1) {
            let d = this.messageList.filter(item => item.message.includes(this.chatSearch))
            if (d.length > 0) {
              let id = 'id_' + d[0].messageChat_id
              setTimeout(() => {
                document.getElementById(id).scrollIntoView({
                  behavior: 'smooth'
                });
              }, 500)
            }
          }
          this.offset = this.messageList.length;

        } else {
          this.openErrrorSnackBar(response.message);
        }
      }, err => {
        const error = err.error;
        this.openErrrorSnackBar(error.message);
      }));
    }

  }

  findLastIndex(array, searchKey, searchValue) {
    var index = array.slice().reverse().findIndex(x => x[searchKey] === searchValue);
    var count = array.length - 1
    var finalIndex = index >= 0 ? count - index : index;
    return finalIndex;
  }
  async groupUserList() {
    let formData = {
      groupDetailChat_Id: this.slectedChatUser.groupDetailChat_Id
    }
    await (this._api.groupUserLis(formData).subscribe(res => {
      const response: any = res;
      if (response.success == true) {
        this.GroupMembers = response.data;
      } else {
        this.openErrrorSnackBar(response.message);
      }

    }, err => {
      const error = err.error;
      this.openErrrorSnackBar(error.message);
    }));
  }

  //user leave group
  async leaveGroup(groupDetailChat_Id) {
    let formData = {
      groupDetailChat_Id: groupDetailChat_Id,
      user_Id: JSON.parse(localStorage.getItem('userData')).user_id,
      ip_Address: '11.2.2.12'

    }
    await (this._api.leaveGroup(formData).subscribe(res => {
      const response: any = res;
      if (response.success == true) {
        this.openSnackBar(response.message)
        // this.setMessageDataType = false;
        this.groupList()
        if (this.slectedChatUser.oneTomany) {
          let msg = 'Leave this group';
          let message = {
            "userAssignChat_Id": JSON.parse(localStorage.getItem('userData')).user_id,
            "groupDetailChat_Id": this.slectedChatUser.groupDetailChat_Id,
            "sender_Id": JSON.parse(localStorage.getItem('userData')).user_id,
            "message": JSON.parse(localStorage.getItem('userData')).first_name + ' ' + JSON.parse(localStorage.getItem('userData')).last_name + ' ' + msg,
            "ip_Address": "12345",
            "fileType": 2,
            "messageTime": moment().format('HH:mm'),
            "messageDate": moment().format('YYYY-MM-DD'),
            "name": JSON.parse(localStorage.getItem('userData')).first_name + ' ' + JSON.parse(localStorage.getItem('userData')).last_name
          }
          this.chat.sendMsg(message);
        }

        this.newMessage = '';

        setTimeout(() => {
          this.scroll.nativeElement.scrollTop = this.scroll.nativeElement.scrollHeight;
        }, 500)

      } else {
        this.openErrrorSnackBar(response.message);
      }
    }, err => {
      const error = err.error;
      this.openErrrorSnackBar(error.message);
    }));
  }

  // admin group remove
  async deleteGroup(groupDetailChat_Id) {
    let formData = {
      groupDetailChat_Id: groupDetailChat_Id,
      user_Id: JSON.parse(localStorage.getItem('userData')).user_id

    }
    await (this._api.deleteGroup(formData).subscribe(res => {
      const response: any = res;
      if (response.success == true) {
        this.openSnackBar(response.message)
        this.tabShow = false;
        if (this.slectedChatUser.oneTomany) {
          let msg = 'Leave this group';
          let message = {
            "userAssignChat_Id": JSON.parse(localStorage.getItem('userData')).user_id,
            "groupDetailChat_Id": this.slectedChatUser.groupDetailChat_Id,
            "sender_Id": JSON.parse(localStorage.getItem('userData')).user_id,
            "message": JSON.parse(localStorage.getItem('userData')).first_name + ' ' + JSON.parse(localStorage.getItem('userData')).last_name + ' ' + msg,
            "ip_Address": "12345",
            "fileType": 2,
            "messageTime": moment().format('HH:mm'),
            "messageDate": moment().format('YYYY-MM-DD'),
            "name": JSON.parse(localStorage.getItem('userData')).first_name + ' ' + JSON.parse(localStorage.getItem('userData')).last_name
          }
          this.chat.sendMsg(message);
        }
        this.chatMessage(this.list.length > 0 ? this.list[0] : {}, 0)
        this.groupList()
      } else {
        this.openErrrorSnackBar(response.message);
      }
    }, err => {
      const error = err.error;
      this.openErrrorSnackBar(error.message);
    }));
  }

  async vedioGroupCall(groupDetailChat_Id) {
    let formData = {
      groupDetailChat_Id: groupDetailChat_Id,
      user_Id: JSON.parse(localStorage.getItem('userData')).user_id

    }
    await (this._api.vedioGroupCall(formData).subscribe(res => {
      const response: any = res;
      if (response.success == true) {
        let message = {
          "userAssignChat_Id": JSON.parse(localStorage.getItem('userData')).user_id,
          "groupDetailChat_Id": this.slectedChatUser.groupDetailChat_Id,
          "sender_Id": JSON.parse(localStorage.getItem('userData')).user_id,
          "message": response.data,
          "ip_Address": "12345",
          "fileType": 3,
          "messageTime": moment().format('HH:mm'),
          "messageDate": moment().format('YYYY-MM-DD'),
          "name": JSON.parse(localStorage.getItem('userData')).first_name + ' ' + JSON.parse(localStorage.getItem('userData')).last_name
        }
        this.chat.sendMsg(message);
        this.newMessage = '';
        setTimeout(() => {
          this.scroll.nativeElement.scrollTop = this.scroll.nativeElement.scrollHeight;
          window.open(response.data)
        }, 500)

      } else {
        this.openErrrorSnackBar(response.message);
      }
    }, err => {
      const error = err.error;
      this.openErrrorSnackBar(error.message);
    }));
  }

  async chatViewByUser() {
    let formData = {
      groupDetailChat_Id: this.slectedChatUser.groupDetailChat_Id,
      user_Id: JSON.parse(localStorage.getItem('userData')).user_id

    }
    await (this._api.chatViewByUser(formData).subscribe(res => {
      const response: any = res;
      if (response.success == true) {
        this.groupList()
      } else {
        // this.openErrrorSnackBar(response.message);
      }
    }, err => {
      const error = err.error;
      this.openErrrorSnackBar(error.message);
    }));
  }

  cancelAll() {

    this.selectedUser = [];
    this.tabShow = false;
    this.addGroupShow = false;
  }

  selectUser(item) {
    const index = this.selectedUser.indexOf(item);

    if (index < 0) {
      this.selectedUser.push(item)
    }

  }
  remove(item): void {
    const index = this.selectedUser.indexOf(item);

    if (index >= 0) {
      this.selectedUser.splice(index, 1);
    }
  }
  chkBadge(item) {
    const index = this.selectedUser.indexOf(item);

    if (index >= 0) {
      return false
    } else {
      return true
    }
  }
  startChat(item) {
    this.selectedUser.push(item)
    this.addGroup(0)
  }

  ngOnDestroy() {
  }

  onScrollDown() {
  }

  onScrollUp() {
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


  // send type of message button function
  onSpeedDialFabClicked(btn: { icon: string }) {
    const dialogRef = this.dialog.open(UploadComponent, {
      width: '50%',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("DialogRef", JSON.parse(result))
      let message = {
        "userAssignChat_Id": JSON.parse(localStorage.getItem('userData')).user_id,
        "groupDetailChat_Id": this.slectedChatUser.groupDetailChat_Id,
        "sender_Id": JSON.parse(localStorage.getItem('userData')).user_id,
        "message": JSON.parse(result),
        "ip_Address": "12345",
        "fileType": 1,
        "messageTime": moment().format('HH:mm'),
        "messageDate": moment().format('YYYY-MM-DD'),
        "name": JSON.parse(localStorage.getItem('userData')).first_name + ' ' + JSON.parse(localStorage.getItem('userData')).last_name
      }
      this.chat.sendMsg(message);
      this.newMessage = ''
    });
  }


  // search chat history
  shareChatHistory(groupId: any) {
    const dialogRef = this.dialog.open(BackupComponent, {
      data: {
        groupId: groupId
      },
      width: '50%',
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }


  // check file type send in chat
  chkFileType(item) {
    let v = item.split('.')
    return v[1] !== undefined ? v[1].toLowerCase() : v[0].toLowerCase();
  }

  //searching in chat
  searchInChat(event) {
    let d = this.messageList.filter(item => item.message.includes(event.target.value))
    if (d.length > 0) {
      let id = 'id_' + d[0].messageChat_id
      document.getElementById(id).scrollIntoView({
        behavior: 'smooth'
      });
    } else {
      this.chatMessage(this.slectedChatUser, 1);
    }
  }

  //open jitsi call

  goToCall(link) {
    window.open(link)
  }

  // confirm message
  confirmLeave(event): void {

    let message = `Are you sure you want to leave this group?`;
    if (event.oneTomany && event.oneTomany == 1) {
      if (event.groupAdmin_Id == JSON.parse(localStorage.getItem('userData')).user_id) {
        message = `Be carefull if you remove this group all messages and info are permanantly removed`;
      }
    } else {
      if (event.groupAdmin_Id == JSON.parse(localStorage.getItem('userData')).user_id) {
        message = `Be carefull if you remove this chat all messages and info are permanantly removed`;
      } else {
        message = `Are you sure you want to delete this chat?`;
      }
    }


    const dialogData = new ConfirmDialogModel('Confirm Action', message);

    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      maxWidth: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        if (event.oneTomany && event.oneTomany == 1) {
          if (event.groupAdmin_Id == JSON.parse(localStorage.getItem('userData')).user_id) {
            this.deleteGroup(event.groupDetailChat_Id)
          } else {
            this.leaveGroup(event.groupDetailChat_Id);
          }
        } else {
          this.leaveGroup(event.groupDetailChat_Id)
        }
      }
    });
  }

  getSelUser(val) {
    let d = this.GroupMembers.findIndex(item => item.user_Id == val.user_id)
    if (d == -1) {
      return true
    }
    return false

  }
}
