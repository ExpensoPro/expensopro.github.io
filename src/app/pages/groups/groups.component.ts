import { Component, OnInit } from '@angular/core';
import { GroupService } from 'src/app/services/group.service';
import { UserComponent } from '../user/user.component';
import { GroupUserService } from 'src/app/services/group-user.service';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2'
import { UserServiceService } from 'src/app/services/user-service.service';
interface Group{
  
  id: number,
  groupName : String,
  groupDescription : String,
  groupOwner: any;
  dateCreated:any;
}

interface User{
  
  id: number,
  firstName : String,
  lastName : String,
  email: String,
  mobile: String,
  authorities:any

}

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {

  groups: Group[]=[];

  constructor(private groupService: GroupService, private groupUserService: GroupUserService, private loginService: LoginService, private userService: UserServiceService, private router: Router) { }
  public user = {
    id:'',
    firstName:'',
    lastName:'',
    email:'',
    password:'',
    mobile: '',
   }
   groupUsers: User[]=[];
   public grpOwner = {
    id:''
   }
  public group = {
    id: '',
    groupName : '',
    groupDescription : '',
    groupOwner: this.user,
    dateCreated: ''
  }
  public newGroup = {
    id: '',
    groupName : '',
    groupDescription : '',
    groupOwner: this.grpOwner,
  }
  public grpUserUser={
    id:''
  }
  public grpUserGroup={
    id:''
  }
  public groupUserModel={
    user: this.grpUserUser,
    group: this.grpUserGroup
  }
  addNewGrp: boolean = false;
  isMemberOfGroup: boolean = false;
  isGrpOwner: boolean = false;
  currentUser: any;
  currentGroup:any;
  usersList: User[]=[];
  ngOnInit(): void {
    this.loaduserGroupList();
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

  viewGroupInfo(id:any){
    this.isMemberOfGroup = false;
    this.isGrpOwner = false;
    this.groupUserService.getGroupUserList(id).subscribe(
      (data:any)=>{
        this.currentUser = this.loginService.getUser();
        for(var i=0; i<data.length;i++){
          if(data[i].user.id == this.currentUser.id){
            this.isMemberOfGroup = true;
          }
        }
      },(error:any)=>{

      }
    )
    this.groupService.getGroupInfo(id).subscribe(
      (data:any)=>{
        this.currentGroup = data;
        if(this.currentUser.id==data.groupOwner.id){
          this.isGrpOwner = true;
        }
        this.group = data;
        //this.group.groupOwner = data.groupOwner.email;
        $(".usrdet").show();
        $(".mat-form-field-wrapper").css("padding-bottom","0px");
      },(error:any)=>{
        console.log(error);
      }
    )
  }

  updateGroupInfo(){
    this.newGroup.groupName= this.group.groupName;
    this.newGroup.groupDescription = this.group.groupDescription;
    this.newGroup.id = this.group.id;
    this.newGroup.groupOwner.id = this.group.groupOwner.id; 
    this.newGroup.groupOwner.id = this.newGroup.groupOwner.id;
    this.groupService.updateGrpInfo(this.newGroup).subscribe(
      (data:any)=>{
        console.log(data);
        this.loaduserGroupList();
        this.closeViewGroup();
      },(error:any)=>{
        console.log(error);
      }
    )
  }

  closeViewGroup(){
    $(".usrdet").hide();
  }

  openNewGroupForm(){
    this.currentUser = this.loginService.getUser();
    this.grpOwner.id = this.currentUser.id;
    this.newGroup = {
      id: '',
      groupName : '',
      groupDescription : '',
      groupOwner: this.grpOwner
    }
    this.addNewGrp = true;
    $(".newgrp").show();
        $(".mat-form-field-wrapper").css("padding-bottom","0px");
  }

  createNewGroup(){
    this.groupService.addNewGroup(this.newGroup).subscribe(
      (data:any)=>{
        this.loaduserGroupList();
        this.closeNewGrp();
      },
      (error:any)=>{

      }
    )
  }

  closeNewGrp(){
    $(".newgrp").hide();
    this.addNewGrp = false;
  }

  loadGroupUserList(groupId:any){
    this.groupUsers=[];
    this.groupUserService.getGroupUserList(groupId).subscribe(
      (data:any)=>{
        for(var i=0; i<data.length; i++){
          this.groupUsers.push(data[i].user);
        }
        this.currentGroup.groupId = groupId;
        $(".usrdet").hide();
        $("#groupList").hide();
        $("#grpUsersComp").show();
      },(error:any)=>{

      }
    )
  }

  removeGrpUserFromGrp(groupId:any, userId:any){
    if(!this.isGrpOwner){
      swal.fire("Error","Sorry you don't have permission to remove user", "error");
      return;
    }else{
      this.groupUserService.removeUserFromGrp(groupId, userId).subscribe(
        (data:any)=>{
          console.log(data);
          swal.fire("success","User Removed successfuly !!", "success");
          this.loadGroupUserList(groupId);
        },(error:any)=>{
          console.log(error);
        }
      )
    }
  }

  closeGrpUserList(){
    $("#grpUsersComp").hide();
    $("#groupList").show();
  }

  showSearchCard(){
    $("#searchUserCard").show();
  }

  searchUser(){
    var searchUserInput = $("#searchUserInput").val();
    this.userService.loadUserByUsername(searchUserInput).subscribe(
      (data:any)=>{
        this.usersList=data;
      },
      (error)=>{
        console.log(error);
      })
  }

  closeSearchUserCard(){
    $("#searchUserCard").hide();
  }

  addGroupUser(user:any){
    debugger;
    console.log(this.currentGroup);
    this.groupUserModel.group.id = this.currentGroup.id;
    this.groupUserModel.user.id = user.id;
    this.groupUserService.addGroupUser(this.groupUserModel).subscribe(
    (data:any)=>{
      if(data==null){
        swal.fire("Error","User is already a member of group", "error");
      }else{
        swal.fire("Success","User added to group successfuly !!", "success");
        this.loadGroupUserList(this.currentGroup.id);
      }
    },
    (error)=>{
      console.log(error);
      swal.fire("Error","Something went wrong!!", "error");
    })
    
  }
  redirectToAddSpend(){
    $(".activeTab").removeClass("activeTab");
    this.router.navigate(["spend-manager"]);
    $("#spend-tab").addClass("activeTab");
    
  }
  

}
