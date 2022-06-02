import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { environment } from '../../../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ContractsAddComponent } from '../contracts-add/contracts-add.component';
import { AccessServiceService } from 'src/app/service/access-service.service';
import {
  ConfirmBoxComponent,
  ConfirmDialogModel,
} from 'src/app/confirm-box/confirm-box.component';
import { MissingListComponent } from '../missing-list/missing-list.component';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { defaultFormat as _rollupMoment } from 'moment';
import { ContractEditComponent } from './contract-edit/contract-edit.component';
import { SelectionModel } from '@angular/cdk/collections';


//const moment = _rollupMoment || moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class ContractsComponent implements OnInit {
  mask = {
    guide: true,
    showMask: true,
    mask: [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/],
  };

  // set header column
  displayedColumns: string[] = [
    'checkedBod',
    'position',
    'name',
    'expiry_Date',
    'DocTypeName',
    'view',
    'documentfor',
    'Action',
  ];

  documentFor: any = {
    0: 'Self',
    1: 'Dependent',
  }

  // set static data for table
  dataSource = new MatTableDataSource([]);

  // table sorting and pagination
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  files: File[] = [];
  responseData: any = [];
  filePath: any = environment.apiBaseUrl;
  accessPermission: boolean;
  empData: any[];
  docData: any = [];
  formData = {
    userID: '',
    expiryDate: '',
    DocumentType: '',
  };
  selection = new SelectionModel<any>(true, []);
  backUpRecord:any = [] 
  constructor(
    public _access: AccessServiceService,
    public dialog: MatDialog,
    public _api: CommonServiceService,
    public ngxService: NgxUiLoaderService,
    public _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.accessPermission = this._access.getRouteAccess(
      'User roles',
      JSON.parse(localStorage.getItem('userData')).moduleAccess
    );
    this.showDoc();
    this.getDocType();
    this.getEmployee();
  }

  // Get Employee
  async getEmployee() {
    this.ngxService.start();
    await this._api.showEmployeeName().subscribe(
      (res) => {
        this.ngxService.stop();
        const response: any = res;
        if (response.success == true) {
          console.log(response.data);
          this.empData = response.data;
          console.log(this.empData);
        } else {
        }
        console.log(res);
      },
      (err) => {
        const error = err.error;
        this.ngxService.stop();
      }
    );
  }
  // Get Doc Type
  async getDocType() {
    this.ngxService.start();
    await this._api.showDocType().subscribe(
      (res) => {
        this.ngxService.stop();
        const response: any = res;
        if (response.success == true) {
          console.log(response.data);
          this.docData = response.data;
        } else {
        }
      },
      (err) => {
        const error = err.error;
        this.ngxService.stop();
      }
    );
  }
  sync() {
    this.formData = {
      userID: '',
      expiryDate: '',
      DocumentType: '',
    };
    this.showDoc();
  }
  // Get Doc List
  async showDoc() {
    //  let expiryDate = ''
    // if (this.formData.expiryDate !== '') {
    //   expiryDate = moment(this.formData.expiryDate).format(
    //     'YYYY-MM-DD'
    //   );
    // }
    this.ngxService.start();
    await this._api.showDoc(this.formData).subscribe(
      (res) => {
        this.ngxService.stop();
        const response: any = res;
        if (response.success == true) {
          console.log(response.data);
          this.responseData = response.data;
          for (let item of this.responseData) {
            item['selected'] = false;
          }
          this.backUpRecord = this.responseData
          this.dataSource = new MatTableDataSource([...this.responseData]);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          console.log(this.dataSource);
        } else {
        }
        console.log(res);
      },
      (err) => {
        const error = err.error;
        this.ngxService.stop();
      }
    );
  }

  //send notification to employee
  async notifyUser(u, t) {
    let formData = {
      userId: u,
      companyId: JSON.parse(localStorage.getItem('userData')).company_id,
      docType: t,
    };


    this.ngxService.start();
    await this._api.notifyUser(formData).subscribe(
      (res) => {
        this.ngxService.stop();
        const response: any = res;
        console.log(response)
        if (response.success == true) {
          this.openSnackBar(response.message);
          this.responseData = response.data;
          for (let item of this.responseData) {
            item['selected'] = false;
          }
          this.dataSource = new MatTableDataSource([...this.responseData]);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          console.log(this.dataSource);
        } else {
        }
      },
      (err) => {
        const error = err.error;
        this.ngxService.stop();
      }
    );
  }


  missedDoc(id) {
    const dialogRef = this.dialog.open(MissingListComponent, {
      data: {
        userId: id,
      },
      width: '50%',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  multiSelect(el: any, event: any) {
    event ? this.selection.toggle(el) : null;
    
    if(this.selection.selected.length !== 0){
      this.responseData = this.selection.selected
      console.log(this.responseData)
    }
    else{
      this.responseData = this.backUpRecord
    }
  }




  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  select(row) {
    // for (const item of this.responseData) {
    //   if (item.documentDetail_id === row) {
    //     item.selected = !item.selected;
    //   }
    // }
    // this.eanbled = this.responseData.find((item) => {
    //   return item.selected == true;
    // });
    // console.log(this.eanbled);
    // this.dataSource = new MatTableDataSource([...this.responseData]);
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }

  // Update Employee status
  async updateDocStatus(id, status) {
    this.ngxService.start();
    let formData = {
      documentId: id,
      status: status,
      ip_Address: '1100',
    };
    await this._api.docStatusUpdate(formData).subscribe(
      (res) => {
        this.ngxService.stop();
        const response: any = res;
        if (response.success == true) {
          this.openSnackBar(response.message);
          this.showDoc();
        } else {
          this.openErrrorSnackBar(response.message);
        }

        console.log(res);
      },
      (err) => {
        const error = err.error;
        this.openErrrorSnackBar(error.message);
        this.ngxService.stop();
      }
    );
  }

  //Delete docs

  async deleteDoc(id) {
    this.ngxService.start();
    let formData = {
      documentId: id,
      ip_Address: '1100',
    };
    await this._api.docDelete(formData).subscribe(
      (res) => {
        this.ngxService.stop();
        const response: any = res;
        if (response.success == true) {
          this.openSnackBar(response.message);
          this.showDoc();
        } else {
          this.openErrrorSnackBar(response.message);
        }

        console.log(res);
      },
      (err) => {
        const error = err.error;
        this.openErrrorSnackBar(error.message);
        this.ngxService.stop();
      }
    );
  }

  // open add Contracts modal

  openAddControct() {
    const dialogRef = this.dialog.open(ContractsAddComponent, {
      data: {
        file: '',
      },
      width: '50%',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      this.showDoc();
    });
  }

  // open add Contracts modal

  openEditControct(data) {
    const dialogRef = this.dialog.open(ContractEditComponent, {
      data: {
        doc: JSON.stringify(data),
      },
      width: '50%',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      this.showDoc();
    });
  }

  async openContractAddModal(event) {
    console.log(event);
    this.files = [...event.addedFiles];
    if (event.addedFiles.length > 0) {
      await this._api.uploadDocDoc(event.addedFiles[0]).subscribe(
        (res) => {
          this.ngxService.stop();
          const response: any = res;
          if (response.success == true) {
            console.log(response.data[0]);
            const dialogRef = this.dialog.open(ContractsAddComponent, {
              data: {
                file: response.data[0],
              },
              width: '50%',
            });

            dialogRef.afterClosed().subscribe((result) => {
              console.log(`Dialog result: ${result}`);
              this.showDoc();
            });
          } else {
            this.openSnackBar(response.message);
          }
          console.log(res);
        },
        (err) => {
          const error = err.error;
          this.openErrrorSnackBar(error.message);
          this.ngxService.stop();
        }
      );
    } else {
      this.openErrrorSnackBar('File size is too large');
    }
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

  // // document download
  Download(e) {
    this.ngxService.start();
    var element = document.createElement('a');
    // element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(`${environment.apiBaseUrl}${e}`));
    let type = 'text/pdf';
    element.href = window.URL.createObjectURL(
      new Blob([`${environment.apiBaseUrl}${e}`], { type: 'image/png' })
    );
    element.setAttribute('download', e);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
    this.ngxService.stop();
  }

  //filter
  onChange(e, t) {
    if (e.keyCode === 13) {
      if (t == 'expiry')
        this.formData.expiryDate = e.target.value;
    } else if (t == 'user') {
      this.formData.userID = e;
    } else if (t == 'doc') {
      this.formData.DocumentType = e;
    }
    this.showDoc();
  }


  // alert message after api response success
  openSnackBar(msg) {
    this._snackBar.open(msg, 'Ok', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['success-alert'],
    });
  }
  // alert message after api response failure
  openErrrorSnackBar(msg) {
    this._snackBar.open(msg, 'Ok', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['failure-alert'],
    });
  }
  // confirm message
  confirmDialog(): void {
    const message = `Are you sure you want to delete this?`;

    const dialogData = new ConfirmDialogModel('Confirm Action', message);

    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      maxWidth: '400px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        let arr = [];
        for (let item of this.responseData) {
          if (item.selected) {
            arr.push(item.documentDetail_id);
          }
        }
        this.deleteDoc(arr);
      }
    });
  }
  confirmSignleDeleteDialog(id): void {
    const message = `Are you sure you want to delete this?`;

    const dialogData = new ConfirmDialogModel('Confirm Action', message);

    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      maxWidth: '400px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        let arr = [id];
        this.deleteDoc(arr);
      }
    });
  }

  // Download list in CSV
  export_table_to_csv() {
    this.ngxService.start();
    const html = document.getElementById('csvTable');
    let csv = [];
    let rows = html.querySelectorAll('table tr');

    for (let i = 0; i < rows.length; i++) {
      let row = [],
        cols = rows[i].querySelectorAll('td, th');

      for (let j = 0; j < cols.length; j++) {
        row.push(cols[j].textContent);
      }

      csv.push(row.join(','));
    }

    // Download CSV
    this.download_csv(csv.join('\n'), 'Document-list.csv');
  }

  download_csv(csv, filename) {
    let csvFile;
    let downloadLink;

    // CSV FILE
    csvFile = new Blob([csv], { type: 'text/csv' });

    // Download link
    downloadLink = document.createElement('a');

    // File name
    downloadLink.download = filename;

    // We have to create a link to the file
    downloadLink.href = window.URL.createObjectURL(csvFile);

    // Make sure that the link is not displayed
    downloadLink.style.display = 'none';

    // Add the link to your DOM
    document.body.appendChild(downloadLink);

    // Lanzamos
    downloadLink.click();
    this.ngxService.stop();
  }
}
