import { Component, OnInit } from '@angular/core';
//import { AccountKit, AuthResponse } from 'ng2-account-kit'; 


@Component({
  selector: 'app-login-account-kit',
  templateUrl: './login-account-kit.component.html',
  styleUrls: ['./login-account-kit.component.css']
})
export class LoginAccountKitComponent implements OnInit {

  constructor() { }

    ngOnInit() {
   
  }
 
  login() {
 /*   AccountKit.login('PHONE', { countryCode: '+213', phoneNumber: '561032927' }).then(
      (response: AuthResponse) => console.log(response),
      (error: any) => console.error(error)
    );*/
  }
}
