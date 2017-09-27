import { Component, ViewChild, EventEmitter, Output, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

declare var window: any;
declare var gapi: any;

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
  @Output() login = new EventEmitter<{status:boolean, email: string}>();

  // login form data
  

  @ViewChild('fLogin') loginForm : NgForm;
  loginObj = {idUser: 0, email: '', password: '' };
 
  onSubmitLogin() {
       this.loginObj.email = this.loginForm.value.email;
       this.loginObj.password = this.loginForm.value.password;


       this.http.post('http://localhost:8080/User/login ', this.loginObj).subscribe(
        (responce) => {
            
          if(responce['status'] === "success") {
            
                        this.noty.next({type:"success", mess: "Your Data is added. Thanks for using our service. This windows will automaticly close after 5 seconds"});
            
                        //reset object and form
                        this.login.next({status:true, email: this.loginObj.email});

                        this.loginObj = { idUser: 0,  password: '', email: '' };
                        this.loginForm.reset();
            
                        $('.loginBlocks, .shadow').fadeOut();
                      }
            
                      else {
                        this.noty.next({type:"error", mess: "Something wrong with your request"});
                      }

        }
      );
   }

   googleLogin() {
    // test google
    let auth2 = gapi.auth2.getAuthInstance();
    if (auth2.isSignedIn.get()) {
    var profile = auth2.currentUser.get().getBasicProfile();
    // console.log('ID: ' + profile.getId());
    // console.log('Full Name: ' + profile.getName());
    // console.log('Given Name: ' + profile.getGivenName());
    // console.log('Family Name: ' + profile.getFamilyName());
    // console.log('Image URL: ' + profile.getImageUrl());
    // console.log('Email: ' + profile.getEmail());

    this.loginObj.idUser = profile.getId();
    this.loginObj.email = profile.getEmail();
    this.loginObj.password = '';

    console.log(this.loginObj);
    this.http.post('http://localhost:8080/User/login ', this.loginObj).subscribe(
      (responce) => {

            if(responce['status'] === "success") {
              this.noty.next({type: "success", mess:"Welcome " +profile.getName()+ " To Dayar.net"});

              this.login.next({status:true, email: this.loginObj.email});
              this.loginObj = { idUser: 0,  password: '', email: '' };
              $('.loginBlocks, .shadow').fadeOut();
            }

            else {
              this.noty.next({type:"error", mess: "Status of your request "+responce['status']});
            }
      });

    }

    else {
      this.noty.next({type: "error", mess:"Error with your google request please try again"});
    }
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
  @ViewChild('fHash') fHashForm : NgForm;
  @ViewChild('fPassword') fPasswordForm : NgForm;
  email: string;
  hash: string;

  currentForm: string = "email";

   pass1: string;
   pass2: string;
 
  onSubmitFogotPassword() {
       this.email = this.loginForm.value.email;

       // http request
       if (true) {
         this.passRepairForm.reset();
         this.currentForm = "hash";
       }
      
   }

   checkHash() {
      this.hash = this.fHashForm.value.hash;
      console.log(this.hash);

      // http request
      if (true) {
        this.fHashForm.reset();
        this.currentForm = "resetPass";
      }

   }


   repeairPass() {
     this.pass1 = this.fPasswordForm.value.pass1;
     this.pass2 = this.fPasswordForm.value.pass2;

     // http request
   }

}
