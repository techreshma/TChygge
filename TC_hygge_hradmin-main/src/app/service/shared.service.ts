import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as moment from 'moment'

@Injectable()
export class SharedService {

  private userSource = new BehaviorSubject('');
  currentUser = this.userSource.asObservable();


  private countSource = new BehaviorSubject('0');
  messageCount = this.countSource.asObservable();

  public reportFilter = new BehaviorSubject({});
  reportFilterService = this.reportFilter.asObservable();


  public modalfilter = new BehaviorSubject({
    module_name: '',
    module_keyname: '',
    module_childarray: [],
    filter_reset: false,
    report_type: '',
  })
  modalfilterService = this.modalfilter.asObservable();

  changeUser(message: string) {
    this.userSource.next(message);
  }

  changeCount(message: string) {
    this.countSource.next(message)
  }

  reportFilterFunction(displaydata: any) {
    console.log(displaydata.title)
    this.reportFilter.next(displaydata)
  }

  modalReportFilterFun(data: any) {
    this.modalfilter.next(data)
    data = {};
  }

}