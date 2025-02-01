import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import * as $ from "jquery";
@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css']
})
export class TopNavComponent implements OnInit {

  isLoggedIn = false;
  user = null;
  constructor(public loginService:LoginService, private router :Router) { }

  ngOnInit(): void {
    this.isLoggedIn = this.loginService.isLoggedIn();
    this.user = this.loginService.getUser();

    this.loginService.loginStatusSubject.asObservable().subscribe(data=>{
      this.isLoggedIn = this.loginService.isLoggedIn();
    this.user = this.loginService.getUser();
    })
  }
  logout(){
    this.loginService.logOut();
    
    this.loginService.loginStatusSubject.next(false);
  }
  toggleMenuOption(){
    console.log("clicked");
   
      $("#sideNav").toggle();
   
    
    
  }
}
