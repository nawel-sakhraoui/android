import { Component, OnInit } from '@angular/core';
import {StoreService, UserdetailsService, UserService, AddressService} from '../_services/index';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
//import * as prettyMs from 'pretty-ms'
import { NgxPermissionsService, NgxRolesService  } from 'ngx-permissions';  

import { SelectedIndexChangedEventData } from "nativescript-drop-down";
import * as utils from "utils/utils";
import { TouchGestureEventData } from 'tns-core-modules/ui/gestures';
import { Label } from 'tns-core-modules/ui/label'; 

@Component({
  selector: 'app-update-store',
  templateUrl: './update-store.component.html',
  styleUrls: ['./update-store.component.css']
})
export class UpdateStoreComponent implements OnInit {
 loading :boolean ; 
    show:boolean= false  ; 
  covurl :any ="";
  storetitle :string ;  
  isValid :boolean =false ;
  read :any ='' ; 
  model:any = {'geo':[],'selectedCat':[], 'administrators':[],'tempadmin':[]};
  Categories = [];
    search : any = [];
    adminquery :any  ; 
    busy = false ; 
     notif :any ; 
   editCat    = false ; 
   editDesc   = false ;
   editAdmin  = false ; 
   editStatus = false ; 
   editGeo    = false ; 
    send = false ; 
   cities = [] ; 
    selectedIndex2 =1; 
    selectedIndex1 = 1;
    dictcities = [] ; 
    namecities= [] ; 
    searchNothing = false ; 
    catlength= false  ; 
    geolength= false ; 
    reload = false ; 
   me= JSON.parse(localStorage.getItem('currentUser')).userid ; 
  config = {
            displayKey:"description" ,//if objects array passed which key to be displayed defaults to description,
            search:true, //enables the search plugin to search in the list
           placeholder:'Selectionner des catégories', // text to be displayed when no item is selected defaults to Select,
        //customComparator: ()=>{} // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
       // limitTo: options.length
      
            height: '200px', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
              };
    
   config2= {
            displayKey:"name" ,//if objects array passed which key to be displayed defaults to description,
            search:true, //enables the search plugin to search in the list
           placeholder:'Choisir votre couverture géographique', // text to be displayed when no item is selected defaults to Select,
        //customComparator: ()=>{} // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
       // limitTo: options.length
      
            height: '200px', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
              }
  constructor(private storeService: StoreService,
              private userService : UserService, 
              private userdetailsService: UserdetailsService,
              private router: Router, private r:ActivatedRoute, 
              
            private permissionsService : NgxPermissionsService, 
            private rolesService : NgxRolesService,
            private addressService : AddressService) { }
 
   

  ngOnInit() {
        this.init() ; 
  }
    
