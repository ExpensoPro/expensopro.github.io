import { Component, OnInit } from '@angular/core';
import { GroupService } from 'src/app/services/group.service';
import { LoginService } from 'src/app/services/login.service';
import { SpentService } from 'src/app/services/spent.service';
import { Router } from '@angular/router';
import { format } from 'date-fns';
import { GroupUserService } from 'src/app/services/group-user.service';
import swal from 'sweetalert2'
import { group } from '@angular/animations';
import * as $ from "jquery";

interface user{
  id:any,
  username:any,
  firstName:any,
  lastName:any
}
interface Group{
  id: number,
  groupName : String,
  groupDescription : String,
  groupOwner: any;
  dateCreated:any;
}
interface spent{
  id:any,
  amount:any,
  user:user,
  group:any,
  description:any,
  spentDate:string,
  totalContributors:any,
  dateCreated:any
}
interface GroupUser{
  id:any,
  group:any,
  user:user;
}
@Component({
  selector: 'app-spentlist',
  templateUrl: './spentlist.component.html',
  styleUrls: ['./spentlist.component.css']
})
export class SpentlistComponent implements OnInit {

  constructor(private groupUserService:GroupUserService,private loginService: LoginService, private groupService: GroupService, private spentService: SpentService, private router:Router) { }
  groups: Group[]=[];
  spents: spent[]=[];
  public user={
    id:'',
    username:'',
    firstName:'',
    lastName: ''
  }
  public grp={
    id: 0
  }
  public group={
    id: '',
    groupName : '',
    groupDescription : '',
    groupOwner: this.user,
    dateCreated: ''
  }
  public spent ={
    id:'',
    amount:'',
    user:this.user,
    group: this.group,
    description:'',
    spentDate:'',
    totalContributors:0,
    dateCreated:''
  }
  currentUser:any;
  selected:any=0;
  selectedId:any=0;
  guser!: any[];
  selectedGroupId:any;
  selectedgrp:any=this.selected;
  ngOnInit(): void {
    // this.loaduserGroupList();
    this.getSelectedGroup();

  }
  // loaduserGroupList(){
  //   debugger;
  //   this.currentUser = this.loginService.getUser();
  //   this.groupService.loadUserList(this.currentUser.id).subscribe(
  //     (data:any)=>{
  //       this.groups = data;
  //     },
  //     (error:any)=>{

  //     })
  // }
  getSelectedGroup(){
      if(localStorage.getItem("topSelectedGrp")!='' && localStorage.getItem("topSelectedGrp")!=null){
        this.currentUser = this.loginService.getUser();
        this.selected= localStorage.getItem("topSelectedGrp");
        this.getAllSpendsForGroup(this.selected);
      }else{
        $("#grp-selector-top").css("border","3px solid red");
        $("#grp-selector-top").find('#grpSelErrorText').remove();
        $("#grp-selector-top").append('<span id="grpSelErrorText" style="color:red;"> Please select group to proceed with spent-list data!</span>');
      }
    }
  onGroupSelected(event:any){
    this.getAllSpendsForGroup(this.selected);
  }
  getAllSpendsForGroup(selectedGroupId:any){
    this.spentService.getAllSpendsForGroup(selectedGroupId).subscribe(
      (data:any)=>{
        debugger;
        
        this.spents=data;
        for(var i=0; i<this.spents.length;i++){
          this.spents[i].spentDate = format(new Date(this.spents[i].spentDate), 'dd/MM/yyyy HH:mm');
          this.spents[i].dateCreated = format(new Date(this.spents[i].dateCreated), 'dd/MM/yyyy HH:mm:ss');
        }
      },(error:any)=>{

      }
    )
  }
  navigateToAddSpend(){
    $("[routerLink=spend-manager]").click();
      //this.router.navigateByUrl('/spend-manager');
  }
  openViewSpentInfoCart(spent:any){
    var date = new Date(spent.spentDate);
    var dateString = (date.getMonth()+1)+"/"+date.getDate()+"/"+date.getFullYear();
    $("#spentDatePicker").val(spent.spentDate);
    this.spent=spent;
    
    $("#updateSpentDiv").show();
    this.selectedGroupId = spent.group.id;
    this.selectedgrp=this.selected;
    this.getGroupUsers();
    this.loadUserDropdown();
    this.spentService.getSpentContributors(spent.id).subscribe(
      (data:any)=>{
        debugger;
        for(var i=0; i<data.length; i++){
          $("#"+data[i].user.id).prop("checked", true);
        }
      },(error:any)=>{

      }
    )
  }

  submitUpdateSpentForm(){
    var checkedUsers: any[]=[];
    $(".user-list-item").each(function(i, el){
      if($(el).is(":checked")){
        checkedUsers.push(($(el).attr("id")));
      }
    })
    var strSpentDate='';
    strSpentDate=$("#spentDatePicker").val()?.toString() as string;
    var spentDate = format(new Date(strSpentDate.split('/')[2].split(' ')[0]+"/"+strSpentDate.split('/')[1]+"/"+strSpentDate.split('/')[0]),"yyyy-MM-dd").toString();
    const currentDate: Date = new Date();
    var dateCreated = this.spent.dateCreated;
    this.spent.dateCreated = format(new Date(dateCreated.split('/')[2].split(' ')[0]+"-"+dateCreated.split('/')[1]+"-"+dateCreated.split('/')[0]+"T"+dateCreated.split(' ')[1]),"yyyy-MM-dd'T'HH:mm:ss.SSS").toString();
    this.spent.spentDate = spentDate?spentDate:currentDate.toString();
    this.currentUser = this.loginService.getUser();
    this.spent.user = this.user;
    this.spent.group = this.group;
    this.spent.user.id = this.currentUser.id;
    this.spent.totalContributors = checkedUsers.length;
    this.spent.group.id = this.selected;
    this.spentService.addNewSpent(this.spent,checkedUsers).subscribe(
      (data:any)=>{
        this.spent.user=data.user;
        swal.fire("Success","spent updated successfuly !!", "success");
      },(error:any)=>{
        swal.fire("Error","Something went wrong !!", "error");
      }
    )
  }

  getGroupUsers(){
    
    this.groupUserService.getGroupUserList(this.selectedGroupId).subscribe(
      (data:any)=>{
        debugger;
        this.guser= data;
      },(error:any)=>{

      }
    )
  }
  loadUserDropdown(){
    $(".anchor").click(function(evt){
      $(".select-user-list").toggle();
    })
  };

  onSelected(){
    console.log(this.selectedId);
    this.getGroupUsers();
  }
  clearFormFields(){
    this.spent={
      id:'',
      amount:'',
      user:this.user,
      group: this.group,
      description:'',
      spentDate:'',
      totalContributors:0,
      dateCreated:''
    }
    $("#spentDatePicker").val("");
    $(".user-list-item").each(function(i, el){
      if($(el).is(":checked")){
        $(el).prop("checked", false);
      }
    })
    this.selectedgrp="";
  }
  closeUpdateForm(){
    $("#updateSpentDiv").hide();

  }
  deleteSpendFromGroup(id:any){
    this.spentService.deleteSpent(id).subscribe(
      (data:any)=>{
        this.getAllSpendsForGroup(this.selected);
        swal.fire("Success","spent updated successfuly !!", "success");
      },(error:any)=>{
        swal.fire("Error","Something went wrong !!", "error");
      }
    )
  }
}
