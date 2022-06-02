import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators'
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor(	private http: HttpClient) { }
  login(formData) {
		let headers = new HttpHeaders({
			'Content-Type': 'application/json'
		});
		return this.http.post(`${environment.apiBaseUrl}${environment.apiPath}login`,formData).pipe(map(res => <any>res));
  }

  forgotPassword(formData) {
		let headers = new HttpHeaders({
			'Content-Type': 'application/json'
		});
		return this.http.post(`${environment.apiBaseUrl}${environment.apiPath}forgetPassword`,formData).pipe(map(res => <any>res));
  }
  resetPassword(formData) {
		let headers = new HttpHeaders({
			'Content-Type': 'application/json'
		});
		return this.http.post(`${environment.apiBaseUrl}${environment.apiPath}forgetPasswordReset`,formData).pipe(map(res => <any>res));
  }
  setPassword(formData) {
		let headers = new HttpHeaders({
			'Content-Type': 'application/json'
		});
		return this.http.post(`${environment.apiBaseUrl}${environment.apiPath}forgetPasswordReset`,formData).pipe(map(res => <any>res));
  }
}
