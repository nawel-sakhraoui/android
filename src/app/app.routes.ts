
import { Routes } from '@angular/router';


import { HomeComponent } from './home/home.component';

import { MainComponent } from './main/main.component';
import { ArticleComponent} from './article/article.component'; 
import { NewarticleComponent} from './newarticle/newarticle.component'; 
import { UpArticleComponent} from './up-article/up-article.component'; 
import { BuynowComponent} from './buynow/buynow.component'; 
import { OngoingComponent} from './ongoing/ongoing.component'; 
/*import { UserValidationComponent} from './user-validation/index';*/
import { SalesComponent } from './sales/sales.component';
import { MessageComponent } from './message/message.component';
import { ListMessagesComponent } from './list-messages/list-messages.component';
import { DoneComponent } from './done/done.component';

import { SaleCommandComponent } from './sale-command/sale-command.component';
import { PurchaseCommandComponent } from './purchase-command/purchase-command.component';
/*import { LoginAccountKitComponent } from './login-account-kit/index';
*/
import { MonthIncomeComponent } from './month-income/month-income.component';

import { StoreDetailsComponent } from './store-details/store-details.component';

//import {DeliveryListComponent}  from './delivery-list/index';

import {HistoricSalesComponent}  from './historic-sales/historic-sales.component';

import { StoreComponent } from './store/store.component';

import { ProfileComponent } from './profile/profile.component';

import { CartComponent } from './cart/cart.component';

import { MenuComponent } from './menu/menu.component';
import {MyHomeComponent } from './my-home/my-home.component' ; 

import { CreatestoreComponent } from './createstore/createstore.component';

import { UpdateStoreComponent} from './update-store/update-store.component';
import { SoldoutComponent } from './soldout/soldout.component';
//import {StoresMenuComponent} from './stores-menu/index'; 
/*import { DashbordComponent } from './dashbord/index';
*/
import {AuthGuard, AnAuthGuard} from './_guards/index'; 

import { NgxPermissionsGuard } from 'ngx-permissions';

import { ResultComponent } from './result/result.component';
//import { UsersManagerComponent } from './users-manager/index';
import { StoresManagerComponent } from './stores-manager/stores-manager.component';
import {MenuTransactionsComponent} from './menu-transactions/menu-transactions.component';
import {MenuStoresComponent} from './menu-stores/menu-stores.component'; 
import {MenuNotificationsComponent} from './menu-notifications/menu-notifications.component'; 

import { Resolver } from './resolver';


