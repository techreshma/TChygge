import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AccessServiceService } from 'src/app/service/access-service.service';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import * as _moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { PayslipDetailComponent } from '../../salary/payslip-detail/payslip-detail.component';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss']
})
export class EmployeeDetailComponent implements OnInit {
  displayedColumns: string[] = ['role_Type', 'nouser', 'accesslevel', 'status', 'actionsrequired'];
  roleData = new MatTableDataSource([{ role_Type: 'asd', nouser: 'sdasd', accesslevel: 'fdssd', status: 'asdsad', actionsrequired: 'dvjjhjh' }]);

  salaryColumns: string[] = ['date', 'ref', 'status', 'amount', 'action'];
  roleSalaryData = new MatTableDataSource([]);

  leaveColumns: string[] = ['leavType', 'reqDur', 'appliedOn', 'status'];
  roleLeaveData = new MatTableDataSource([]);
  salaryObj: any = {};

  // table sorting and pagination
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  imgPath = environment.apiBaseUrl;
  userId: string = "2";
  employeeDetail: any = {};
  empId: any;
  companyId: any;
  homeRegion: any;
  workRegion: any;
  leaveBalance: any = [];
  salaryBalance: any = [];
  personalDocument: any = [];
  dependentDocument: any = [];
  attendance: any;
  currntDate: any = [];
  todaysHour: number = 0;
  todaysTotalHour: number = 0;
  workingDayWeekTime: number = 0;
  workingDayMonthTime: number = 0
  weeksHour: number = 0;
  monthHour: number = 0;
  graphData: any;
  insurance: any;
  challenges: any;
  challangeGraphData: any;


  personalInfo: any = [];
  badgesDetail: any = []

  proffesionalInfo: any = [
    {
      title: "Department",
      value: this.employeeDetail.department
    },
    {
      title: "Designation",
      value: this.employeeDetail.designation
    },
    {
      title: "Joining Date",
      value: _moment(this.employeeDetail.employee_joiningDate).format('dd/MM/yyyy')
    },
    {
      title: "Insurance Plan",
      value: this.employeeDetail.insurance_plan_name
    },
    {
      title: "Reporting Manager",
      value: this.employeeDetail.reporting_Manager
    },
    {
      title: "Work Location",
      value: this.employeeDetail.work_location
    },
    {
      title: "Working Hours",
      value: "From " + this.employeeDetail.working_HoursFrom + "to" + this.employeeDetail.working_HoursTo
    }
  ]

  constructor(public dialog: MatDialog, public route: ActivatedRoute, public _access: AccessServiceService, public _api: CommonServiceService, public ngxService: NgxUiLoaderService, public _snackBar: MatSnackBar) {
    this.empId = this.route.snapshot.params.id;
    this.companyId = JSON.parse(localStorage.getItem('userData')).company_id;
  }

  ngOnInit(): void {
    this.getWorkingDay();
    this.getemployee();
    this.getDocuments();
    this.getEmployeeRecord();
  }

  async getEmployeeRecord() {
    await (this._api.getEmployee().subscribe(res => {
      const response: any = res;
      if (response.success) {
        let salaryRecord: any;
        response.data.forEach((el: any) => {
          if (el.user_id.toString() === this.empId) {

            salaryRecord = JSON.parse(el.salaryBalance)
          }
        })

        var resultObject = salaryRecord.reduce(function (result, currentObject) {
          for (var key in currentObject) {
            if (currentObject.hasOwnProperty(key)) {
              result[key] = currentObject[key];
            }
          }
          return result;
        }, []);
        console.log(resultObject)
        this.salaryObj = resultObject;
      }
    }))
  }

  async getDocuments() {
    let formData = {
      userID: '',
      expiryDate: '',
      DocumentType: '',
    };
  }


