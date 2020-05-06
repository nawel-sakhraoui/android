import { Component, OnInit } from '@angular/core';
import {UserService } from '../_services/index';
@Component({
  selector: 'app-users-manager',
  templateUrl: './users-manager.component.html',
  styleUrls: ['./users-manager.component.css']
})
export class UsersManagerComponent implements OnInit {

  constructor(private userService : UserService) { }

   userQuery:any ; 
   search = false ; 
   usersCount ; 
   size = 20; 
   users :any  ; 
   loading = false ;
   editStatus = []; 
   tempOpen = [] ; 
   page = 1; 
   editStore =[];
   editDelivery=[] ; 
   tempownerstore= [];
   tempownerdelivery= [] ; 
   deliverylist =[] ; 
    editDelList= [];
    tempownerdellist=[];
    inputDel=""
   me = JSON.parse(localStorage.getItem('currentUser')).userid ;

  ngOnInit() {
      
      this.userService.getUserscount()
      .subscribe(
          
          data => {
             this.usersCount = data['count'] ; 
              console.log(data ) ;    
          }, error =>{
              console.log(error ) ; 
          }    
          
          )
      this.getPage (1) ; 
      // get all users in all the pages :: 
      //searchbar for user by name ? by phone  ? 
      
      
  }

    getPage (page ) {
    ///     get from to size blabla 
        this.page = page ; 
        this.loading = true;
        this.userService.getUsers( (page-1)*this.size, this.size )
        .subscribe (
          
                data =>{
                    console.log(data ) ; 
                    this.users = data ; 
                    for (let u of this.users ) {
                        this.editStatus[u._id ] = false ; 
                        this.editStore[u._id ] = false ; 
                        this.editDelivery[u._id] = false;
                        this.editDelList[u._id] = false ;
                    }
                    this.loading = false ; 
            
                }, error => {
                    console.log(error ) ; 
                    this.loading = false ; 
                }
                );
    }
    
    
  
     editingStatus (user ){
        this.editStatus[user._id] = true; 
        this.tempOpen[user._id] =  user._source.enable;
      }
    
    removeStatus(user ){
        this.editStatus[user._id] = false;
        user._source.enable = this.tempOpen[user._id]

      }  
    
    saveStatus(userid, enable){
        //save to database ! 
        //console.log(this.model.open) ; 
        
        
        this.userService.updateEnable (userid  , enable ) 
        .subscribe(
            data => {
                
                this.userService.logoutall(userid)
                .subscribe(
                     data0 =>{
                          this.editStatus[userid] = false 
                          
                           console.log(data0 ) ; 
                     }
                    ,error0 =>{
                           console.log(error0) ; 
                     });
                }
            ,error =>{
                     console.log(error) ; 
                
                }
            )
        
      }
    
    
    
    
    editingStore (user ){
        this.editStore[user._id] = true; 
        this.tempownerstore[user._id] =  user._source.ownerstore;
      }


    removeStore(user ){
        this.editStore[user._id] = false;
        user._source.ownerstore = this.tempownerstore[user._id]; 

      }  
    
    
    saveStore(userid, owner){
        //save to database ! 
        //console.log(this.model.open) ; 
        
        
        this.userService.updateOwnerstore (userid  , owner ) 
        .subscribe(
            data => {
                    this.editStore[userid] = false 
                    console.log(data) ;     
            }
            ,error =>{
                     console.log(error) ; 
                
            }
            )
        
      }
    
    
    editingDelivery (user ){
        this.editDelivery[user._id] = true; 
        this.tempownerdelivery[user._id] =  user._source.ownerdelivery;
      }
    
    removeDelivery(user ){
        this.editDelivery[user._id] = false;
        user._source.ownerdelivery = this.tempownerdelivery[user._id]; 

      }  
    
    saveDelivery(userid, owner){
        //save to database ! 
        //console.log(this.model.open) ; 
        
        
        this.userService.updateOwnerdelivery (userid  , owner ) 
        .subscribe(
            data => {
                    this.editDelivery[userid] = false 
                    console.log(data) ;     
            }
            ,error =>{
                     console.log(error) ; 
                
            }
            )
        
      }
    
    
       
    editingDelList (user ){
        this.editDelList[user._id] = true; 
        this.tempownerdellist[user._id] = user._source.delivery;
      }
    
    removeDelList(user ){
        this.editDelList[user._id] = false;
        user._source.delivery = this.tempownerdellist[user._id]; 

      }  
    
    saveDelList(userid, delivery){
        //save to database ! 
        //console.log(this.model.open) ; 
        let del = delivery.split(','); 
        console.log(del ) ; 
        
        this.userService.updateDelivery (userid  , delivery ) 
        .subscribe(
            data => {
                    this.editDelList[userid] = false 
                    console.log(data) ;     
            }
            ,error =>{
                     console.log(error) ; 
                
            }
            )
        
      }
    
    
     getUser(event ) {
         
        console.log('search user ... ' ) ; 
 
        
        this.userService.getUserByPhone( this.userQuery)
        .subscribe (
            
            data =>{
                
                this.search = true ; 
                console.log(data) ; 
                
                console.log(data) ; 
                this.users = data ; 
                
            },
            error =>{
                console.log(error) ;     
            }
         )
        
        }
  
}
