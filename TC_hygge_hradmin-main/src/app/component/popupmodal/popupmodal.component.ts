import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SharedService } from 'src/app/service/shared.service';

@Component({
  selector: 'app-popupmodal',
  templateUrl: './popupmodal.component.html',
  styleUrls: ['./popupmodal.component.scss'],
})
export class PopupmodalComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    public sharedService: SharedService
  ) { }
  filterRecord: any = [];
  recordData: any = []
  filterChild: any = [];
  sidebarTitles: any = [];
  moduleChildArray: any = [];
  resetArray: any = []

  searchText: any = '';

  reportTitle: any = ''
  moduleName: any = ''
  moduleKey: any = ''

  /*All keys for Filter*/
  firstName: any = '';
  lastName: any = ''

  isRadio: boolean = false;
  isTimefilter: boolean = false;

  rangeArray: any = []


  ngOnInit(): void {
    this.loadService();
  }


  loadService() {
    this.sharedService.reportFilterService.subscribe((el: any) => {
      this.reportTitle = el.title
      this.filterRecord = el.data
      this.resetArray = el.reset_filter
      this.recordData = this.filterRecord
      this.sidebarTitles = [];
      this.sidebarTitles.push(el.filtername)
    });
  }

  selectAgeRange(element) {
    this.moduleChildArray = []
    this.moduleChildArray.push(element)
  }

  selectTimeFilter(element) {
    this.moduleChildArray = []
    this.moduleChildArray.push(element)
  }

  //#region search module filter
  searchModule(e: any) {
    this.recordData = [];
    this.filterRecord.forEach(element => {
      if (element.filtername.toLowerCase().indexOf(e.target.value) !== -1) {
        console.log(element)
        this.recordData.push(element)
      }
    });
    this.filterChild = []
  }
  //#endregion

  setInputValueFunction(event: any) {
    this.moduleChildArray = [];
    (event.target.value != '') ?
      this.moduleChildArray.push(event.target.value) :
      this.moduleChildArray.pop(event.target.value)
    console.log(this.moduleChildArray)
  }

  //#region filter by checkbox
  moduleCheckFilter(event: any, data: any) {

    this.resetArray.forEach((el: any) => {
      console.log(this.moduleKey, el)
      if (el === this.moduleKey) {
        (event.checked) ?
          this.moduleChildArray.push(data) :
          this.moduleChildArray.splice(this.moduleChildArray.indexOf(data), 1)
      }
    })
    console.log(this.moduleChildArray)
  }
  //#endregion`````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````

  //#region  modulemenu click
  menuClick(filter: any) {

    this.moduleName = filter.filtername;
    this.moduleKey = filter.value;
    this.filterChild = filter.childFilter;
    this.rangeArray = filter.data ? filter.data : []
    this.filterRecord.forEach((csbel) => {
      csbel.show = (csbel.filtername === filter.filtername)
    })


    if (filter.type && filter.type === 'radio') {
      this.isTimefilter = false;
      this.isRadio = true
    }

    if (filter.type && filter.type === 'timefilter') {
      this.isTimefilter = true;
      this.isRadio = false;
    }
  }
  //#endregion

  closeDialog() {
    this.dialog.closeAll();
  }

  resetFilter() {
    let resetData = {
      module_name: this.moduleName,
      module_keyname: this.moduleKey,
      module_childarray: this.resetArray,
      report_tyoe: this.reportTitle,
      isReset: true,
    }

    this.sharedService.modalReportFilterFun(resetData)
    this.dialog.closeAll()
  }

  applyFilter() {
    let applyData = {
      module_name: this.moduleName,
      module_keyname: this.moduleKey,
      module_childarray: this.moduleChildArray,
      report_type: this.reportTitle,

      isReset: false,
    }

    this.sharedService.modalReportFilterFun(applyData)
    this.dialog.closeAll()
  }


}
