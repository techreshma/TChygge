import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import {
  MatSnackBar
} from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  // from data for login api
  formData = {
    email: '',
    password: ''
  }
  fieldPasswordType:boolean;
  constructor(public _auth: AuthServiceService, private ngxService: NgxUiLoaderService, private _snackBar: MatSnackBar, public router:Router) {
    console.log(localStorage.getItem('token'))
    if(localStorage.getItem('token')){
      this.router.navigate(['/dashboard'])
    }
   }

  ngOnInit(): void {

    // Checking is login credential saved in remember me
    if(localStorage.getItem('loginCred')){
      this.formData = JSON.parse(localStorage.getItem('loginCred'));
    }
  }

  // login api calling
  async login(){
    this.ngxService.start();
    await(this._auth.login(this.formData).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true){
        localStorage.setItem('userData', JSON.stringify(response.data));
        localStorage.setItem('token', response.data.tokens)
        this.openSnackBar(response.message);
        this.router.navigate(['/dashboard']);
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

  // remember me to save login cred in cookies
  rememberMe(e){
    if (e.checked){
      localStorage.setItem('loginCred', JSON.stringify(this.formData));
    }else{
      localStorage.setItem('loginCred', undefined);
    }
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
