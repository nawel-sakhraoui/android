import { Component, OnInit } from '@angular/core';
import {PicService, AddressService, UserdetailsService, StoreService, MessagesService } from '../_services/index';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {Subscription} from 'rxjs';
import { NgxPermissionsService, NgxRolesService  } from 'ngx-permissions'; 

import { NgxPicaService } from 'ngx-pica';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {

    display1 = false ; 
    display2 = false ; 
    loadingavatar = false ; 
    loading = false ; 
    loading2= false ; 
  avatar = '' ; 
  tempavatar = '' ; 
  userid ="";
  isValid :boolean = true ;
  read ; 
  model : any= {} ; 
  editPhone = false ; 
  editLocation = false ;
        fullnamelist = {}
    avatarlist = {} 
     alertimg:boolean ; 
    newAddress = false ; 
   me= JSON.parse(localStorage.getItem('currentUser')).userid ; 
  phonemask = ["0",/[5-7]/," ",/[0-9]/,/[0-9]/," ",/[0-9]/,/[0-9]/," ",/[0-9]/,/[0-9]/," ",/[0-9]/,/[0-9]/," "]
  stores :any =[]; 
  locations = [];
    location = [] ;
    locationAr= []; 
    tempprofilepicname ='' ;
    extension:string ;  
    file:any ; 
  locationconfig = {
        "search":true, //true/false for the search functionlity defaults to false,
        "height": "200px", //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
      "placeholder":'...',// text to be displayed when no item is selected defaults to Select,
    //    "customComparator": ()=>{}, // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
        //"limitTo": options.length // a number thats limits the no of options displayed in the UI similar to angular's limitTo pipe
       'displayKey':'name'
        }; 
 locationconfigAr = {
        "search":true, //true/false for the search functionlity defaults to false,
        "height": "200px", //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
      "placeholder":'...',// text to be displayed when no item is selected defaults to Select,
    //    "customComparator": ()=>{}, // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
        //"limitTo": options.length // a number thats limits the no of options displayed in the UI similar to angular's limitTo pipe
       'displayKey':'nameAr'
        }
  constructor(private usersdetailsService : UserdetailsService,
              private storeService : StoreService, 
              private messagesService : MessagesService,
              private addressService : AddressService, 
              private   router : Router, 
              private route : ActivatedRoute,
              private picService: PicService,
              private permissionsService : NgxPermissionsService, 
              private rolesService: NgxRolesService, 
              private _ngxPicaService :NgxPicaService
              ) { }

    
  ngOnInit() {
        
       console.log('profile') ; 
        let sub = this.route.params.subscribe(params => {
            console.log("xxxxxxxxxxxxxxx") ; 
        console.log (params);
        this.userid = params['userid'];
      
       this.addressService.getCities () 
      .subscribe (
        data => {
            console.log(data) ; 
            this.locations= data['cities'];   
        }, error => {
            console.log(error); 
        
        } )

         this.permissionsService.addPermission('readProfile', () => {
                return true;
            })
       
         if (this.me == this.userid) {
           
            this.permissionsService.addPermission('writeProfile', () => {
                return true;
            })
            this.rolesService.addRole('ADMINProfile', ['readProfile','writeProfile']); 
         }else {
              
                 this.permissionsService.removePermission('writeProfile');

             
             }
      
         this.loading = true ; 
         this.usersdetailsService.getUserAccount(this.userid)
         .subscribe (
              data=>
              {
                  console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
               
                this.model = data ;
                    console.log(this.model) ;  
                      if (this.model.hasOwnProperty('profilepicname') ) {
                      this.avatar = this.picService.getProfileLink(this.model.profilepicname);
                           this.tempprofilepicname = this.model.profilepicname; 
                       }           
                
                  this.tempavatar = this.avatar;
              this.display2= true ; 
                       this.loading2 = false ; 
                  
                  
                this.model.joined =new Date(this.model.joined).toLocaleDateString("fr-FR").replace("à","-");
                if (!this.model.phone){
                    this.model.phone ="non renseigné"   
                    }
                if (!this.model.location){
                    this.model.location ="non renseigné ";
                    this.model.locationAr= "غير معلوم" ;  
                    }else {
                    this.location = [this.model.location ] ; 
                    this.locationAr = [this.model.locationAr ] ; 
   
                }
                  
                 if (!this.model.stores ){
                    this.model.stores =["no stores "]; 
                    }
                  this.loading = false ; 
                  this.display1 = true ; 
                  
                    //get users feedback  
                  /*  for (let m of this.model.rating  ) {
                        this.usersdetailsService.getFullname (m.userid) 
                        .subscribe (
                            data => {
                                this.fullnamelist[m.userid] = data["fullname"]; 
                           },error => {
                               console.log(error) ; 
                           }
                            ); 
                        
                           this.usersdetailsService.getAvatar(m.userid) 
                        .subscribe (
                            data => {
                                 try {
                                        this.avatarlist[m.userid] = data["avatar"]; 
                                 }catch (err){
                                          this.avatarlist[m.userid] = ''; 
                                  }
                                
                           },error => {
                               this.avatarlist[m.userid] = '';  
                               console.log(error) ; 
                           }
                            );  
                        } */
              }
                 ,error=>
             {
              console.log(error )  ; 
                     this.loading = false ; 
          
              }
            ); 
     
      

       /*this.loading2 = true ; 
     this.usersdetailsService.getAvatar(this.userid)
      .subscribe (
                  data=>{
                   try {
                        this.avatar = data['avatar'] ; 
                        
                        this.tempavatar = this.avatar; 
                        this.display2= true ; 
                         //console.log(data);
                       this.loading2 = false ; 
                   }catch(error) {
                       this.display2= true ; 
                       this.avatar = "";  
                       this.loading2 = false ; 
                   }
                                            
                   }
                   ,error=>{
                          console.log(error) ;  
                         this.loading2 = false ; 
 
                       this.display2= true ;  
                          this.avatar = "" ; 
                         this.tempavatar  
                   } ); 
                */
  
    this.storeService.getStoresByUserId( this.userid ) 
    .subscribe (
            data => {
                console.log(data) ; 
                this.stores = data ; 
                
            }
            ,error =>{
                console.log(error ) ; 
            }
        )
               });
  }
    
  avatarsave() {
         this.loadingavatar = true ; 
         console.log ('saving avatar') ;
         console.log(this.file) ; 
         this._ngxPicaService.compressImage(this.file, 0.5) //, {keepAspectRatio: true})
            .subscribe((imageResized: File) => {
                let reader: FileReader = new FileReader();
                 reader.addEventListener('load', (event: any) => {
                      this.avatar = event.target.result;
                  
                }, false);
                
                reader.readAsDataURL(imageResized);
                this.file = imageResized ; 
                console.log(this.file) ; 
      
      
      
         if (this.tempprofilepicname !="" ) {
         //remove before add 
           this.picService.deleteProfile(this.tempprofilepicname) 
           .subscribe (
               data => {
                     console.log(data ) ; 

                       this.picService.putProfile( this.me+'.'+this.extension, this.file, this.extension)//postBanner(this.storetitle, this.banner)
                       .subscribe(
                        data => {
                         //this.images.push(path.replace(/^.*[\\\/]/, ''));
                  
                              this.loadingavatar = false ; 
                            console.log(data)  ;
                            this.tempavatar = this.avatar ;  
                             this.isValid  = true ;
                           // this.router.navigate([this.returnUrl]);
                           this.usersdetailsService.putProfilePicName(this.userid,this.me+'.'+this.extension)
                            .subscribe( data =>{ console.log('done'); this.tempprofilepicname = this.model.profilepicname} 
                            ,error=>{ });
         
                      
                        },
                        error => {
                              this.loadingavatar = false ; 
                            console.log(error) ; 
                           // this.alertService.error(error2);
                        //   this.saveloading = false ;
                        });
                        
                     
                   
                   },error=>{}
               
               ) 
            }else {
           
                    this.picService.putProfile( this.me+'.'+this.extension, this.file, this.extension)//postBanner(this.storetitle, this.banner)
                   .subscribe(
                        data => {
                     
                         //this.images.push(path.replace(/^.*[\\\/]/, ''));
                  
                            this.loadingavatar = false ; 
                            console.log(data)  ;
                            this.tempavatar = this.avatar ;  
                            this.isValid  = true ;
                            // this.router.navigate([this.returnUrl]);
                            this.usersdetailsService.putProfilePicName(this.userid, this.me+'.'+this.extension)
                            .subscribe( 
                                data =>{ console.log('done'); this.tempprofilepicname = this.model.profilepicname} 
                            ,error=>{ });
         
                          
                        },
                        error => {
                              this.loadingavatar = false ; 
                              console.log(error) ; 
                              // this.alertService.error(error2);
                              //  this.saveloading = false ;
                        });
           
           }
      
            }, (err ) => {
                throw err.err;
            }) 
      
          /* this.usersdetailsService.postAvatar(this.userid, this.avatar)
           .subscribe(
                        data => {
                            this.loadingavatar = false ; 
                            console.log(data)  ;
                            //this.tempavatar = this.avatar ;  
                       this.isValid  = true ;
                           // this.router.navigate([this.returnUrl]);
                        },
                        error => {
                            
                            console.log(error) ; 
                           // this.alertService.error(error2);
                          
                        });*/
  }


    
   avatarremove() {

    this.avatar = this.tempavatar; 
    this.model.profilepicname = this.tempprofilepicname;
     this.isValid = true ;


   
   }
    
  /*  private  savephone(event) {
         console.log(event);
          this.model.phone = event.value;
         // this.model.phone =   this.model.phone.replace(/(.{2})(?!$)/g,"$1-");

        }; 
  */
        
  readUrl(event:any) {
        
       if (event.target.files && event.target.files[0]) {
        this.extension =event.target.files[0]['name'].split('.').pop() ; 
        if( this.extension =="png" || this.extension =="jpg" ||  this.extension =="jpeg" ){
              this.alertimg = false ;
                
                
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (event:any) => {
            this.avatar = event.target.result;
          // console.log(this.banner) ;
        }
        
        this.isValid = false ; 
        
        this.file = event.target.files[0];
  

        /* this.compressImage(this.banner, 100, 100).then(compressed => {
                this.banner = compressed;          
                console.log(this.banner) ; 
          }) */   
            
        }else{
            
            this.alertimg = true ; 
            
            }
    }
      
      
      
    }
      

    
    removePhone(){
            this.editPhone= false ; 
            this.model.phone =    this.model.tempphone;  
          }
    
    savePhone(){
         
          this.model.tempphone =    this.model.phone; 
            // save to data base !!!!!! 
            this.editPhone= false ; 
            
          }
    
    editingPhone (){ 
        
          this.editPhone= true ; 
        }
    
        
    removeLocation(){
            this.editLocation= false ; 
            this.model.location=    this.model.templocation;  
          }
   
    getLocation(){
      
       }
    
    saveLocation(){
         console.log(this.model.location) ; 
         console.log(this.location) ; 
         this.usersdetailsService.putLocation(this.me, this.location[0] )
         .subscribe(
             data =>{
                console.log(data) ;
                  this.model.location =  this.location[0].name;
                  this.model.locationAr = this.location[0].nameAr;
                   this.model.templocation =    this.model.location;  
               ;
                      this.editLocation= false ; 
             },error=>{
                console.log(error) ; 
            } ) ; 
            // save to data base !!!!!! 
       
            
          }
    
    editingLocation(){
        
          this.editLocation= true ;
          this.model.templocation = this.model.location ;  
        }
    
    sendMessage(){
       
         this.messagesService.upMessageTo({"fromMe":this.me,"to":this.userid, "fullname": this.model.fullname, 'avatar' : this.avatar});
           
        this.router.navigate(["../../../"+this.me+"/messages/tosend"], { relativeTo: this.route });

    }
    
    

newAdd () {
this.newAddress = true ;     
}

}