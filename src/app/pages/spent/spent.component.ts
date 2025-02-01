import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { GroupUserService } from 'src/app/services/group-user.service';
import { GroupService } from 'src/app/services/group.service';
import { LoginService } from 'src/app/services/login.service';
import { SpentService } from 'src/app/services/spent.service';
import swal from 'sweetalert2'
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
interface spent{
  id:any,
  amount:any,
  user:user,
  group:any,
  description:any,
  spentDate:String,
  totalContributors:any
}

interface GroupUser{
  id:any,
  group:any,
  user:user;
}
@Component({
  selector: 'app-spent',
  templateUrl: './spent.component.html',
  styleUrls: ['./spent.component.css']
})
export class SpentComponent implements OnInit {
selectedValue: any;

  constructor(private groupUserService:GroupUserService, private spentService: SpentService, private loginService:LoginService, private groupService: GroupService) { 
  }
  
  public user={
    id:'',
    username:'',
    firstname:'',
    lastname: String
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
    group: this.grp,
    description:'',
    spentDate:'',
    totalContributors:0
  }
  
  guser!: any[];
  grpUsers :user[]=[];
  selectedUserName: String='';
  currentUser : any;
  userGroups: Group[]=[];
  selectedGrp : any;
  selectedId : any;
  selected:any=1;
  ngOnInit(): void {

    this.getUserGroups();
    this.getGroupUsers();
    console.log(this.grpUsers);
    this.loadUserDropdown();
  }

  getUserGroups(){
    this.currentUser = this.loginService.getUser();
    this.groupService.loadUserList(this.currentUser.id).subscribe(
      (data:any)=>{
        this.userGroups = data;
      },
      (error:any)=>{

      })
  }
  onSelected(){
    console.log(this.selectedId);
    this.getGroupUsers();
  }

  getGroupUsers(){
    // var res = this.groupUserService.getGroupUserList(2).subscribe(data=>this.guser=data);
    // //this.guser = res;
    // debugger
    // console.log(this.guser);

    this.groupUserService.getGroupUserList(this.selected).subscribe(
      (data:any)=>{
        debugger;
        this.guser= data;
        // for(var i=0; i<data.length;i++){
        //     this.grpUsers.push(data[i].user);
        // }
        // this.grpUsers = [{'id':2,'firstname':'prajya','lastname':'naphade','username':'pajya@123'}]
        
      },(error:any)=>{

      }
    )
  }

  loadUserDropdown(){
    $(".anchor").click(function(evt){
      $(".select-user-list").toggle();
      // if($("#select-user-list").hasClass('visible')){
      //   $("#list1").removeClass('visible');
      // }else{
      //   $("#list1").addClass('visible');
      // }
    })
  };

  submitSpentForm(){
    debugger;
    var checkedUsers: any[]=[];
    $(".user-list-item").each(function(i, el){
      if($(el).is(":checked")){
        checkedUsers.push(($(el).attr("id")));
      }
    })
    var date2 = new Date("2022/5/19 GMT");
let istDate = date2.toISOString();
console.log(istDate);
    var spentDate = new Date($("#spentDatePicker").val()?.toString()+ ' GMT');
    this.spent.spentDate = spentDate?spentDate.toISOString():new Date().toISOString();
    this.currentUser = this.loginService.getUser();
    this.spent.user.id = this.currentUser.id;
    this.spent.totalContributors = checkedUsers.length;
    this.spent.group.id = this.selected;
    this.spentService.addNewSpent(this.spent,checkedUsers).subscribe(
      (data:any)=>{
        swal.fire("Success","spent added successfuly !!", "success");
      },(error:any)=>{
        swal.fire("Error","Something went wrong !!", "error");
      }
    )
  }

  

}
