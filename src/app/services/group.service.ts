import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baseUrl from './helper';
@Injectable({
  providedIn: 'root'
})
export class GroupService {
  

  constructor(private http:HttpClient) { }

  loadUserList(userid: any){
    return this.http.get(`${baseUrl}/group/user-group/get/${userid}`);
  }

  getGroupInfo(id:any){
    return this.http.get(`${baseUrl}/group/get/${id}`);
  }

  addNewGroup(group:any){
    return this.http.post(`${baseUrl}/group/add`,group);
  }

  updateGrpInfo(group:any){
    return this.http.put(`${baseUrl}/group/update`,group);
  }
}
