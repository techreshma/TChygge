import { Component, OnInit } from '@angular/core';

import { CommonServiceService } from 'src/app/service/comman-service.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import {
  MatSnackBar
} from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-role-add',
  templateUrl: './role-add.component.html',
  styleUrls: ['./role-add.component.scss']
})
export class RoleAddComponent implements OnInit {
  formData = {
    role_Type :'',
    status :'1',
    ip_Address:'111',
    modules:[]
  }
  constructor(public _api: CommonServiceService, public ngxService: NgxUiLoaderService, public _snackBar: MatSnackBar, public dialogRef: MatDialogRef<RoleAddComponent>) { }

  ngOnInit(): void {
    this.getAccessModule();
  }

  // Get Role Type
async getAccessModule(){
  this.ngxService.start();
  let data = {
    "isType":1
  }
  await(this._api.accessModuleList(data).subscribe(res => {
    this.ngxService.stop();
    const response: any = res;
    if (response.success == true){
      console.log(response.data)
      this.formData.modules = this.getModuleDatainSequence(response.data);
    }else{
    }
  },err => {
    const error = err.error;
    this.ngxService.stop();
  }));

}


//create node from module data
getModuleDatainSequence(data){
  let arr = []
  for(let item of data){
    if(item.moduleCat_Id == 0){
      let obj = {
        access_id:item.access_id,
        name: item.moduleName,
        read:  false,
        write: false,
        both : false,
        children: []
      }
      arr.push(obj);
    }else{
      for(let sub of arr){
        if(sub.access_id == item.moduleCat_Id){
          sub.children.push({
            access_id:item.access_id,
            name: item.moduleName,
            read:  false,
            write: false,
            both : false,
            children: []
          })
        }
      }
    }
  }
  return arr;
}

  // add new role
  async addRole(){
    this.formData['isType'] = 1;
    await(this._api.addRole(this.formData).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true){
        this.openSnackBar(response.message);
      }else{
        this.openErrrorSnackBar(response.message);
      }
      console.log(res);
        this.dialogRef.close('Close');
    },err => {
      const error = err.error;
      this.openErrrorSnackBar(error.message);
      this.ngxService.stop();
    }));
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
