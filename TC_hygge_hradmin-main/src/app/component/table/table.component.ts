import { Statement } from '@angular/compiler';
import { Input, Output, EventEmitter } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {
  ConfirmBoxComponent,
  ConfirmDialogModel,
} from 'src/app/confirm-box/confirm-box.component';
import { AccessServiceService } from 'src/app/service/access-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  @Input() data: any;
  @Input() column: any;
  @Input() titles: any;
  @Input() action: any;
  @Input() isChallenge: boolean = false;
  // @Input() update: (args: any,args2:any) => void;
  // @Input() detail: (args:any, args2:any) => void;
  @Output('update') update: EventEmitter<object> = new EventEmitter();
  @Output('detail') detail: EventEmitter<object> = new EventEmitter();
  @Output('delete') delete: EventEmitter<object> = new EventEmitter();
  @Output('preview') preview: EventEmitter<object> = new EventEmitter();
  @Output('statusUpdate') statusUpdate: EventEmitter<object> =
    new EventEmitter();

  // set header column
  displayedColumns: any[] = [];
  displayedTitles: any[] = [];
  actionColumn: any[] = [];

  //set static data for table
  dataSource = new MatTableDataSource([]);

  // table sorting and pagination
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  imgPath = environment.apiBaseUrl;
  accessPermission: boolean;
  constructor(public _access: AccessServiceService, public dialog: MatDialog) {
    this.accessPermission = this._access.getRouteAccess(
      'User roles',
      JSON.parse(localStorage.getItem('userData')).moduleAccess
    );
  }

  ngOnInit(): void {
    this.displayedTitles = this.titles;
    this.displayedColumns = this.column;
    this.actionColumn = this.action;
    this.dataSource = new MatTableDataSource([...this.data]);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.checkChallenge();
  }


  checkChallenge() {
    if (this.isChallenge) {
      let index = this.column.indexOf("switch");
      if (~index) {
        this.column[index] = "Action Required"
      }
    }
    console.log(this.column)
  }

  updateData(e, d) {
    this.update.emit({ event: e, data: d });
  }

  getDetail(e, d) {
    this.detail.emit({ event: e, data: d });
  }

  deleteData(e, d) {
    this.delete.emit({ event: e, data: d });
  }

  previewData(e, d) {
    this.preview.emit({ event: e, data: d });
  }

  updateStatus(e, d, s) {
    this.statusUpdate.emit({ event: e, data: d, status: s });
  }

  //Searching
  filter(filterValue) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  //check action column
  checkColumn(stat) {
    let val = this.actionColumn.find((item) => item == stat);
    return val ? true : false;
  }

  // confirm message
  confirmDialog(e, id): void {
    const message = `Are you sure you want to delete this?`;

    const dialogData = new ConfirmDialogModel('Confirm Action', message);

    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      maxWidth: '400px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        this.deleteData(e, id);
      }
    });
  }
}