export const routes: Routes = [
   /*{path: 'dashbord', component: DashbordComponent, 
        
      canActivate: [AuthGuard],
      canActivateChild: [AuthGuard],
      
    },

   { path: 'usermanager', component: UsersManagerComponent,  
            canActivate: [AuthGuard],
            canActivateChild: [AuthGuard],
          
    },
  
     { path: 'storemanager', component: StoresManagerComponent,  
            canActivate: [AuthGuard],
            canActivateChild: [AuthGuard],
          
    },
    { path: 'deliverymanager', component:DeliveryListComponent,  
            canActivate: [AuthGuard],
            canActivateChild: [AuthGuard],
    },
    */
    { path: 'home/:myhome', component: MyHomeComponent, 
    
      resolve:{ data : Resolver },
      canActivate: [AuthGuard],
      canActivateChild: [AuthGuard],
      children:[
     /*  { path: '', redirectTo:'', pathMatch: 'full' },*/

         { path: 'trans', component: MenuTransactionsComponent,canActivate: [ NgxPermissionsGuard ], 
          data: {
            permissions: {
                only: "ADMIN",
                redirectTo : "/home"
             }
          
          }},
      
        
      
              { path: 'not', component: MenuNotificationsComponent, canActivate: [ NgxPermissionsGuard ], 
          data: {
            permissions: {
                only: "ADMIN",
                redirectTo : "/home"
             }
          
          }},
      
          { path: '', component: MainComponent, canActivate: [ NgxPermissionsGuard ], 
          data: {
            permissions: {
                only: "ADMIN",  
                redirectTo : "/home"
             }
          
          }},
            
         
          

       { path: 'result', component: ResultComponent,  canActivate:[ NgxPermissionsGuard ], 
          data: {
            permissions: {
                only: "ADMIN",
                redirectTo : "/home"
             }
          
          }},
    
     { path: 'messages/tosend', component: MessageComponent, canActivate: [ NgxPermissionsGuard ], 
          data: {
            permissions: {
                only: "ADMIN",
                redirectTo : "/home"
             }
          
         }},
        { path: 'messages', component: ListMessagesComponent, canActivate: [ NgxPermissionsGuard ], 
          data: {
            permissions: {
                only: "ADMIN",
                redirectTo : "/home"
             }
          
        }}, 
      
       
        { path: 'cart', component: CartComponent, canActivate: [ NgxPermissionsGuard ], 
          data: {
            permissions: {
                only: "ADMIN",
                redirectTo : "/home"
             }
          
        }},
        
        { path: 'ongoing/done', component: DoneComponent,  canActivate:  [ NgxPermissionsGuard ], 
          data: {
            permissions: {
                only: "ADMIN",
                redirectTo : "/home"
             }
          
        }},
        { path: 'ongoing/purchase/:commandid', component: PurchaseCommandComponent,  canActivate:[ NgxPermissionsGuard ], 
          data: {
               permissions: {
                only: "ADMIN",
                redirectTo : "/home"
             }
          
        }},

        { path: 'ongoing', component: OngoingComponent,  canActivate:  [ NgxPermissionsGuard ], 
          data: {
            permissions: {
                only: "ADMIN",
                redirectTo : "/home"
             }
          
        }},
        
        { path: 'createstore', component: CreatestoreComponent, canActivate: [ NgxPermissionsGuard ], 
          data: {
            permissions: {
                only: "ADMIN",
                redirectTo : "/home"
             }
          
         }},
                      
        { path: 'storesmenu', component:  MenuStoresComponent,  canActivate:   [ NgxPermissionsGuard ], 
          data: {
            permissions: {
                only: "ADMIN",
                redirectTo : "/home"
             }
          
         }},


         { path: 'profile/:userid', component: ProfileComponent,  canActivate: [AuthGuard] },
         
         { path: 'stores/:store/store', component: StoreComponent,  canActivate:  [ AuthGuard ]},

         //{ path: 'stores/:store/', redirectTo: 'stores/:store/store', pathMatch: 'full' ,  canActivate:  [ AuthGuard ] },
         { path: 'stores/:store/soldout', component: SoldoutComponent,  canActivate: [AuthGuard], },
         { path: 'stores/:store/sales', component: SalesComponent, canActivate: [ NgxPermissionsGuard ], 
                     data: {
                       permissions: {
                            only: "ADMINStore",
                            redirectTo : "/home"
                         }
                         } 
                 },
                   
         { path: 'stores/:store/monthincome', component: MonthIncomeComponent ,canActivate: [AuthGuard],/*  canActivate: [ NgxPermissionsGuard ], 
                     data: {
                       permissions: {
                            only: "ADMINStore",
                            redirectTo : "../"
                         }
                         } */
                 },
                
         { path: 'stores/:store/commands/:commandid', component: SaleCommandComponent, canActivate:[AuthGuard]}/*  canActivate:[ NgxPermissionsGuard ], 
                     data: {
                       permissions: {
                            only: "ADMINStore",
                            redirectTo : "home"
                         }
                         } 
                 }*/,

                  
                
                { path: 'stores/:store/update', component: UpdateStoreComponent,  canActivate:  [ NgxPermissionsGuard ], 
                     data: {
                       permissions: {
                            only: "ADMINStore",
                            redirectTo : "/home"
                         }
          
                         }
                },
                { path: 'stores/:store/newarticle', component: NewarticleComponent,  canActivate: [ NgxPermissionsGuard ], 
                     data: {
                       permissions: {
                            only: "ADMINStore",
                            redirectTo : "/home"
                         }
          
                         } 
                },
                { path: 'stores/:store/details', component: StoreDetailsComponent,  canActivate: [AuthGuard], },
                { path: 'stores/:store/historic', component: HistoricSalesComponent,canActivate: [ NgxPermissionsGuard ], 
                     data: {
                       permissions: {
                            only: "ADMINStore",
                            redirectTo : "/home"
                         }
          
                         } 
                },
  
      
                  { path : "stores/:store/articles/:article/update", component: UpArticleComponent,  canActivate:[ NgxPermissionsGuard ], 
                    data: {
                        permissions: {
                        only: "ADMINStore",
                        redirectTo : "/home"
                        }
          
                    } },
        
                  { path:  'stores/:store/articles/:article', component: ArticleComponent,  canActivate: [AuthGuard] }, 
        
                  { path : "stores/:store/articles/buynow/article", component: BuynowComponent,  canActivate: [AuthGuard] },
                  { path: '**', redirectTo: '' },
        ]
       }
  
   // { path: 'mystores/updates', component: UpdateStoreComponent},// canActivate: [AuthGuard] },
    // later public stores components to create ! 
    //{ path: 'stores/:store', component:StoresMenuComponent, canActivate: [AnAuthGuard]},
    
    /*    { path: 'stores', component: MenuComponent,  
          canActivate: [AuthGuard],
          canActivateChild: [AuthGuard],
          children: [
          
              //  { path: '', redirectTo: '', pathMatch: 'full' ,  canActivate:  [ AuthGuard ] },
                { path: '', component:  MenuStoresComponent,  canActivate:  [ AuthGuard ]},

            ]},*/
        
    /*    { path: 'stores/:store', component: MyHomeComponent,  
          canActivate: [AuthGuard],
          canActivateChild: [AuthGuard],
           resolve:{ data : Resolver },
          children: [
          
          //      { path: '', redirectTo: 'store', pathMatch: 'full' ,  canActivate:  [ AuthGuard ] },
                //{ path: '', component: StoreComponent,  canActivate:  [ AuthGuard ]},

          //      { path: 'stores/:store', component: StoreComponent,  canActivate:  [ AuthGuard ]},
                { path: 'soldout', component: SoldoutComponent,  canActivate: [AuthGuard], },
                { path: 'sales', component: SalesComponent, canActivate: [ NgxPermissionsGuard ], 
                     data: {
                       permissions: {
                            only: "ADMINStore",
                            redirectTo : "/home"
                         }
                         } 
                 },
                   
                 { path: 'monthincome', component: MonthIncomeComponent ,canActivate: [AuthGuard],/*  canActivate: [ NgxPermissionsGuard ], 
                     data: {
                       permissions: {
                            only: "ADMINStore",
                            redirectTo : "../"
                         }
                         } */
            /*     },
                
                { path: 'commands/:commandid', component: SaleCommandComponent, canActivate:[AuthGuard]}/*  canActivate:[ NgxPermissionsGuard ], 
                     data: {
                       permissions: {
                            only: "ADMINStore",
                            redirectTo : "home"
                         }
                         } 
                 }*/,

                  
             /*   
                { path: 'update', component: UpdateStoreComponent,  canActivate:  [ NgxPermissionsGuard ], 
                     data: {
                       permissions: {
                            only: "ADMINStore",
                            redirectTo : "/home"
                         }
          
                         }
                },
                { path: 'newarticle', component: NewarticleComponent,  canActivate: [ NgxPermissionsGuard ], 
                     data: {
                       permissions: {
                            only: "ADMINStore",
                            redirectTo : "/home"
                         }
          
                         } 
                },
                { path: 'details', component: StoreDetailsComponent,  canActivate: [AuthGuard], },
                { path: 'historic', component: HistoricSalesComponent,canActivate: [ NgxPermissionsGuard ], 
                     data: {
                       permissions: {
                            only: "ADMINStore",
                            redirectTo : "/home"
                         }
          
                         } 
                },
  
      
                  { path : "articles/:article/update", component: UpArticleComponent,  canActivate:[ NgxPermissionsGuard ], 
                    data: {
                        permissions: {
                        only: "ADMINStore",
                        redirectTo : "/home"
                        }
          
                    } },
        
                    { path:  'articles/:article', component: ArticleComponent,  canActivate: [AuthGuard] }, 
        
                  { path : "articles/buynow/article", component: BuynowComponent,  canActivate: [AuthGuard], },
        
           
                    { path: '**', redirectTo: '' },
        ]},
    
         */
      
    { path:'home', redirectTo:'' , pathMatch: 'full'},
    { path: '', component: HomeComponent, canActivate: [AnAuthGuard]},
    { path: 'login', component: HomeComponent, canActivate: [AnAuthGuard] },
   // { path: 'signin', component: SigninComponent, canActivate: [AnAuthGuard] },
    //{ path: 'validation/:userid', component: UserValidationComponent, canActivate: [AnAuthGuard] },
    //{ path: 'loginaccount', component: LoginAccountKitComponent, canActivate: [AnAuthGuard] },
       

    // otherwise redirect to home
    { path: '**', redirectTo: '' , pathMatch: 'full'} 
    
   

    ];

//export const routing = RouterModule.forRoot(appRoutes);

