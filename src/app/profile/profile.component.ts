
import { Component, OnInit,NgZone } from '@angular/core';
import * as utils from "tns-core-modules/utils/utils";

import {Frame}  from "ui/frame" ;


import {PicService, AddressService, UserdetailsService, StoreService, MessagesService } from '../_services/index';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {Subscription} from 'rxjs';
import { NgxPermissionsService, NgxRolesService  } from 'ngx-permissions'; 
 import { SelectedIndexChangedEventData } from "nativescript-drop-down";
import {Folder, path, knownFolders} from "tns-core-modules/file-system"; 
 import * as BitmapFactory from "nativescript-bitmap-factory"; 

//geolocalisation ici !! 
import * as geolocation from "nativescript-geolocation";
import { Accuracy } from "tns-core-modules/ui/enums";


//img 
import * as imagepicker from "nativescript-imagepicker"; 

import {ImageSource, fromFile, fromResource, fromBase64} from "tns-core-modules/image-source";
 
import * as util from "utils/utils";
  
import { RouterExtensions } from "nativescript-angular/router";


//                util.ad.dismissSoftInput() ; 
import { TouchGestureEventData } from 'tns-core-modules/ui/gestures';
import { Label } from 'tns-core-modules/ui/label'; 
@Component({
    moduleId: module.id,
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
    reload :boolean = false ; 
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
    extension ='' ; 
    tempprofilepicname ="" ; 
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
              private rolesService: NgxRolesService  , 
              private picService : PicService, 
              private ngZone : NgZone, 
              private routerE: RouterExtensions) { }

    
  ngOnInit() {
     this.init();
  }
    
    
  init(){
     this.loading = true ;  
       console.log('profile') ; 
        let sub = this.route.params.subscribe(params => {
        console.log (params);
        this.userid = params['userid'];
 
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
      
         
         this.usersdetailsService.getUserAccount(this.userid)
         .subscribe (
              data=>
              {
                console.log(data) ; 
                this.model = data ;    
                          this.reload = false ;

                if (this.model.hasOwnProperty('profilepicname') ) {
                      this.avatar = this.picService.getProfileLink(this.model.profilepicname)
                      this.tempprofilepicname = this.model.profilepicname ; 
                }else 
                      this.avatar = "" ; 
                this.tempavatar = this.avatar;
               //   console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa') ; 
                 console.log(this.avatar) ; 
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
                  
                        // 
        
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
                     this.reload = true ; 
          
              }
            ); 
     
    /*
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
         /* this.loadingavatar = true ; 
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
         */

       if (this.tempprofilepicname !="" ) {
         //remove before add 
           this.picService.deleteProfile(this.tempprofilepicname) 
           .subscribe (
               data => {
                     console.log(data ) ; 
                       this.picService.putProfile( this.model.profilepicname, this.avatar, this.extension)//postBanner(this.storetitle, this.banner)
                       .subscribe(
                        data => {
                         this.ngZone.run(() => {
                         //this.images.push(path.replace(/^.*[\\\/]/, ''));
                  
                              this.loadingavatar = false ; 
                            console.log(data)  ;
                            this.tempavatar = this.avatar ;  
                             this.isValid  = true ;
                           // this.router.navigate([this.returnUrl]);
                           this.usersdetailsService.putProfilePicName(this.userid, this.model.profilepicname)
                            .subscribe( data =>{ console.log('done'); this.tempprofilepicname = this.model.profilepicname} 
                            ,error=>{ });
         
                                    
                         });
                        },
                        error => {
                              this.loadingavatar = false ; 
                            console.log(error) ; 
                           // this.alertService.error(error2);
                        //   this.saveloading = false ;
                        });
                        
                     
                   
                   },error=>{}
               
               ) 
        }    else {
           
                  this.picService.putProfile( this.model.profilepicname, this.avatar, this.extension)//postBanner(this.storetitle, this.banner)
                       .subscribe(
                        data => {
                         this.ngZone.run(() => {
                         //this.images.push(path.replace(/^.*[\\\/]/, ''));
                  
                              this.loadingavatar = false ; 
                            console.log(data)  ;
                            this.tempavatar = this.avatar ;  
                             this.isValid  = true ;
                           // this.router.navigate([this.returnUrl]);
                           this.usersdetailsService.putProfilePicName(this.userid, this.model.profilepicname)
                            .subscribe( data =>{ console.log('done'); this.tempprofilepicname = this.model.profilepicname} 
                            ,error=>{ });
         
                                    
                         });
                        },
                        error => {
                              this.loadingavatar = false ; 
                            console.log(error) ; 
                           // this.alertService.error(error2);
                         //  this.saveloading = false ;
                        });
           
           }
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
   
           this.permissionsService.flushPermissions();
         this.rolesService.flushRoles();
       //  this.authenticationService.logout();
        localStorage.removeItem('currentUser');
         localStorage.removeItem('Language');

        //this.router.navigateByUrl('/');// || '/home/'+this.userid;
         this.routerE.navigate(['/'], {clearHistory: true});

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
                //const img:ImageSource = <ImageSource>ImageSource.fromFileSync(selection[0]._android);

                 //selection[0].options = {width:600, height:500, keepAspectRatio:true };
                //console.log(selection[0]) ;
           
                const img:ImageSource = <ImageSource> ImageSource.fromFileSync(selection[0]._android);
                // selection[0].options = {width:500, height:300, keepAspectRatio:true };
              //  let base =img.toBase64String(extension ); 
               
                 this.resizeImageSource(img, 500).then((resizedImageSrc: ImageSource) => {
                   
               console.log(img) ; 
            
                const folderDest = knownFolders.temp();
                const pathDest = path.join(folderDest.path, selection[0]._android.split('/').pop()) ;
                const saved: boolean = resizedImageSrc.saveToFile(pathDest, extension);
                if (saved) {
                    console.log("Image saved successfully!");
                }

                     
                     
     
                
             
                
                 this.avatar = pathDest ;
                console.log(this.avatar) ; 
               // this.tempavatar  = this.avatar; 
               //  this.avatar  = selection[0]._android; // "data:image/"+extension+";base64,"+img.toBase64String(extension );
              //  console.log(this.banner) ; 
                this.extension = extension ; 
                 this.isValid = false ; 
                this.model.profilepicname = this.userid+'.'+this.extension ; 

             });
                
                
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
    
    ontouch(args: TouchGestureEventData) {
    const label = <Label>args.object
    switch (args.action) {
        case 'up':
            label.deletePseudoClass("pressed");
            break;
        case 'down':
            label.addPseudoClass("pressed");
            break;
    }
   
}
    
    ontouch3(args: TouchGestureEventData) {
    const label = <Label>args.object
    switch (args.action) {
        case 'up':
            label.deletePseudoClass("pressed3");
            break;
        case 'down':
            label.addPseudoClass("pressed3");
            break;
    }
   
}
    hide(){
          util.ad.dismissSoftInput() ;  
        }
    reloading(){
        
        console.log('reloading') ; 
      this.init() ; 
        
        
        
        }
    private resizeImageSource(imageSrc:ImageSource, maxSize) : Promise<ImageSource> {
    return new Promise((resolve, reject) => {
      const bitmap = BitmapFactory.create(imageSrc.width, imageSrc.height);
      bitmap.dispose((imageBitmap) => {
        imageBitmap.insert(BitmapFactory.makeMutable(imageSrc));
        const resizedBitmap = imageBitmap.resizeMax(maxSize);
        resolve(resizedBitmap.toImageSource());
      }, (error) => { reject(error); });
    });
  }
}
