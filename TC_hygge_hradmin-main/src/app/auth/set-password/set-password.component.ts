import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.scss']
})
export class SetPasswordComponent implements OnInit {
  formData = {
    otp: '',
    newPassword: '',
    confirmPassword:'',
  }
  fieldconPass:boolean;
  fieldNewPass:boolean;
  constructor(public _auth: AuthServiceService, private ngxService: NgxUiLoaderService, private _snackBar: MatSnackBar, public router:Router) {
    if(localStorage.getItem('token')){
      this.router.navigate(['/dashboard'])
    }

    let url = this.router.url.split('/');
    this.formData.otp = url.pop();
  }

  ngOnInit(): void {
  }

  // login api calling
  async reset(){
    this.ngxService.start();
    await(this._auth.setPassword(this.formData).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true){
        this.openSnackBar(response.message);
        this.router.navigate(['/login']);
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
