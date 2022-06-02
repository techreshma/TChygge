import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonServiceService } from 'src/app/service/comman-service.service';

@Component({
  selector: 'app-csv-upload',
  templateUrl: './csv-upload.component.html',
  styleUrls: ['./csv-upload.component.scss']
})
export class CsvUploadComponent implements OnInit {

  files: File[] = [];
  constructor(public _api: CommonServiceService, public ngxService: NgxUiLoaderService, public _snackBar: MatSnackBar, public dialogRef: MatDialogRef<CsvUploadComponent>) { }

  ngOnInit(): void {
  }

  // onSelect image
  async uploadDoc(event) {
    console.log(event);
    let fileName = (event.addedFiles[0].name).split('.');
    if(fileName[1] == 'csv' || fileName[1] == 'xlsx'){
      this.files = [...event.addedFiles];
      if(event.addedFiles.length > 0){
        this.ngxService.start();
        const input = this.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
          const text:any = e.target.result;
          const res = this.csvToArray(text);
          let newArr = [];
          for(let item of res){
            if(item.First_Name != ''){
              newArr.push(item)
            }
          }
          newArr.splice(newArr.length -1, 1);
          let response = newArr.map((data)=>{
            const validation = (Object.values(data).map((value) => value != '')).every(v => v === true);
            data['chk'] = validation?1:0;
            data['selected'] = 'uncheck';
            return data
          })
          this.ngxService.stop()
          this.dialogRef.close(JSON.stringify(response));
        };

        reader.readAsText(input);
      }else{
        this.openErrrorSnackBar('File size is too large');
      }
    }else{
      this.openErrrorSnackBar('This file format is not allowed');
    }

  }

  csvToArray(str, delimiter = ",") {
    // slice from start of text to the first \n index
    // use split to create an array from string by delimiter
    const headers = (str.slice(0, str.indexOf("\n")).split(delimiter)).map(item => item.replace("\r",'')).filter(item => item != '');
    // console.log(headers)
    // slice from \n index + 1 to the end of the text
    // use split to create an array of each csv value row
    const rows = str.slice(str.indexOf("\n") + 1).split("\n");

    // Map the rows
    // split values from each row into an array
    // use headers.reduce to create an object
    // object properties derived from headers:values
    // the object passed as an element of the array
    const arr = rows.map(function (row) {
      const values = (row.split(delimiter)).map(item => item.replace("\r",'').trim());
      const el = headers.reduce(function (object, header, index) {
        object[header] = values[index];
        return object;
      }, {});
      return el;
    });

    // return the array
    return arr;
  }

  // onRemove image
  onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
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
