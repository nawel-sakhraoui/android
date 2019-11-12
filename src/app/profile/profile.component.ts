
import { Component, OnInit } from '@angular/core';
import * as utils from "tns-core-modules/utils/utils";

import {AddressService, UserdetailsService, StoreService, MessagesService } from '../_services/index';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {Subscription} from 'rxjs';
import { NgxPermissionsService, NgxRolesService  } from 'ngx-permissions'; 
 import { SelectedIndexChangedEventData } from "nativescript-drop-down";
 

//geolocalisation ici !! 
import * as geolocation from "nativescript-geolocation";
import { Accuracy } from "tns-core-modules/ui/enums";


//img 
import * as imagepicker from "nativescript-imagepicker"; 

import {ImageSource, fromFile, fromResource, fromBase64} from "tns-core-modules/image-source";
 

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
    alertimg=false; 
     cities= [] ; 
    newAddress = false ; 
   me= JSON.parse(localStorage.getItem('currentUser')).userid ; 
  phonemask = ["0",/[5-7]/," ",/[0-9]/,/[0-9]/," ",/[0-9]/,/[0-9]/," ",/[0-9]/,/[0-9]/," ",/[0-9]/,/[0-9]/," "]
  stores :any =[]; 
  locations = [];
    location = [] ;
    locationAr= []; 
    displayavatar = false ; 
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
              private permissionsService : NgxPermissionsService, 
              private rolesService: NgxRolesService  ) { }

    
  ngOnInit() {
        
       console.log('profile') ; 
        let sub = this.route.params.subscribe(params => {
        console.log (params);
        this.userid = params['userid'];
         });
       this.addressService.getCities () 
      .subscribe (
        data => {
            console.log(data) ; 
            this.locations= data['cities'];  
            this.selectedIndex = this.locations.indexOf(this.location[0]) ;  
              this.cities = this.locations.reduce((result, filter) => {
                         result =result.concat([filter.name]) ;
                        return result;
                        },[]);
            
 
        }, error => {
            console.log(error); 
        
        }

           )

         this.permissionsService.addPermission('readProfile', () => {
                return true;
            })
       
         if (this.me == this.userid) {
           
            this.permissionsService.addPermission('writeProfile', () => {
                return true;
            })
            this.rolesService.addRole('ADMINProfile', ['readProfile','writeProfile']); 
         }else {
              
         this.rolesService.addRole('USER', ['readProfile' ]);
            this.permissionsService.removePermission('writeProfile');
             }
      
         this.loading = true ; 
         this.usersdetailsService.getUserAccount(this.userid)
         .subscribe (
              data=>
              {
                console.log(data) ; 
                this.model = data ;    
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
                    this.selectedIndex = this.locations.indexOf(this.location[0]) ;  
   
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
     

       this.loading2 = true ; 
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
  }
    
  avatarsave() {
          this.loadingavatar = true ; 
          console.log ('saving avatar') ; 
           this.usersdetailsService.postAvatar(this.userid, this.avatar)
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
                          
                        });
  }


    
   avatarremove() {

    this.avatar = this.tempavatar; 
         
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
        var reader = new FileReader();

        reader.onload = (event:any) => {
            this.avatar = event.target.result ; 
            //console.log(this.banner) ;
       }
        
        reader.readAsDataURL(event.target.files[0]);
        this.isValid = false ; 
        this.read = event.target.files[0] ; 
        /*if (this.avatar !=""){
            this.avatar = resizeb64(this.avatar,  '1000' , "800"); 
      
        // console.log(this.store.banner) ;}*/
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
  onItemTap(args) {
        console.log("Item Tapped at cell index......: " + args.index);
    }

    openUrl(url: string) {
        utils.openUrl(url);
    }
    
        logout() {
   
    //    this.permissionsService.flushPermissions();
       // this.rolesService.flushRoles();
     //   this.authenticationService.logout();
        localStorage.removeItem('currentUser');
       //         localStorage.removeItem('Language');

        this.router.navigateByUrl('/');// || '/home/'+this.userid;

    }
    
    
    watchIds = [];
    loca=[] ;
      public enableLocationTap() {
        geolocation.isEnabled().then(function (isEnabled) {
            if (!isEnabled) {
                geolocation.enableLocationRequest(true, true).then(() => {
                    console.log("User Enabled Location Service");
                }, (e) => {
                    console.log("Error: " + (e.message || e));
                }).catch(ex => {
                    console.log("Unable to Enable Location", ex);
                });
            }
        }, function (e) {
            console.log("Error: " + (e.message || e));
        });
    }

    public buttonGetLocationTap() {
        let that = this;
        geolocation.getCurrentLocation({
            desiredAccuracy: Accuracy.high,
            maximumAge: 5000,
            timeout: 10000
        }).then(function (loc) {
            if (loc) {
                that.loca.push(loc);
            }
        }, function (e) {
            console.log("Error: " + (e.message || e));
        });
    }
    
    public getCity() {
        
        this.usersdetailsService.getGeo(this.loca[0].longitude, this.loca[0].latitude ) 
        .subscribe(
            data=>{
                console.log(data) ; 
                
             },error=>{
                     console.log(error) ; 
         }) ; 

        
      }

    public buttonStartTap() {
        try {
            let that = this;
            this.watchIds.push(geolocation.watchLocation(
                function (loc) {
                    if (loc) {
                        that.loca.push(loc);
                    }
                },
                function (e) {
                    console.log("Error: " + e.message);
                },
                {
                    desiredAccuracy: Accuracy.high,
                    updateDistance: 1,
                    updateTime: 3000,
                    minimumUpdateTime: 100
                }));
        } catch (ex) {
            console.log("Error: " + ex.message);
        }
    }

    public buttonStopTap() {
        let watchId = this.watchIds.pop();
        while (watchId != null) {
            geolocation.clearWatch(watchId);
            watchId = this.watchIds.pop();
        }
    }

    public buttonClearTap() {
        this.loca.splice(0, this.loca.length);
    }
    
    
      public onSelectTap() {
       // this.isSingleMode = false;

        let context = imagepicker.create({
            mode: "single"
        });
        this.startSelection(context);
    }


 
private startSelection(context) {
        let that = this;

        context
        .authorize()
        .then(() => {
          
         
            return context.present();
        })
        .then((selection) => {
           //that.imageSrc =  selection.length > 0 ? selection[0] : null;

            let  extension = selection[0]._android.split('.').pop() ;
            if( extension =="png" || extension =="jpg" ||  extension =="jpeg" ){
              this.alertimg = false ; 
                const img:ImageSource = <ImageSource> fromFile(selection[0]._android);
           
                 this.tempavatar  = this.avatar; 
                 this.avatar  =  "data:image/"+extension+";base64,"+img.toBase64String(extension );
              //  console.log(this.banner) ; 
                        this.isValid = false ; 

            }else 
                this.alertimg = true ; 
                
           
            
        }).catch(function (e) {
            console.log(e);
        });
    }
    selectedIndex= 0 ; 
    public onchange(event: SelectedIndexChangedEventData){
 
        this.location = [ this.locations[event.newIndex]] ;

            

       } 
}
