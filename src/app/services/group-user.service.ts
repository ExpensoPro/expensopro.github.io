import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baseUrl from './helper';
import { Observable } from 'rxjs/internal/Observable';

interface user{
  id:any,
  username:any,
  firstname:any,
  lastname:any
}
interface GroupUser{
  id:any,
  group:any,
  user:user;
}

@Injectable({
  providedIn: 'root'
})


export class GroupUserService {

  constructor(private http: HttpClient) { }

  addGroupUser(groupUserModel:any){
    return this.http.post(`${baseUrl}/group-user/add`,groupUserModel);
  }

  getGroupUserList(groupId:any):Observable<any[]>{
    var data = this.http.get<GroupUser[]>(`${baseUrl}/group-user/group/${groupId}`);
    debugger;
    return data;
  }

  removeUserFromGrp(groupId:any, userid:any){
    return this.http.delete(`${baseUrl}/group-user/group/${groupId}/remove/${userid}`)
  }
}
