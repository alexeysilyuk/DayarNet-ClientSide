import { Component, ViewChild, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

declare var gapi: any;

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  userFunction: string = 'login';

  constructor(private http: HttpClient) {}

  ngOnInit() {}


  // noty object
  @Output() noty = new EventEmitter<{type:string, mess:string}>();
  @Output() login = new EventEmitter<{status:boolean, email: string, password: string, isAdmin: boolean}>();

  @Input() API_URL : string;

  // navigation betwen tabs
  setUserFunction(param) {
    this.userFunction = param;
  }

  // login form data
  

  @ViewChild('fLogin') loginForm : NgForm;
  loginObj = {googleID: undefined, email: '', password: '' };
 
  onSubmitLogin() {
       this.loginObj.email = this.loginForm.value.email;
       this.loginObj.password = this.loginForm.value.password;


       this.http.post(this.API_URL+'/User/login ', this.loginObj).subscribe(
        (responce) => {
            console.log(responce);
          if(responce['status'] === "success") {
            
                        this.noty.next({type:"success", mess: "Your Data is added. Thanks for using our service. This windows will automaticly close after 5 seconds"});
            
                        //reset object and form
                        this.login.next({status:true, email: this.loginObj.email, password: this.loginObj.password, isAdmin: responce['admin']});

                        this.loginObj = { googleID: 0,  password: '', email: '' };
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

    this.loginObj.googleID = profile.getId();
    this.loginObj.email = profile.getEmail();
    this.loginObj.password = '';


    this.http.post(this.API_URL+'/User/login ', this.loginObj).subscribe(
      (responce) => {

            if(responce['status'] === "success") {
              this.noty.next({type: "success", mess:"Welcome " +profile.getName()+ " To Dayar.net"});

            this.login.next({status:true, email: this.loginObj.email, password:this.loginObj.password, isAdmin: responce['admin']});
              this.loginObj = { googleID: 0,  password: '', email: '' };
              $('.loginBlocks, .shadow').fadeOut();
            }

            else {
              this.noty.next({type:"error", mess: "Status of your request "+responce['status']});
            }
      });

    }

   }

  // register form data
  @ViewChild('fRegister') registerForm : NgForm;
  registerObj = { name: '',password: '', email: '' };
 
  onSubmitRegister() {
       this.registerObj.name = this.registerForm.value.name;
       this.registerObj.password = this.registerForm.value.password;
       this.registerObj.email = this.registerForm.value.email;

       this.http.post(this.API_URL+'/User/register', this.registerObj).subscribe(
        (responce) => {
          if(responce['status'] === "success") {

            this.noty.next({type:"success", mess: "Your Data is added. Thanks for using our service. This windows will automaticly close after 5 seconds"});

            //reset object and form
            this.registerObj = { name: '',  password: '', email: '' };
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
       this.email = this.passRepairForm.value.email;

       // http request
       this.http.get(this.API_URL+'/User/restorePassword?email='+this.email).subscribe(
        (responce) => {
          if(responce['status'] === "success") {
            this.passRepairForm.reset();
            this.currentForm = "hash";
            this.noty.next({type:"success", mess: "Recovery email been sended to your adress."});
       
          }

          else {
            this.noty.next({type:"error", mess: "Your email address is not exists in database. "});
          }

        }
       );

      
   }

   checkHash() {
      this.hash = this.fHashForm.value.hash;
      console.log(this.hash);

      // http request

      this.http.get(this.API_URL+'/User/checkRecoveryHash?email='+this.email+"&hash="+this.hash).subscribe(
        (responce) => {
          if(responce['status'] === "success") {
            this.fHashForm.reset();
            this.currentForm = "resetPass";      
          }

          else {
            this.noty.next({type:"error", mess: "Email or recovery hash is incorrect!"});
          }

        }
       );


   }


   repeairPass() {
    this.pass1 = this.fPasswordForm.value.pass1;
    this.pass2 = this.fPasswordForm.value.pass2;
    let newPassword = this.pass1;

    this.http.get(this.API_URL+'/User/setNewPassword?email='+this.email+"&hash="+this.hash+"&password="+newPassword).subscribe(
      (responce) => {
        if(responce['status'] === "success") {
          this.fPasswordForm.reset();
          this.currentForm = "email";
          this.userFunction="login";
          this.noty.next({type:"success", mess: "Password been changed successfully!"});
     
        }

        else {
          this.noty.next({type:"error", mess: "Something wrong with your request"});
        }

      }
     );


     // http request
   }

}
