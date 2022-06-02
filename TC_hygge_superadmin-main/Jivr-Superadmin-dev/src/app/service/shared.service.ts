import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SharedService {

  private userSource = new BehaviorSubject('');
  currentUser = this.userSource.asObservable();



  changeUser(message: string){
    this.userSource.next(message);
  }
}
