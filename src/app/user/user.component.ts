import { Component, ViewChild, EventEmitter, Output, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  constructor(private http: HttpClient) {}

  ngOnInit() {}

  // noty object
  @Output() noty = new EventEmitter<{type:string, mess:string}>();

  // login form data
  @ViewChild('fLogin') loginForm : NgForm;
  loginObj = {idUser: 0, email: '', password: '' };
 
  onSubmitLogin() {
       this.loginObj.email = this.loginForm.value.email;
       this.loginObj.password = this.loginForm.value.password;


       this.http.post('http://localhost:8080/User/login ', this.loginObj).subscribe(
        (responce) => {
            console.log(responce);
        }
      );
   }

  // register form data
  @ViewChild('fRegister') registerForm : NgForm;
  registerObj = { idUser: 0, password: '', email: '' };
 
  onSubmitRegister() {
       //this.registerObj.username = this.loginForm.value.username;
       this.registerObj.password = this.registerForm.value.password;
       this.registerObj.email = this.registerForm.value.email;

       this.http.post('http://localhost:8080/User/register', this.registerObj).subscribe(
        (responce) => {
          if(responce['status'] === "success") {

            this.noty.next({type:"success", mess: "Your Data is added. Thanks for using our service. This windows will automaticly close after 5 seconds"});

            //reset object and form
            this.registerObj = { idUser: 0,  password: '', email: '' };
            this.registerForm.reset();

            $('.loginBlocks, .shadow').fadeOut();
          }

          else {
            this.noty.next({type:"error", mess: "Something wrong with your request"});
          }

        }
       );
   }



     // fogot pass form data
  @ViewChild('fPassRepeair') passRepairForm : NgForm;
  email: string;
 
  onSubmitFogotPassword() {
       this.email = this.loginForm.value.email;
   }

}
