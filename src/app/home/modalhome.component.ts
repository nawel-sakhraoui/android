import {Component, Input,Output, EventEmitter,OnInit  } from '@angular/core';
import {  UserService, UserdetailsService} from '../_services/index';
import * as CryptoJS from 'crypto-js'; 
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
declare var grecaptcha: any;

@Component({
  selector: 'app-modalhome',
  template: `
 <div *ngIf="visible" (click)="onContainerClicked($event)" i18n-class class=" text-left modal fade" tabindex="-1" [ngClass]="{'in': visibleAnimate}"
       [ngStyle]="{'display': visible ? 'block' : 'none', 'opacity': visibleAnimate ? 1 : 0}">
    <div class="modal-dialog">
   <div class="modal-content">

    <div class="modal-header">
       <h4  i18n="@@validation"> Validation </h4>
   </div>

    <form name="form" (ngSubmit)="f.form.valid  && registration() && !codelength" #f="ngForm" novalidate>
      <div class="modal-body" >

      <div class="form-group" >
     
            <p  i18n="@@coderecu">  Taper le code que vous venez de recevoir  </p>
            <input  [textMask]="{mask: phonemask}"   class="form-control"   type="text"  name="code" [(ngModel)]="model"  required #code="ngModel" />    
            <div i18n="@@codealert" *ngIf="f.submitted && code.hasError('required')" class=" alert alert-danger help-block">Entrer Le code !</div>
            <div i18n="@@codealert2" *ngIf="f.submitted  && codelength" class="help-block alert alert-danger ">Taper Les 6 chiffres reçu </div>
            <div i18n="@@codealert3"  *ngIf=" error!=0 " class="help-block alert alert-danger">Code incorrecte veuiller reessayer (plus que {{3-error}}essaie)</div>

      </div>
      </div>
      <div class="modal-footer">
        <div class="form-group" >
          <Button  i18n="@@sendcode"  class="btn btn-outline-dark" style="float:right;"  >Envoyer
                   <img *ngIf="loading" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
        </Button> 
        </div>
   
</div>
    </form>       

      </div>
    </div>
  </div>` ,
  styles: [`
    .modal {
   
      background: rgba(0,0,0,0.3);
    }
  `]
  
})
    
export class ModalhomeComponent implements OnInit {
  phonemask = [/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/];

  public visibleAnimate = false;
   
  model:string=""; 
  error:number =0;
  codelength:boolean ; 
  loading:boolean;
  returnUrl:string ; 
  @Input()  phone:string ="";
  @Input()  login:boolean ; 
  @Input()  showing:boolean ; 
  @Input()  confirmResult :any ; 
  @Output() validate: EventEmitter<any> = new EventEmitter();
  @Input()  userid:string ; 
    
  @Input() fullname :string ;
   visible :boolean ;  
   constructor( private userService : UserService, 
                private userdetailsService : UserdetailsService,
                private route :ActivatedRoute, 
                private router :Router){
   }
    
    
    ngOnInit(){
             if( !this.model.includes('_') && this.model.length!=0)
                this.codelength=false ; 
        }
 
    
  public show(): void {
    this.visible = true;
    setTimeout(() => this.visibleAnimate = true, 5); //console.log("aaaaaaaaaaaaa") ; console.log(this.phone) ; 
  }

  public hide(): void {
    this.visibleAnimate = false;
    setTimeout(() => this.visible = false, 10);
  }

    
  public onContainerClicked(event: MouseEvent): void {
   // if ((<HTMLElement>event.target).classList.contains('modal')) {
    //  this.hide();
   // }
  }
    
    
    sendValidate(){
        
        if(this.model) {
         this.validate.emit(this.model) ; 
         this.hide() ; 
            
        }
    
    }
    
    registration (){
        
         if (this.login) 
          this.logins()
        else 
             this.register() 
    }
    
