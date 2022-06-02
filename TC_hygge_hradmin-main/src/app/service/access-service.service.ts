import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccessServiceService {
  accessPermission:boolean;
  getRouteAccess(page, module){
    for(let mod of module){
      if(mod.name == page){
        this.accessPermission = mod.write;
      }else if(mod.children && mod.children.length > 0){
        this.getRouteAccess(page,mod.children)
      }
    }

    return this.accessPermission
  }

}
