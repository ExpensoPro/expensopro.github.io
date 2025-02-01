import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baseUrl from './helper';

@Injectable({
  providedIn: 'root'
})
export class ComunicationService {

  constructor(private http:HttpClient) { }

  sendVerifyEmailOtp(email:any){
    return this.http.post(`${baseUrl}/notify/mail`,email);
  }

  getOtpForUser(email:any){
    return this.http.get(`${baseUrl}/notify/getmailotp/${email}`);
  }
}