    init(){
        
               this.loading = true ; 
       let sub = this.r.params.subscribe(params => {
            //this.parentRouteId = +params["id"];
           //console.log(params ) ; 
                this.storetitle = params['store'];
  
      
        this.storeService.getCategories()
            .subscribe(
                data => {
                     this.Categories = data['categories'] ; 
                
                  //  console.log(data);search admin 
                    
                }
                ,error =>{
                    console.log(error ) ;
                 });
      
      
       this.addressService.getCities()
               .subscribe(
                   data=>{
                       console.log(data) ; 
                      // this.cities = data['cities'] ; 
                       this.cities = data['cities'] ; 
                       this.namecities= 
                        data['cities'].reduce((result, filter) => {
                         
                          
                        result =result.concat([filter.name]) ;
                        return result;
                        },[]);
                   /*    this.cities.unshift({'id':"101","name":"Centre"}) ; 
                       this.cities.unshift({'id':"102","name":"Est"}) ; 
                        this.cities.unshift({'id':"103","name":"Ouest"}) ; 
                        this.cities.unshift({'id':"104","name":"Sud Est"}) ;
                        this.cities.unshift({'id':"105","name":"Sud Ouest"}) ;  
                       this.cities.unshift({'id':"100","name":"48 Willaya"}) ; 
                       */
                   }, error=>{
                     console.log(error ) ;     
                   }
                   ) 
            
            
      
      this.storeService.getStore (this.storetitle)
      .subscribe (
          data =>{
              this.model = data ; 
        this.reload = false ; 
                 
              
              if (!this.model.hasOwnProperty('administrators') )
                this.model['administrators']=[] ; 
              console.log(data ) ; 
        
              this.show = true ; 
               let admin = false ; 
                             for (let a of this.model.administrators  ){
                               if( a.userid == this.me ) {
                                   admin = true ; 
                                   break ; 
                                   }
                               
                               }
       
                             if (this.me == this.model.userid ||  admin ) {
                                 
                                    this.permissionsService.addPermission('writeStore', () => {
                                          return true;
                                    })
                    
                                     this.permissionsService.addPermission('readStore', () => {
                                          return true;
                                    })
                    
                                    this.rolesService.addRole('ADMINStore', ['writeStore', 'readStore' ]);
                                 
                             }
                    this.loading = false ; 
              }
          ,error =>{
            console.log(error ) ;     
              this.loading = false ; 
              this.show = true  ; 
              this.reload = true ;
          }
          )
      
      
      /* this.storeService.getNotifications (this.storetitle)
          .subscribe(
              data =>{
                  this.notif = data ; 
                   console.log(data ) ; 
                   for (let i= 0 ; i<  this.notif.notification.length ; i++ ) 
                        this.notif.notification[i].time=
                          prettyMs( new Date().getTime() - this.notif.notification[i].time);
                         this.notif.notification= this.notif.notification.reverse(); 
                        console.log(connect) ; 
                }
              ,error =>{
                  console.log(error) ; 
                  }) ; 
          
          
             
              
              let connect =  this.storeService.getNotif(this.storetitle)
                .subscribe(
                data2=> {
                    console.log(data2) ; 
                  // // data2.time = prettyMs( new Date().getTime() - data2.time);

                    this.notif.notification.unshift(data2 ) ; 
                     this.notif.notificationcount+=1; 
                
                }
                ,error2 =>{
                 console.log(error2 )     ;
               
                    
                })*/
      if (this.model.geo.length == 0 ) 
            this.geolength = true ; 
      else 
             this.geolength = false ; 
      if(this.model.selectedCat.length==0 ) 
            this.catlength= true ; 
      else 
          this.catlength = false ; 
           
           
          });
        
        }
    
    editingCat (){
        this.editCat = true; 
        this.model['tempSelectedCat'] =  this.model['selectedCat'].map(x => x); ;
      }
    removeCat(){
        this.editCat = false ; 
            this.model['selectedCat'] =      this.model['tempSelectedCat'].map(x => x); ;
      }
    loadingcat = false ; 
    saveCat(){
        this.loadingcat = true ;
        //save to database ! 
        if (this.model["selectedCat"].length!=0)
           this.storeService.updateSelectedCat( this.storetitle, this.model['selectedCat'] )
           .subscribe(
            data => {
                    this.editCat = false  
                     console.log(data ) ; 
                this.loadingcat =false ;
                }
            ,error =>{   
                      console.log(error) ; 
                 this.loadingcat =false ;
                }
            )
        else {
             this.model['selectedCat'] = this.model['tempSelectedCat'].map(x => x);  
             this.loadingcat =false ;
        }   
    }
    
    editingDesc (){
        this.editDesc = true; 
        this.model['tempdescription'] =  this.model['description'];
      }
    removeDesc(){   
    
        this.editDesc = false ; 
        this.model['description'] =      this.model['tempdescription'] ;
      }
    
    loadingdesc = false ; 
    saveDesc(){
        //save to database ! 
    
        this.loadingdesc= true ; 
        this.storeService.updateDescription( this.storetitle, this.model['description'] )
        .subscribe(
            data => {
                       this.editDesc = false 
                     console.log(data ) ; 
                this.loadingdesc=false ; 
                }
            ,error =>{
                     console.log(error) ; 
                 this.loadingdesc=false ;  
                }
            )
      }
      
    editingAdmin (){
        this.editAdmin = true; 
        if (!('administrators' in this.model)) 
            this.model['administrators'] =[] ; 
        this.model['tempadmin'] =  this.model['administrators'].slice(0);
      }
    removeAdmin(){
        this.editAdmin = false ; 
            this.model['administrators'] =      this.model['tempadmin'].slice(0) ;
   }
    
    
    loadingadmin = false ;
    
