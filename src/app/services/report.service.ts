import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baseUrl from './helper';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http: HttpClient) { }

  getSettlementDashboardData(groupId:any){
    return this.http.get(`${baseUrl}/report/dashboard/get/${groupId}`);
  } 

  downloadExcelReport(groupId:any){
    return this.http.get(`${baseUrl}/report/get/${groupId}`);
  }
}
