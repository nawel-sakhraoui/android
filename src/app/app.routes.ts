
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

import { MyHomeComponent } from './my-home/my-home.component';

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
    
     
      canActivate: [AuthGuard],
      canActivateChild: [AuthGuard],
      children:[
     /*  { path: '', redirectTo:'', pathMatch: 'full' },*/

         { path: 'trans', component: MenuTransactionsComponent,canActivate: [AuthGuard]/* canActivate: [ NgxPermissionsGuard ], 
          data: {
            permissions: {
                only: "ADMIN",
                redirectTo : "/home"
             }
          
          }*/},
      
        
      
              { path: 'not', component: MenuNotificationsComponent,canActivate: [AuthGuard]/* canActivate: [ NgxPermissionsGuard ], 
          data: {
            permissions: {
                only: "ADMIN",
                redirectTo : "/home"
             }
          
          }*/},
      
          { path: '', component: MainComponent,canActivate: [AuthGuard]/* canActivate: [ NgxPermissionsGuard ], 
          data: {
            permissions: {
                only: "ADMIN",  
                redirectTo : "/home"
             }
          
          }*/},
            
         
          

       { path: 'result', component: ResultComponent, canActivate: [AuthGuard] /*[ NgxPermissionsGuard ], 
          data: {
            permissions: {
                only: "ADMIN",
                redirectTo : "/home"
             }
          
          }*/},
    
     { path: 'messages/tosend', component: MessageComponent,  canActivate:[AuthGuard]/* [ NgxPermissionsGuard ], 
          data: {
            permissions: {
                only: "ADMIN",
                redirectTo : "/home"
             }
          
         }*/},
        { path: 'messages', component: ListMessagesComponent, canActivate: [AuthGuard] /*[ NgxPermissionsGuard ], 
          data: {
            permissions: {
                only: "ADMIN",
                redirectTo : "/home"
             }
          
        }*/}, 
      
       
        { path: 'cart', component: CartComponent,canActivate: [AuthGuard]/*  canActivate: [ NgxPermissionsGuard ], 
          data: {
            permissions: {
                only: "ADMIN",
                redirectTo : "/home"
             }
          
        }*/},
        
        { path: 'ongoing/done', component: DoneComponent,  canActivate: [AuthGuard]/* [ NgxPermissionsGuard ], 
          data: {
            permissions: {
                only: "ADMIN",
                redirectTo : "/home"
             }
          
        }*/},
        { path: 'ongoing/purchase/:commandid', component: PurchaseCommandComponent,  canActivate: [AuthGuard]/*[ NgxPermissionsGuard ], 
          data: {
                              permissions: {
                only: "ADMIN",
                redirectTo : "/home"
             }
          
        }*/},

        { path: 'ongoing', component: OngoingComponent,  canActivate: [AuthGuard]/* [ NgxPermissionsGuard ], 
          data: {
            permissions: {
                only: "ADMIN",
                redirectTo : "/home"
             }
          
        }*/},
        
        { path: 'createstore', component: CreatestoreComponent, canActivate: [AuthGuard ]/* canActivate: [ NgxPermissionsGuard ], 
          data: {
            permissions: {
                only: "ADMIN",
                redirectTo : "/home"
             }
          
         }*/},
        

         { path: 'profile/:userid', component: ProfileComponent,  canActivate: [AuthGuard] },
            { path: '**', redirectTo: '' },
        ]
       },
  
   // { path: 'mystores/updates', component: UpdateStoreComponent},// canActivate: [AuthGuard] },
    // later public stores components to create ! 
    //{ path: 'stores/:store', component:StoresMenuComponent, canActivate: [AnAuthGuard]},
    
        { path: 'stores', component: MyHomeComponent,  
          canActivate: [AuthGuard],
          canActivateChild: [AuthGuard],
          children: [
          
              //  { path: '', redirectTo: '', pathMatch: 'full' ,  canActivate:  [ AuthGuard ] },
                { path: '', component:  MenuStoresComponent,  canActivate:  [ AuthGuard ]},

            ]},
        
        { path: 'stores/:store', component: MyHomeComponent,  
          canActivate: [AuthGuard],
          canActivateChild: [AuthGuard],
          children: [
          
                { path: '', redirectTo: 'store', pathMatch: 'full' ,  canActivate:  [ AuthGuard ] },
                { path: 'store', component: StoreComponent,  canActivate:  [ AuthGuard ]},
                { path: 'soldout', component: SoldoutComponent,  canActivate: [AuthGuard], },
                { path: 'sales', component: SalesComponent, canActivate: [AuthGuard],/* canActivate: [ NgxPermissionsGuard ], 
                     data: {
                       permissions: {
                            only: "ADMINStore",
                            redirectTo : "../"
                         }
                         } */
                 },
                   
                 { path: 'monthincome', component: MonthIncomeComponent ,canActivate: [AuthGuard],/*  canActivate: [ NgxPermissionsGuard ], 
                     data: {
                       permissions: {
                            only: "ADMINStore",
                            redirectTo : "../"
                         }
                         } */
                 },
                
                { path: 'commands/:commandid', component: SaleCommandComponent,  canActivate:[AuthGuard], /*[ NgxPermissionsGuard ], 
                     data: {
                       permissions: {
                            only: "ADMINStore",
                            redirectTo : "../"
                         }
                         } */
                 },

                  
                
                { path: 'update', component: UpdateStoreComponent,  canActivate: [AuthGuard],/*canActivate: [ NgxPermissionsGuard ], 
                     data: {
                       permissions: {
                            only: "ADMINStore",
                            redirectTo : "../"
                         }
          
                         }*/
                },
                { path: 'newarticle', component: NewarticleComponent,  canActivate: [AuthGuard],/*[ NgxPermissionsGuard ], 
                     data: {
                       permissions: {
                            only: "ADMINStore",
                            redirectTo : "../"
                         }
          
                         } */
                },
                { path: 'details', component: StoreDetailsComponent,  canActivate: [AuthGuard], },
                { path: 'historic', component: HistoricSalesComponent,canActivate: [AuthGuard]/*  canActivate: [ NgxPermissionsGuard ], 
                     data: {
                       permissions: {
                            only: "ADMINStore",
                            redirectTo : "../"
                         }
          
                         } */
                },
  
      
                  { path : "articles/:article/update", component: UpArticleComponent,  canActivate: [AuthGuard]/*[ NgxPermissionsGuard ], 
                    data: {
                        permissions: {
                        only: "ADMINStore",
                        redirectTo : "../"
                        }
          
                    } */},
        
                    { path:  'articles/:article', component: ArticleComponent,  canActivate: [AuthGuard] }, 
        
                  { path : "articles/buynow/article", component: BuynowComponent,  canActivate: [AuthGuard], },
        
           
                    { path: '**', redirectTo: '' },
        ]},
    
        
        // otherwise redirect to home
     
      
       //]},   
    { path:'home', redirectTo:'' , pathMatch: 'full'},
    { path: '', component: HomeComponent, canActivate: [AnAuthGuard]},
    { path: 'login', component: HomeComponent, canActivate: [AnAuthGuard] },
   // { path: 'signin', component: SigninComponent, canActivate: [AnAuthGuard] },
    //{ path: 'validation/:userid', component: UserValidationComponent, canActivate: [AnAuthGuard] },
    //{ path: 'loginaccount', component: LoginAccountKitComponent, canActivate: [AnAuthGuard] },

       

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
    
    

    ];

//export const routing = RouterModule.forRoot(appRoutes);

