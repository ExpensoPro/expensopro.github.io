import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material';
import { ComunicationService } from 'src/app/services/comunication.service';
import { UserServiceService } from 'src/app/services/user-service.service';
import swal from 'sweetalert2'
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor( private userService: UserServiceService, private snack:MatSnackBar,private comunicationService:ComunicationService) { }
 public user = {
  firstName:'',
  lastName:'',
  email:'',
  password:'',
  mobile: '',
 }

 isOtpValidated : boolean=false;
  ngOnInit(): void {
  }
  registerFormSubmit(){
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

    if(!this.isOtpValidated){
      swal.fire("Incorrect otp","Re-enter correct otp !!", "error");
      return;
    }

    debugger;
    this.userService.addUser(this.user).subscribe(
      (data)=>{
        //success
        console.log(data);
        swal.fire("Success","User Registered successfuly !!", "success");
        this.isOtpValidated=false;
        //alert('sczxczczxczx');
      },
      (error)=>{
        //error
        console.log(error);
        swal.fire("Error","Something went wrong !!", "error");
      }
    )
  }
  verifyEmail(email:any){
    
    if (email!="" && email!=null){
      this.comunicationService.sendVerifyEmailOtp(email).subscribe(
        (data:any)=>{
          return;
        },
        (error:any)=>{
          
        }
      )
    }else{
      return;
    }
  }

  validateOtp(email:any){
    this.isOtpValidated=false;
    var enteredOtp = $("#otpInput").val();
    var sentOtp='';
    this.comunicationService.getOtpForUser(email).subscribe(
      (data:any)=>{
        sentOtp=data;
        if(sentOtp!='' && sentOtp==enteredOtp){
          this.isOtpValidated=true;
        }else if(sentOtp==null){
          swal.fire("Invalide otp","Click Resend Otp to get new Otp !!", "error");
        }
      },
      (error:any)=>{
        
      }
    )
  }
}
