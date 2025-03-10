import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import baseUrl from './helper';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  generateQRCode(toUPI: any, amount: any) {
    return this.http.get(`${baseUrl}/payment/generate-upi-qr/upi/${toUPI}/amt/${amount}`);
  }

  constructor(private http: HttpClient) { }
}