    logins(){
        this.loading = true ;
         if( this.model.includes('_'))
                this.codelength=true ; 
         else {
             this.codelength = false; 
         let that = this ; 

         this.confirmResult.confirm(this.model)
         .then(function (result) {
                         //// User signed in successfully.
                          //var user = result.user;
                             // ...
                            
                              console.log(result);
                                that.error=0;
                            
                             //CryptoJS.PBKDF2(this.model.phone, 'abc', { keySize: 128/32, iterations: 1}).toString();; 
                                
                            
                                let salt = that.userid ; 
                                console.log(salt) ; 
                                let token =  CryptoJS.PBKDF2(that.model,  salt, { keySize: 128/32, iterations: 100 }).toString();; 
                                                  
                                that.userService.loginUser( that.userid, token )
                             // .pipe(first())
                                    .subscribe (
                                     data=> {
                                             if (data['auth'] ) {
                                                  console.log(data);
                                                    let userid: string = that.userid;
                                                    localStorage.setItem('currentUser', JSON.stringify({userid,  token: data['token'] }));
                                                        console.log(localStorage.getItem('currentUser'));
                                                // localStorage.setItem('currentUser', JSON.stringify({userid:this.model.userid,  token: data['token'] }));
                                                 //create userdetails in store 
                                                // this.router.navigateByUrl(this.returnUrl);
                                                 that.returnUrl = that.route.snapshot.queryParams['returnUrl'] || '/';
                                                // that.loading= false ; 
                                                 console.log(that.returnUrl) ;  
                                                 that.loading=false;
                                                 that.router.navigateByUrl(that.returnUrl);
                                                 
                                                    that.hide() ; 
                                  
                                                
                                                }
                                         
                                      },error0=>{
                                       if (error0.status == 401) {
                                           that.validate.emit("problème de connexion reessayer ulterieurement ") ;  
                                           
                                           that.loading=false;
                                           that.hide() ; 
                                  
                                    }});  
                    
                    
                               }).catch(function (error) {
                          
                                        
                                  that.error=that.error+1;
                                   if(that.error  >3 ){
                                        that.validate.emit("Vs avez atteint la limite des essaies reessayer ulterieurement ") ;  
                                       that.loading=false; 
                                       that.hide() ; 
                                       that.error = 0 
                                  }else 
                                       that.loading=false;
                                     // User couldn't sign in (bad verification code?)
                                     // ... try again 3 time then close everything
                                  // this.errorMsg ="Code incorrecte veuiller reessayer "; 
                                   
                                });
             
             }
        }
    
    
    register () {
        this.loading=true ; 
             
         if( this.model.includes('_'))
                this.codelength=true ; 
         else {
             this.codelength = false; 
         let that = this ; 

         this.confirmResult.confirm(this.model)
         .then(function (response) {
             
            console.log(response);
                               
                                let userid = CryptoJS.PBKDF2(that.phone, 'abc', { keySize: 128/32, iterations: 1}).toString();; 
                                let salt = userid ; 
                                console.log(salt) ; 
                                let token =  CryptoJS.PBKDF2(that.model,  salt, { keySize: 128/32, iterations: 100 }).toString();; 
                                                  
                                that.userService.createUser( that.fullname, that.phone, token, userid)
                         //     .pipe(first())
                                .subscribe (
                                
                                    
                                    data=> {
                                             if (data['auth'] ) {
                                              localStorage.setItem('currentUser', JSON.stringify({userid, token: data['token']  }));

                                                  
                                                   console.log(localStorage.getItem('currentUser'));
                                                //create userdetails in store 
                                                              that.userdetailsService.postUserAccount (that.fullname, that.phone)
                                                                .subscribe(
                                                                      data3=>{
                                                                          console.log(data3);

                                                                          that.returnUrl = that.route.snapshot.queryParams['returnUrl'] || '/';
                                                                           //localStorage.setItem('currentUser', JSON.stringify({userid,  token: data['token'] }));
                                                                        
                                                                           that.loading=false ; 
                                                                           that.router.navigateByUrl(this.returnUrl);
                                                                           that.hide() 
                                                                      
                                                                      },error3=>{
                                                                            that.validate.emit("problème de connexion reessayer ulterieurement ") ;  
                                                                          that.loading=false ; 
                                                                          that.hide() 
                                                                          console.log(error3);
                                                                      }
                                                                  );
                                                 
                                                
                                                 console.log(data);
                                                }
                                         
                                    },error0=>{
                                       if (error0.status == 401) {
                                          let noauth = true;
                                        
                                        that.validate.emit("problème de connexion reessayer ulterieurement ") ;  
                                        that.loading=false ;
                                           that.hide() 
                                  
                                    }});  
                                // create user session and useraccount ! $kiba$
        
        
         }).catch(function (error) {
                          
                                        
                                    that.error=that.error+1;
                                   if(that.error  >3 ){
                                        that.validate.emit("Vs avez atteint la limite des essaies reessayer ulterieurement ") ;  
                                       that.loading=false ;
                                       that.hide() ; 
                                       that.error = 0 
                                  }else
                                       that.loading=false;
                                     // User couldn't sign in (bad verification code?)
                                     // ... try again 3 time then close everything
                                  // this.errorMsg ="Code incorrecte veuiller reessayer "; 
                                 
                                });
             
        
        }
    }
}