import { Component, OnInit } from '@angular/core';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import {MatTreeFlatDataSource, MatTreeFlattener, MatTreeNestedDataSource} from '@angular/material/tree';

import {
  MatSnackBar
} from '@angular/material/snack-bar';
import { NestedTreeControl } from '@angular/cdk/tree';


interface ModuleNode {
  name: string;
  read: boolean;
  write:boolean;
  both: boolean;
  children?: ModuleNode[];
}


@Component({
  selector: 'app-access',
  templateUrl: './access.component.html',
  styleUrls: ['./access.component.scss']
})
export class AccessComponent implements OnInit {
  name:'';
  formData = {
    "role":"",
    "modules":[],
    "ip_Address":"123.32.22.11",
    "companyId":''
  }
  roleType:any;
  roleData:any = [];

  moduleSet:any = []
  accessModuleData: ModuleNode[] = []

  treeControl = new NestedTreeControl<ModuleNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<ModuleNode>();
  constructor( public _api: CommonServiceService, public ngxService: NgxUiLoaderService, public _snackBar: MatSnackBar) {
    this.dataSource.data = this.accessModuleData;
  }

  ngOnInit(): void {
    this.formData.companyId = JSON.parse(localStorage.getItem('userData')).company_id;
    this.getRole();
  }
// Get Role Type
async getRole(){
  this.ngxService.start();
  await(this._api.getRole().subscribe(res => {
    this.ngxService.stop();
    const response: any = res;
    if (response.success == true){
      console.log(response.data)
      for(let item of response.data){
        if(item.status == '1' && item.userRole_id != 1){
          this.roleData.push(item)
        }
      }
      console.log(this.roleData)
      this.formData.role = this.roleData[0].userRole_id;
      this.getAccessModulebyRole();
    }else{
    }
    console.log(res);
  },err => {
    const error = err.error;
    this.ngxService.stop();
  }));

}


// Get Role Type
async getAccessModulebyRole(){
  let data = {
    role:this.formData.role,
    companyId:JSON.parse(localStorage.getItem('userData')).company_id

  }
  this.ngxService.start();
  await(this._api.accessDetail(data).subscribe(res => {
    this.ngxService.stop();
    const response: any = res;
    if (response.success == true){
      console.log(response.data)
      this.accessModuleData = response.data;
      console.log(this.accessModuleData)
      this.dataSource.data = this.accessModuleData;
    }else{
    }
    console.log(res);
  },err => {
    const error = err.error;
    this.ngxService.stop();
  }));

}

// Save Access

async save(){
  this.formData.modules = this.accessModuleData;
  this.ngxService.start();
  await(this._api.accessAllocation(this.formData).subscribe(res => {
    this.ngxService.stop();
    const response: any = res;
    if (response.success == true){
      this.openSnackBar(response.message)
    }else{
      this.openErrrorSnackBar(response.message)
    }
    console.log(res);
  },err => {
    const error = err.error;
    this.openErrrorSnackBar(error.message)
    this.ngxService.stop();
  }));
}


hasChild = (_: number, node: ModuleNode) => !!node.children && node.children.length > 0;

// update module access
async updateCheck(v,e,d){
  if(v == 'both'){
    await this.updateParent(this.accessModuleData,'read',e,d)
    await this.updateParent(this.accessModuleData,'write',e,d)
    await this.updateParent(this.accessModuleData,v,e,d)
  }else{
    await this.updateParent(this.accessModuleData,v,e,d)
  }
}
updateParent(t,v,e,d){
  t.map(item=>{
    if(item.name == e.name){
      item[v] = d;
      if(item.read && item.write){
        item.both = true
      }else{
        item.both = false;
      }
      this.moduleSet.push(item)
      if(item.children){
        return this.updateChildren(item.children,v,e,d)
      }else{
        return;
      }

    }else if(item.children){
      return this.updateParent(item.children,v,e,d)
    }else{
      return;
    }
  })
}
updateChildren(t,v,e,d){
  t.map(item=>{
    item[v] = d;
    this.moduleSet.push(item)
    if(item.children){
      return this.updateChildren(item.children,v,e,d)
    }else{
      return;
    }
  })
}


//Searching
filterItem(value){
  if(!value){
      this.getAccessModulebyRole();
  } // when nothing has typed
  this.dataSource.data = Object.assign([], this.accessModuleData).filter(
     item => item.name.toLowerCase().indexOf(value.toLowerCase()) > -1
  )
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