    saveAdmin(){
        //save to database ! 
       console.log(this.model.administrators) ; 
       console.log(this.model.tempadmin) ; 
            this.loadingadmin = true ; 
            this.storeService.updateAdmins( this.storetitle, this.model['administrators'])
        .subscribe(
            data=>{
                 
                if (this.model["tempadmin"].length !=0)
                for (let a of this.model['tempadmin'] ) {
                     if (!this.model['administrators'].includes(a) ) {
                        //remove  
                            this.userService.removeStore (a['userid'], this.storetitle) 
                             .subscribe (
                              data0 => {
                                console.log(data0 ) ; 
                              }, error0 =>{
                                console.log(error0 ) ; 
                                
                             }) ; 
                     }
                }
              
                if (this.model["administrators"].length!=0)
                 for (let a of this.model['administrators'] ) {
                     if (!this.model['tempadmin'].includes(a) ) {
                        //addd 
                           this.userService.addStore (a['userid'], this.storetitle) 
                             .subscribe (
                              data0 => {
                                console.log(data0 ) ; 
                              }, error0 =>{
                                console.log(error0 ) ; 
                                
                             }) ; 
                     }
                    }
                this.loadingadmin=false ;
                 this.editAdmin = false 
               },error =>{
                    console.log(error) ; 
                   this.loadingadmin=false ; 
            }  ) 
      }
      
    
     editingStatus (){
        this.editStatus = true; 
        this.model.tempopen =  this.model.open;
      }
    removeStatus(){
        this.editStatus = false ; 
            this.model.open =   this.model.tempopen ;
      }  
    
    loadingstatus = false ; 
    saveStatus(){
        //save to database ! 
        //console.log(this.model.open) ; 
        this.loadingstatus= true ;
        this.storeService.putStoreStatus( this.storetitle, this.model.open  )
        .subscribe(
            data => {
                      this.editStatus = false 
                     console.log(data ) ;
                this.loadingstatus= false;  
                }
            ,error =>{
                     console.log(error) ; 
                this.loadingstatus= false ; 
                }
            )
        
      }
      
    addAdmin(d) {
        if (!("administrators"in this.model )) 
             this.model['administrators'] = [] ; 
        this.model['administrators'].unshift({"userid":d._id, "phone":d._source.phone, "fullname":d._source.fullname}) ; 
     //  this.search = "" ; 
      //  this.adminquery ="" ; 
            this.adminquery ="" ;
          this.search = [];
    
    }
        
    getAdminQuery(event){
        
        console.log('search admin ... ' ) ; 
        console.log (this.adminquery ) ; 
   
        this.userdetailsService.searchUser( this.adminquery)
        .subscribe (
            
            data =>{
                console.log(data) ; 
                     this.search = data;   
                if (this.search.length==0 )
                 this.searchNothing = true ;  
                else {
               
                    this.searchNothing = false ; 
                    }
                   utils.ad.dismissSoftInput() ; 

            },
            error =>{
                console.log(error) ;     
            }
         ) 
    
    }
    
    removeAd(d){
        let index = this.model['administrators'].indexOf(d, 0);
        if (index > -1) {
            this.model['administrators'].splice(index, 1);
        }
        }
    
    
    
     editingGeo (){
        this.editGeo = true; 
        this.model['tempGeo'] =  this.model['geo'].map(x => x) ;;
      }
    removeGeo(){
        this.editGeo = false ; 
        this.model['geo'] =      this.model['tempGeo'].map(x => x) ;;
      }
    loadinggeo = false ; 
    saveGeo(){
        this.loadinggeo = true ; 
        //save to database ! 
        if (this.model["geo"].length!=0)
        this.storeService.updateGeo( this.storetitle, this.model['geo'] )
        .subscribe(
            data => {
                     
                    this.editGeo = false  ;
                     console.log(data ) ; 
                     this.storeService.updateArticlesGeo(this.storetitle,  this.model["geo"])
                    .subscribe(
                        data=>{
                            console.log(data) ; 
                               this.loadinggeo = false ; 
                            },error=>{
                                console.log(error) ; 
                                   this.loadinggeo = false ; 
                                }
                        )
                }
            ,error =>{   
                       this.loadinggeo = false ; 
                     console.log(error) ; 
                
                }
            );
        else {
          this.model['geo'] =      this.model['tempGeo'].map(x => x) ; ;  
      this.loadinggeo = true ;   
      }
    }
      
    public onchange(event: SelectedIndexChangedEventData){
       //console.log(event) ;
        this.model['selectedCat'].push(this.Categories[event.newIndex]) ;  
                console.log(this.model.selectedCat) ; 

       }
      removeC ( index) {
        this.model.selectedCat.splice(index, 1);
    }
    
    removeG(index){
         this.model.geo.splice(index, 1);

     }
    
     public onchange1(event: SelectedIndexChangedEventData ){
             //  console.log(`Drop Down selected index changed from ${args.oldIndex} to ${args.newIndex}`);; 
        this.model['geo'].push(this.cities[event.newIndex])
       };
    
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
    
        reloading(){
        
        console.log('reloading') ; 
      this.init() ; 
        
        
        
        }    
}
