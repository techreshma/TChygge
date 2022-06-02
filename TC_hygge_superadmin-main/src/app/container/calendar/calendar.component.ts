import { Component, OnInit, ViewChild } from '@angular/core';
import { EventSettingsModel, DayService, WeekService, WorkWeekService, MonthService, ScheduleComponent, PopupOpenEventArgs } from '@syncfusion/ej2-angular-schedule';
import { createElement, extend } from '@syncfusion/ej2-base';
import { DropDownList } from '@syncfusion/ej2-dropdowns';

import { CommonServiceService } from 'src/app/service/comman-service.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import {
  MatSnackBar
} from '@angular/material/snack-bar';
// import moment from 'moment';

@Component({
  providers: [DayService, WeekService, WorkWeekService, MonthService],
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  @ViewChild('scheduleObj', { static: true })
  public scheduleObj: ScheduleComponent;
  public data: any = [];
  public selectedDate: Date = new Date();
  public eventSettings: EventSettingsModel = { dataSource: this.data };
  leaveData:any = [];
  files: File[] = [];
  selectedEvent:any = []

  constructor(public _api: CommonServiceService, public ngxService: NgxUiLoaderService, public _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getLeaveType();
    this.getEvent();
  }

 // Get Leave Type
 async getLeaveType(){
  this.ngxService.start();
  await(this._api.getleaveType().subscribe(res => {
    this.ngxService.stop();
    const response: any = res;
    if (response.success == true){
      console.log(response.data)
      this.leaveData = response.data;
    }else{
    }
    console.log(res);
  },err => {
    const error = err.error;
    this.ngxService.stop();
  }));

}

//Get event
async getEvent(){
  await(this._api.getEvent().subscribe(res => {
    this.ngxService.stop();
    const response: any = res;
    if (response.success == true){
      // console.log(response.data)
      let count = 0
      for(let item of response.data){
        count++;
        let obj = {
          Id: count,
          Subject: item.event_Title,
          StartTime: item.event_StartDate,
          EndTime: item.event_EndDate,
          IsAllDay: item.isAllday == 1 ? true : false,
          Description:item.event_Description,
          icon:item.fileName,
          EventType:item.event_Type,
          targetAudience:item.target_Audeince,
          calendarEvent_id:item.calendarEvent_id
        }
        this.data.push(obj)
      }
      console.log(this.data)
      this.eventSettings.dataSource = this.data;
      this.openSnackBar(response.message);
    }else{
      this.openErrrorSnackBar(response.message);
    }
    console.log(res);
  },err => {
    const error = err.error;
    this.openErrrorSnackBar(error.message);
    this.ngxService.stop();
  }));
}

async addNew() {
  let cellData: Object = {
      startTime: new Date(),
      endTime: new Date(),
  };
  this.scheduleObj.openEditor(cellData,'Add');

}


// add custome field on event add modal
onPopupOpen(args: PopupOpenEventArgs): void {
  // console.log(args);
  if (args.type === 'Editor') {
      // Create required custom elements in initial time
      if (!args.element.querySelector('.custom-field-row')) {
          // Custom event type field
          let row: HTMLElement = createElement('div', { className: 'custom-field-row' });
          let formElement: HTMLElement = <HTMLElement>args.element.querySelector('.e-schedule-form');
          formElement.firstChild.insertBefore(row, args.element.querySelector('.e-title-location-row'));
          let container: HTMLElement = createElement('div', { className: 'custom-field-container' });
          let inputEle: HTMLInputElement = createElement('input', {
              className: 'e-field', attrs: { name: 'EventType' }
          }) as HTMLInputElement;
          container.appendChild(inputEle);
          row.appendChild(container);
          let drowDownList: DropDownList = new DropDownList({
              dataSource:this.leaveData,
              fields: { text: 'leave_Type', value: 'leaveType_id' },
              value: (args.data as { [key: string]: Object }).EventType as string,
              floatLabelType: 'Always', placeholder: 'Select Event Type'
          });
          drowDownList.appendTo(inputEle);
          inputEle.setAttribute('name', 'EventType');

        // Custom audience trigger field
          let row2: HTMLElement = createElement('div', { className: 'custom-field-row' });
          let formElement2: HTMLElement = <HTMLElement>args.element.querySelector('.e-schedule-form');
          formElement2.insertBefore(row2, formElement2.childNodes[1]);
          let container2: HTMLElement = createElement('div', { className: 'custom-field-container' });
          let inputEle2: HTMLInputElement = createElement('input', {
            className: 'e-field', attrs: { name: 'targetAudience' }
        }) as HTMLInputElement;
          container2.appendChild(inputEle2);
          row2.appendChild(container2);
          let drowDownList1: DropDownList = new DropDownList({
            dataSource:[
              {
                text:'Group 1',value:'1'
              }
            ],
            fields: { text: 'text', value: 'value' },
            value: (args.data as { [key: string]: Object }).EventType as string,
            floatLabelType: 'Always', placeholder: 'Target Audience'
        });
          drowDownList1.appendTo(inputEle2);
          inputEle2.setAttribute('name', 'targetAudience');

        // Custom Icon upload field
          let row1: HTMLElement = createElement('div', { className: 'dropzone' });
          let formElement1: HTMLElement = <HTMLElement>args.element.querySelector('.e-schedule-form');
          formElement1.lastChild.appendChild(row1);
          let container1: HTMLElement = createElement('div', { className: 'dropzone-inner' });
          let inputLabel: HTMLElement = createElement('h2', {className: 'uplaod-Label'})
          inputLabel.innerHTML = 'Upload Icon (Optional)';
          let inputLabelSub: HTMLElement = createElement('span', {className: 'uplaod-Label-sub'})
          inputLabelSub.innerHTML = 'drag & drop to upload the document';

          let inputEle1: HTMLInputElement = createElement('input', {
            className: 'e-field-upload', attrs: { name: 'EventIcon', type: 'file' }
        }) as HTMLInputElement;
          container1.appendChild(inputLabel);
          container1.appendChild(inputLabelSub);
          container1.appendChild(inputEle1);
          row1.appendChild(container1);

        // inputEle1.setAttribute('name', 'EventIcon');
    }

  }
}

// add new event
async onActionComplete(){
  if(this.data && this.data.length > 0){
    console.log(this.data)
    let data;
    if(this.data.length === 1){
      data =this.data[0]
    }else{
      data = this.data[-1];
    }
    // console.log(data)
    let formData = {
      "event_Type":data.EventType,
      "event_StartDate":new Date(data.StartTime),
      "event_EndDate":new Date(data.EndTime),
      "target_Audeince":data.targetAudience,
      "event_Description":data.Description,
      "fileName":"",
      "event_Title":data.Subject,
      "isAllday":data.IsAllDay ? 1 : 0
    }
    if(data.calendarEvent_id && data.calendarEvent_id != ''){
      formData['calendarEvent_id'] = data.calendarEvent_id;
      await(this._api.editEvent(formData).subscribe(res => {
        this.ngxService.stop();
        const response: any = res;
        if (response.success == true){
          this.openSnackBar(response.message);
        }else{
          this.openErrrorSnackBar(response.message);
        }
        console.log(res);
      },err => {
        const error = err.error;
        this.openErrrorSnackBar(error.message);
        this.ngxService.stop();
      }));
    }else{
      await(this._api.addEvent(formData).subscribe(res => {
        this.ngxService.stop();
        const response: any = res;
        if (response.success == true){
          this.openSnackBar(response.message);
        }else{
          this.openErrrorSnackBar(response.message);
        }
        console.log(res);
      },err => {
        const error = err.error;
        this.openErrrorSnackBar(error.message);
        this.ngxService.stop();
      }));
    }

  }
}
// selectEvent
onEventClick(event){
  console.log(event)
  this.selectedEvent = [event.event]
}

// for get only date from start date of selected event

getDate(e){
  return e
}

// for get only time from start date of selected event
getTime(e){
  return e
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
