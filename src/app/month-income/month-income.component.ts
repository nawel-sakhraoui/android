import { Component, OnInit } from '@angular/core';
import {StoreService } from '../_services/index'; 
import { Router, ActivatedRoute, ParamMap, NavigationEnd   } from '@angular/router';
import { NgxPermissionsService, NgxRolesService  } from 'ngx-permissions';  
 
@Component({
  selector: 'month-income',
  templateUrl: './month-income.component.html',
  styleUrls: ['./month-income.component.css']
})
export class MonthIncomeComponent implements OnInit {

  loading0 = false ; 
  display1= false ; 
  storetitle:string ; 
  open:boolean ; 
  store : any ={}; 
      me = JSON.parse(localStorage.getItem('currentUser')).userid ;

    income:any= [] ; 
    createdyear :any ; 
    createdmonth :any ; 
    currentyear : any ; 
    currentmonth:any ; 
    data :any =[];
    loanproof : any ;  
     opened:boolean = false ; 
    menuhide:boolean= true ; 
    constructor(private storeService:StoreService, 
              private router : Router, 
              private route: ActivatedRoute ,
              private permissionsService: NgxPermissionsService,
              private rolesService  :NgxRolesService) { }

     ngOnInit(){
           this.loading0 = true ; 
           this.route.params.subscribe(params => {
            
              this.storetitle = params['store']; // (+) converts string 'id' to a number
        
              // In a real app: dispatch action to load the details here.
              // console.log(this.storetitle) ; 
            this.storeService.getStoreStatus( this.storetitle  )
            .subscribe(
                data0 =>{
                     console.log(data0 ) ; 
                     this.open = data0['open']; 
                     this.permissionsService.addPermission('readStore', () => {
                            return true;
                           }) 
                    
                    
                     if (this.open ) {
                          this.rolesService.addRole('GUESTStore', ['readStore' ]);
                     }
                         
                     console.log(this.storetitle) ; 
                         
                     this.storeService.getStore( this.storetitle)
                     .subscribe(
                         data1=> {
                          
                             this.display1 = true ; 
                             this.store = data1 ; 
                            // console.log(this.store) ; 
                             
                             //check if i'm the store admin
                            let admin = false ; 
                              if (this.store.hasOwnProperty("administrators") ) 
                             for (let a of this.store.administrators  ){
                               if( a.userid == this.me ) {
                                   admin = true ; 
                                   break ; 
                                   }
                               
                               }
       
                             console.log(this.me) ; 
                             
                             if (this.me == this.store.userid ||  admin ) {
                                 
                                    this.permissionsService.addPermission('writeStore', () => {
                                          return true;
                                    })
                    
                                  
                                    this.rolesService.addRole('ADMINStore', ['readStore','writeStore' ]);
                                 
                             }
                             this.storeService.getIncome(this.storetitle)
                             .subscribe (
                                 data=>{
                                          console.log(data) ; 
                                            if (data['income'] ) 
                                           this.data= data['income'] ;
                                            else 
                                            this.data = [] ;  
                                          /* console.log(this.income) ;   
                                            this.createdmonth = new Date(this.store.created).getMonth() ; 
                                            this.createdyear = new Date(this.store.created).getFullYear(); ; 
                                            this.currentmonth = new Date ().getMonth();;  
                                             this.currentyear = new Date().getFullYear(); 
                             
                             
                                             for (let y = this.createdyear;  y <=  this.currentyear ; y++) {
                                                   for (let m = this.createdmonth ;  m<= this.currentmonth ; m++ ) {
                                                     
                                                           this.data.unshift ({'price':0.0, 'total':0, 'year':y , 'month':m});
                                                      }
                                                }       
                                              */
                                        this.loading0=false ; 
                                                    
                                 },error=> {
                                          console.log(error) ; 
                                        this.loading0=false ; 
                                 }
                                 )
                                 
             }    ) ;                  
                  
                });
                });
                }
    
    
    sendLoan() {
        
        
    }
    
        _toggleSidebar(){
    this.opened = !this.opened;
  }
  onclose(e){
        
      this.menuhide=false ;   
     }    
  onopen(e){
        this.menuhide= true ;
        }
    
    
    }
