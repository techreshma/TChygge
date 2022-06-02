import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import { Editor } from 'ngx-editor';
export interface DialogData {
  faqData: string;
}
@Component({
  selector: 'app-edit-faq',
  templateUrl: './edit-faq.component.html',
  styleUrls: ['./edit-faq.component.scss']
})
export class EditFaqComponent implements OnInit {
  editor: Editor;
  faqData:any;
  formData = {
    "faq_id":"",
    "question":"f",
    "answer":"",
    "ip_Address":"34.34.34.34"
  }
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, public dialogRef: MatDialogRef<EditFaqComponent>,public _api: CommonServiceService, public ngxService: NgxUiLoaderService, public _snackBar: MatSnackBar) {
    this.formData = JSON.parse(this.data.faqData);
   }

  ngOnInit(): void {
    this.editor = new Editor();
  }

  async editFaq(){
    this.ngxService.start();
    await(this._api.editFaq(this.formData).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true){
        this.openSnackBar(response.message);
        this.dialogRef.close('Close');
      }else{
        this.openErrrorSnackBar(response.message);
      }
      console.log(res);
    },err => {
      const error = err.error;
      this.ngxService.stop();
      this.openErrrorSnackBar(error.message);
    }));
  }

  changeEditor(e){
    this.formData.answer = e;
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
// make sure to destory the editor
ngOnDestroy(): void {
  this.editor.destroy();
}
}
