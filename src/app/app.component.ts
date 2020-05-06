import { Component, OnInit, LOCALE_ID, Inject } from '@angular/core';
import { Title }     from '@angular/platform-browser'; 
import  { AddressService, UserdetailsService} from './_services/index'; 
import { Router} from '@angular/router';
//import firebase from 'firebase/app';
//import 'firebase/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
        
  language :string ; 
  public constructor(private router: Router  ,
                    private titleService: Title,
                  @Inject(LOCALE_ID) protected localeId: string
      ) { 
       
      
      
  if ( !localStorage.getItem("Language") ) {
          
            localStorage.setItem('Language', this.localeId); 
            if ( localStorage.getItem("Language")=="fr") 
                this.titleService.setTitle("Ceen.dz"); 
            else 
                this.titleService.setTitle("Ceen.dz"); 
            
     } else 
       if (localStorage.getItem("Language")!= this.localeId) {
            window.location.href="http://"+window.location.hostname+":8080/"+localStorage.getItem("Language") ; 


      }
            if ( localStorage.getItem("Language")=="fr") 
                this.titleService.setTitle("Ceen.dz"); 
            else 
                this.titleService.setTitle("Ceen.dz");
      

      
        let userid = "annonym"; 
      if(!localStorage.getItem("currentUser") )
             localStorage.setItem('currentUser', JSON.stringify({userid,  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IlUyRnNkR1ZrWDE5QU1kQjBXMWNSMkJlc2ZNUVVMSGt5VEdkaklsZDV3Njg9IiwiaWF0IjoxNTg1Mzc4OTM4fQ.IvZiaXujfWEFauOpCnIfzLv9f1a0VzpHuiYbE_J6kDM" }));

}
}