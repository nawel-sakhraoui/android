import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }
    
/* createNewUser(phone: string) {
  

    return new Promise(
      (resolve, reject) => {
        firebase.auth.signInWithPhoneNumber(phone, new firebase.auth.RecaptchaVerifier('recaptcha-container')).then(
          () => {
            resolve();
          },
          (error) => {
            reject(error);
          }
        );
      }
    );
}   

signInUser(phone: string) {
    return new Promise(
      (resolve, reject) => {
        firebase.auth.signInWithPhoneNumber(phone, new firebase.auth.RecaptchaVerifier('recaptcha-container')).then(
          () => {
            resolve();
          },
          (error) => {
            reject(error);
          }
        );
      }
    );
}

signOutUser() {
    firebase.auth().signOut();
}
*/
}
