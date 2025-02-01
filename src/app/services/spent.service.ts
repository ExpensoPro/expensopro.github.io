import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baseUrl from './helper';

@Injectable({
  providedIn: 'root'
})
export class SpentService {
  

  constructor(private http:HttpClient) { }

  addNewSpent(spent:any, contributors:any){
    return this.http.post(`${baseUrl}/spent/add/${contributors}`,spent);
  }

  getAllSpendsForGroup(groupid:any){
    return this.http.get(`${baseUrl}/spent/get/allGroupSpent/${groupid}`);
  }

  getSpentContributors(spentid:any){
    return this.http.get(`${baseUrl}/spent/spent-contributors/${spentid}`);
  }

  deleteSpent(id:any){
    return this.http.delete(`${baseUrl}/spent/delete/${id}`);
  }

  getAllUserSpendsDataForGroup(groupid:any){
    return this.http.get(`${baseUrl}/dashboard/get/group/${groupid}/all-user-spent`);
  }

  getAllUserChargedDataForGroup(groupid:any){
    return this.http.get(`${baseUrl}/dashboard/get/group/${groupid}/all-user-charged`);
  }
}
