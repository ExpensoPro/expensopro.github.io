import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baseUrl from './helper';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  constructor(private http: HttpClient) {}

  public addUser(user: any){
    return this.http.post(`${baseUrl}/user/add`,user);
  }

  public updateUser(user: any){
    debugger;
    return this.http.put(`${baseUrl}/user/update`,user);
  }

  public loadUserList(){
    return this.http.get(`${baseUrl}/user/get`)
  }

  public getUser(id:any){
    debugger;
    return this.http.get(`${baseUrl}/user/get/${id}`)
  }
  
  loadUserByUsername(username:any){
    return this.http.get(`${baseUrl}/user/get/username/${username}`);
  }
}
