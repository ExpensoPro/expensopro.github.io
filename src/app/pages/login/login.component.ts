import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private snack: MatSnackBar, private loginService:LoginService,private router:Router) { }
  public loginData = {
    username:'',
    password:''
   }
  ngOnInit(): void {
  }
  loginFormSubmit(){
console.log("reached login");
    if(this.loginData.username.trim()=='' || this.loginData.username==null){
        this.snack.open('Username is required','',{
          duration:3000
        });
        return;
    }

    if(this.loginData.password.trim()=='' || this.loginData.password==null){
      this.snack.open('Password is required','',{
        duration:3000
      });
      return;
    }
      this.loginService.generateToken(this.loginData).subscribe(
        (data:any)=>{
          console.log("Success");
          console.log(data);

          this.loginService.loginUser(data.token);
          this.loginService.getCurrentUser().subscribe(
            (user:any)=>{
              this.loginService.setUser(user);
              console.log(user);
              //redirect to respective dashboard
              
              console.log("role");
              console.log(this.loginService.getUserRole());
              if(this.loginService.getUserRole()=="USER"){
                this.loginService.loginStatusSubject.next(true);
                this.router.navigate(["user-dashboard"]);
              }else if(this.loginService.getUserRole()=="ADMIN"){
                this.loginService.loginStatusSubject.next(true);

              }else{
                this.loginService.logOut();
              }
            }
          )

        },(error:any)=>{
          console.log('error');
          console.log(error);
          Swal.fire('ERROR!','Invalid login details. please try again.','error');
        }
      )
  
  }

}

