import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import * as $ from "jquery";
import { GroupService } from 'src/app/services/group.service';
import swal from 'sweetalert2'
import { DashboardComponent } from 'src/app/dashboard/dashboard.component';

interface user{
  id:any,
  username:any,
  firstname:any,
  lastname:any
}
interface Group{
  id: number,
  groupName : String,
  groupDescription : String,
  groupOwner: any;
  dateCreated:any;
}
@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css']
})
export class TopNavComponent implements OnInit {

  isLoggedIn = false;
  user = null;
  constructor(public loginService:LoginService, private router :Router, private groupService:GroupService) { }
  currentUser:any;
  selected:any=0;
  groups: Group[]=[];
  topGrpSelected:any='';
  dash:DashboardComponent | undefined;
  ngOnInit(): void {
    this.isLoggedIn = this.loginService.isLoggedIn();
    this.user = this.loginService.getUser();

    this.loginService.loginStatusSubject.asObservable().subscribe(data=>{
      this.isLoggedIn = this.loginService.isLoggedIn();
    this.user = this.loginService.getUser();
    })
    debugger;
    this.loaduserGroupList();
    this.getSelectedGroup();

  }
  logout(){
    this.loginService.logOut();
    localStorage.removeItem("topSelectedGrp");
    this.loginService.loginStatusSubject.next(false);
  }
  toggleMenuOption(){
    console.log("clicked");
   
      $("#sideNav").toggle();
   
    
    
  }
  loaduserGroupList(){
    this.currentUser = this.loginService.getUser();
    this.groupService.loadUserList(this.currentUser.id).subscribe(
      (data:any)=>{
        this.groups = data;
      },
      (error:any)=>{

      })
  }
  getSelectedGroup(){
      if(localStorage.getItem("topSelectedGrp")!='' && localStorage.getItem("topSelectedGrp")!=null){
        this.selected= Number(localStorage.getItem("topSelectedGrp"));
      }else{
        // $("#grp-selector-top").css("border","3px solid red");
        // $("#grp-selector-top").append('<span style="color:red;"> Please select group to proceed with dashboard data!</span>');
      }
    }
  onGroupSelected(event:any){
    this.setSelectedGroup(this.selected);
    // this.getAllUserSpendsDataForGroup(this.selected);
    // this.getAllUserChargedDataForGroup(this.selected);
    if($(".activeTab").text()=='homeDashboard'){
      debugger;
      // this.router.navigate(["user-dashboard"]);
      window.location.reload();
    }
  }
  setSelectedGroup(selected: any) {
    localStorage.setItem("topSelectedGrp",selected);
  }
}
