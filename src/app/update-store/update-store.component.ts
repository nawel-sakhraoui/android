import { Component, OnInit } from '@angular/core';
import {StoreService, UserdetailsService, UserService, AddressService} from '../_services/index';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import * as prettyMs from 'pretty-ms'
import { NgxPermissionsService, NgxRolesService  } from 'ngx-permissions';  



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
  model:any = {};
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
   cities = [] ; 
    
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
              private router: Router, 
              private r:ActivatedRoute, 
              private permissionsService : NgxPermissionsService, 
              private rolesService : NgxRolesService,
              private addressService : AddressService) { }
 
   

  ngOnInit() {
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
                       this.cities = data['cities'] ; 
                        
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
              console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
              console.log(data ) ; 
              this.loading = false ; 
              this.show = true ; 
               let admin = false ; 
                if (!this.model.hasOwnProperty('administrators') )
                    this.model['administrators']=[] ; 
              
                    for (let a of this.model.administrators ){
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
              
              }
          ,error =>{
            console.log(error ) ;     
              this.loading = false ; 
              this.show = true  ; 
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
              });
  }
    
    
    editingCat (){
        this.editCat = true; 
        this.model['tempSelectedCat'] =  this.model['selectedCat'];
      }
    removeCat(){
        this.editCat = false ; 
            this.model['selectedCat'] =      this.model['tempSelectedCat'] ;
      }
    saveCat(){
        //save to database ! 
        if (this.model["selectedCat"].length!=0)
        this.storeService.updateSelectedCat( this.storetitle, this.model['selectedCat'] )
        .subscribe(
            data => {
                    this.editCat = false  
                     console.log(data ) ; 
                }
            ,error =>{   
                 
                     console.log(error) ; 
                
                }
            )
        else 
          this.model['selectedCat'] =      this.model['tempSelectedCat'] ;    
      }
    
    editingDesc (){
        this.editDesc = true; 
        this.model['tempdescription'] =  this.model['description'];
      }
    removeDesc(){   
    
        this.editDesc = false ; 
        this.model['description'] =      this.model['tempdescription'] ;
      }
    saveDesc(){
        //save to database ! 
    
        
        this.storeService.updateDescription( this.storetitle, this.model['description'] )
        .subscribe(
            data => {
                       this.editDesc = false 
                     console.log(data ) ; 
                }
            ,error =>{
                     console.log(error) ; 
                
                }
            )
      }
      
    editingAdmin (){
        this.editAdmin = true; 
        this.model['tempadmin'] =  this.model['administrators'].slice(0);
      }
    removeAdmin(){
        this.editAdmin = false ; 
            this.model['administrators'] =      this.model['tempadmin'].slice(0) ;
   }
    
    saveAdmin(){
        //save to database ! 
       console.log(this.model.administrators) ; 
       console.log(this.model.tempadmin) ; 

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
                
                 this.editAdmin = false 
               },error =>{
                    console.log(error) ; 
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
    saveStatus(){
        //save to database ! 
        //console.log(this.model.open) ; 
        
        this.storeService.putStoreStatus( this.storetitle, this.model.open  )
        .subscribe(
            data => {
                      this.editStatus = false 
                     console.log(data ) ; 
                }
            ,error =>{
                     console.log(error) ; 
                
                }
            )
        
      }
      
    addAdmin(d) {
        
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
    saveGeo(){
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
                            },error=>{
                                console.log(error) ; 
                                }
                        )
                }
            ,error =>{   
                 
                     console.log(error) ; 
                
                }
            );
        else 
          this.model['geo'] =      this.model['tempGeo'].map(x => x) ; ;    
      }
    
}