  async getemployee() {
    let formData = {
      "user_Id": Number(this.empId),
      "company_Id": this.companyId
    }
    this.ngxService.start();
    await (this._api.getEmployeeDetail(formData).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;

      if (response.success == true) {
        this.employeeDetail = response.data.user[0];
        this.employeeDetail['dob'] = this.employeeDetail['DOB']
        delete this.employeeDetail['DOB']


        let personalInfoData: any = [
          { data: 'dob', title: 'Date of birth' },
          { data: 'gender', title: 'Gender' },
          { data: 'marital_Status', title: 'Maritial Status' },
          { data: 'nationality', title: 'Nationality' },
          { data: 'national_Id', title: 'National Id' },
          { data: 'passport', title: 'Passport' },
          { data: 'visa', title: 'Visa' },
        ]

        personalInfoData.forEach((el: any) => {
          this.personalInfo.push({
            title: el.title,
            value: this.employeeDetail[el.data]
          })
        })



        this.roleLeaveData = new MatTableDataSource([...response.data.leave]);

        this.roleSalaryData = new MatTableDataSource([...response.data.salary]);
        this.insurance = response.data.insurance[0];
        this.challenges = response.data.challenges[0];
        this.personalDocument = (response.data.document).filter(item => item.dependentType == 0);
        this.dependentDocument = (response.data.document).filter(item => item.dependentType == 1);
        this.homeRegion = JSON.parse(this.employeeDetail.homeRegion)
        this.workRegion = JSON.parse(this.employeeDetail.workRegion)
        this.leaveBalance = JSON.parse(this.employeeDetail.leaveBalance)
        this.salaryBalance = JSON.parse(this.employeeDetail.salaryBalance)


        this.attendance = response.data.attendance;
        this.currntDate = this.attendance.filter(item => _moment(item.created_At).format('DD/MM/YYYY') == _moment().format('DD/MM/YYYY'))
        let timeTodayStart = new Date("01/01/2007 " + this.employeeDetail.working_HoursFrom).getHours();
        let timeTodayEnd = new Date("01/01/2007 " + this.employeeDetail.working_HoursTo).getHours();

        let monthStartDate = _moment().startOf('month');
        let monthEndDate = _moment().endOf('month');
        let currentMonthData = this.attendance.filter(item => (monthStartDate < _moment(item.created_At) && monthEndDate > _moment(item.created_At)))

        currentMonthData.forEach(item => {
          let timeStart = new Date("01/01/2007 " + item.check_In).getHours();
          let timeEnd = new Date("01/01/2007 " + (item.check_Out ? item.check_Out : '23:00:00')).getHours();
          this.monthHour += (timeEnd - timeStart)
        });

        let weekStartDate = _moment().startOf('week');
        let weekEndDate = _moment().endOf('week');
        let currentWeekData = this.attendance.filter(item => (weekStartDate < _moment(item.created_At) && weekEndDate > _moment(item.created_At)))
        currentWeekData.forEach(item => {
          let timeStart = new Date("01/01/2007 " + item.check_In).getHours();
          let timeEnd = new Date("01/01/2007 " + (item.check_Out ? item.check_Out : '23:00:00')).getHours();
          this.weeksHour += (timeEnd - timeStart)
        });

        this.todaysTotalHour = (timeTodayEnd - timeTodayStart)
        this.currntDate.forEach(item => {
          let timeStart = new Date("01/01/2007 " + item.check_In).getHours();
          let timeEnd = new Date("01/01/2007 " + (item.check_Out ? item.check_Out : '23:00:00')).getHours();
          this.todaysHour += (timeEnd - timeStart)
        });

        this.graphData = JSON.stringify({ label: ['Attend', 'Remaining'], percentage: [this.todaysHour, this.todaysTotalHour], colors: ['#15C1DC', '#FF6384'], width: 250 })
        this.challangeGraphData = JSON.stringify(
          {
            label: ['Complete'],
            percentage: [
              this.challenges.completeChallenge == 0 ? 0 : this.challenges.completeChallenge],
            colors: ['#15C1DC', '#FF6384'],
            width: 150
          })

        this.badgesDetail = response.data.badgesDetail;
        /*
         badges_Description: "Health_Bloomer"
badges_Id: 9
badges_Name: "Health_Bloomer"
badges_doc_Path: "completing_HRA@3x.png"
badges_earned: 1
name: "Mobile Developer"
user_Id: 2

        */
      }
    }, err => {
      const error = err.error;
      this.ngxService.stop();
    }));
  }

  roundFigure(number) {
    return Math.round(number)
  }

  //get working hour
  async getWorkingDay() {
    this.ngxService.start();
    await (this._api.companyWorkingDay().subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        let workingDay = response.data;
        let days = _moment().daysInMonth();
        workingDay.forEach(element => {
          if (!element.OnOff) {
            let timeStart = new Date("01/01/2007 " + element.inTime).getHours();
            let timeEnd = new Date("01/01/2007 " + element.outTime).getHours();
            this.workingDayWeekTime += (timeEnd - timeStart)
          }
        });
        for (let i = 0; i < days; i++) {
          let timeStart = new Date("01/01/2007 " + workingDay[1].inTime).getHours();
          let timeEnd = new Date("01/01/2007 " + workingDay[1].outTime).getHours();
          this.workingDayMonthTime += (timeEnd - timeStart)
        }
      } else {

      }
      console.log(res);
    }, err => {
      const error = err.error;
      this.ngxService.stop();

    }));

  }

  // Check day is negative or positive
  getNegative(number) {

    return Math.sign(number);
  }

  removeChar(a) {
    if (a < 0) {
      a = a * -1;
      return a;
    } else {
      return a;
    }
  }

  //Searching leaves
  applyLeaveFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.roleLeaveData.filter = filterValue.trim().toLowerCase();
  }

  //Searching salary
  applySalaryFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.roleSalaryData.filter = filterValue.trim().toLowerCase();
  }

  // date formating
  formatDate(date) {
    return _moment(date).format('DD-MM-YYYY')
  }

  chkHttp(e) {
    let http = e.split('/')
    return http[0]
  }

  async showTemplate(date) {
    let formData = {
      "currentMonth": _moment(date).format('MM'),
      "userID": this.empId,
      "isType": "0"
    }
    this.ngxService.start();
    await (this._api.payslipMail(formData).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        console.log(response.data[0].paySlip_Image)
        const dialogRef = this.dialog.open(PayslipDetailComponent, {
          width: '100%',
          data: {
            img: response.data[0].paySlip_Image
          }
        });

        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
        });
      } else {
        this.openErrrorSnackBar(response.message)
      }
      console.log(res);
    }, err => {
      const error = err.error;
      console.log(err)
      this.openErrrorSnackBar(error.message)
      this.ngxService.stop();
    }));



  }

  async downloadSlip(date) {
    let formData = {
      "currentMonth": _moment(date).format('MM'),
      "userID": this.empId,
      "isType": "0"
    }
    this.ngxService.start();
    await (this._api.payslipMail(formData).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        console.log(response.data[0].paySlip_Image)
        let imageFile;
        let downloadLink;

        // CSV FILE
        imageFile = new Blob([response.data[0].paySlip_Image], { type: 'image/jpg' });

        // Download link
        downloadLink = document.createElement('a');

        // File name
        downloadLink.download = response.data[0].paySlip_Image;

        // We have to create a link to the file
        downloadLink.href = response.data[0].paySlip_Image;

        // Make sure that the link is not displayed
        downloadLink.style.display = 'none';

        // Add the link to your DOM
        document.body.appendChild(downloadLink);

        // Lanzamos
        downloadLink.click();
        this.ngxService.stop();

      } else {
        this.openErrrorSnackBar(response.message)
      }
      console.log(res);
    }, err => {
      const error = err.error;
      this.openErrrorSnackBar(error.message)
      this.ngxService.stop();
    }));
  }

  // mail pay slip
  async mailPaySlip(date) {
    let formData = {
      "currentMonth": _moment(date).format('MM'),
      "userID": this.empId,
      "isType": "1"
    }
    this.ngxService.start();
    await (this._api.payslipMail(formData).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        this.openSnackBar(response.message)
      } else {
        console.log(response)
        this.openErrrorSnackBar(response.message)
      }
      console.log(res);
    }, err => {
      const error = err.error;
      console.log(err.error)
      this.openErrrorSnackBar(error.message)
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
