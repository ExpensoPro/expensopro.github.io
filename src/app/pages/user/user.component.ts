import { Component, OnInit } from '@angular/core';
import { data } from 'jquery';
import { LoginService } from 'src/app/services/login.service';
import { UserServiceService } from 'src/app/services/user-service.service';
import swal from 'sweetalert2'

interface User{

  id: number,
  firstName : String,
  lastName : String,
  email: String,
  mobile: String,
  upi: string,
  authorities:any

}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})


export class UserComponent implements OnInit {
  users: User[]=[];
dataSource=this.users;
displayedColumns : String[]=['id'];
selectedUser:any;
currentUser: any;
editAccessWarning: boolean =false;
updatePassword: boolean = false;
role: String='';
currentUserId: any;
  constructor(private loginservice: LoginService, private userService: UserServiceService) { }
  ;
  public user = {
    id:'',
    firstName:'',
    lastName:'',
    email:'',
    password:'',
    mobile: '',
    upi: '',
    role: ''
   }
  ngOnInit(): void {
    debugger;
    this.currentUser = this.loginservice.getUser();
    //this.viewUserProfile(this.currentUser);
    //this.loadUserList();
    this.editAccessWarning = true;
    this.user= this.currentUser;
    for(let i=0; i<this.currentUser.authorities.length;i++){
      this.role += this.currentUser.authorities[i].authority
      if(i<this.currentUser.authorities.length-1){
        this.user.role += '+';
      }
  }
    $("#userPassword").val("");
    $("#userRole").val(this.role+""); 
    $(".usrdet").show();
    $(".mat-form-field-wrapper").css("padding-bottom","0px");
  }
  loadUserList(){
    this.currentUser = this.loginservice.getUser();
    this.currentUserId = this.currentUser.id;
    this.userService.loadUserList().subscribe(
      (data:any)=>{
        debugger;
        console.log(data);
        this.users = data;
        this.dataSource = this.users;
        this.selectedUser=this.dataSource[0];
        this.currentUser = this.loginservice.getCurrentUser();
        this.user.id=this.selectedUser.id;
        this.user.firstName = this.selectedUser.firstName;
        this.user.lastName = this.selectedUser.lastName;
        this.user.email = this.selectedUser.email;
        this.user.password = this.selectedUser.password;
        this.user.mobile = this.selectedUser.mobile;
      },
      (error)=>{
        console.log(error);
      })
  }

  viewUserDetails(user: any) {
    debugger;
    this.updatePassword = false;
    this.editAccessWarning = false;
    debugger;
    //user = localStorage.getItem('user');
    console.log("userid = "+user);
    this.userService.getUser(user.id).subscribe(
      (data:any)=>{
        this.selectedUser = data;
        this.currentUser = localStorage.getItem('user');
        this.currentUser = JSON.parse(this.currentUser);
        if(this.currentUser.id == this.selectedUser.id){
          this.editAccessWarning = true;
        }else if(this.currentUser.authorities!=null){
          for(let i=0; i<this.currentUser.authorities.length;i++){
            if(this.currentUser.authorities[i].authority=='ADMIN'){
              this.editAccessWarning = true;
            }
          }
        }
    this.role='';
    for(let i=0; i<this.selectedUser.authorities.length;i++){
        this.role += this.selectedUser.authorities[i].authority
        if(i<this.selectedUser.authorities.length-1){
          this.role += '+';
        }
    }
    // $("#userID").val(this.selectedUser.id);
    // $("#userFN").val(this.selectedUser.firstName);
    // $("#userLN").val(this.selectedUser.lastName);
    // $("#userEmail").val(this.selectedUser.email);
    // $("#userPhone").val(this.selectedUser.mobile);
    $("#userPassword").val("");
    $("#userRole").val(this.role+""); 
    $(".usrdet").show();
    $(".mat-form-field-wrapper").css("padding-bottom","0px");
      },(error:any)=>{
        console.log(error);
        return;
      })
    
    
  }
  updateFormSubmit(){
    debugger;
    if(this.user.firstName=='' || this.user.firstName==null){
      //swal.fire("Warning","Firstname is required !!", "warning");
      return;
    }else if(this.user.lastName=='' || this.user.lastName==null){
      //swal.fire("Warning","Lastname is required !!", "warning");
      return;
    }else if(this.user.email=='' || this.user.email==null){
      //swal.fire("Warning","Email is required !!", "warning");
      return;
    }else if(this.user.password=='' || this.user.password==null){
      //swal.fire("Warning","Password is required !!", "warning");
      return;
    }else if(this.user.mobile=='' || this.user.mobile==null){
      //swal.fire("Warning","Mobile is required !!", "warning");
      return;
    }

    this.userService.updateUser(this.user).subscribe(
      (data)=>{
        //success
        console.log(data);
        swal.fire("Success","User Updated successfuly !!", "success");
        //alert('sczxczczxczx');
        this.loadUserList();
        this.closeViewCard();

      },
      (error)=>{
        //error
        console.log(error);
        swal.fire("Error","Something went wrong !!", "error");
        this.closeViewCard();

      }
    )
  }
  closeViewCard(){
    $(".usrdet").hide();
  }

  showPasswordField(){
    this.updatePassword = true;
    $("#userPassword").val("");
    $("#askUpdatePass").hide();
  }

  viewUserProfile(user: any) {
    this.updatePassword = false;
    debugger;
    //user = localStorage.getItem('user');
    
    this.editAccessWarning = true;
        
    this.role='';
    for(let i=0; i<user.authorities.length;i++){
        this.role += user.authorities[i].authority
        if(i<user.authorities.length-1){
          this.role += '+';
        }
    }
    // $("#userID").val(this.selectedUser.id);
    // $("#userFN").val(this.selectedUser.firstName);
    // $("#userLN").val(this.selectedUser.lastName);
    // $("#userEmail").val(this.selectedUser.email);
    // $("#userPhone").val(this.selectedUser.mobile);
    $("#userPassword").val("");
    $("#userRole").val(this.role+""); 
    $(".usrdet").show();
    $(".mat-form-field-wrapper").css("padding-bottom","0px");
      
    
    
  }
}
