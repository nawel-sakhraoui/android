import { Routes, RouterModule } from '@angular/router';


import { HomeComponent } from './home/index';
import { LoginComponent } from './login/index';
import { SigninComponent } from './signin/index';
import { MainComponent } from './main/index';
import { ArticleComponent} from './article/index'; 
import { NewarticleComponent} from './newarticle/index'; 
import { UpArticleComponent} from './up-article/index'; 
import { BuynowComponent} from './buynow/index'; 
import { OngoingComponent} from './ongoing/index'; 
import { UserValidationComponent} from './user-validation/index';
import { SalesComponent } from './sales/index';
import { MessageComponent } from './message/index';
import { ListMessagesComponent } from './list-messages/index';
import { DoneComponent } from './done/index';
import { DeliveryComponent } from './delivery/index';
import { DeliveryDoneComponent } from './delivery-done/index';
import { DeliveryIncomeComponent } from './delivery-income/index';
import { WeeklyIncomeComponent } from './weekly-income/index';


import { SaleCommandComponent } from './sale-command/index';
import { PurchaseCommandComponent } from './purchase-command/index';
import { LoginAccountKitComponent } from './login-account-kit/index';

import { MonthIncomeComponent } from './month-income/index';

import { StoreDetailsComponent } from './store-details/index';

import {DeliveryListComponent}  from './delivery-list/index';

import {HistoricSalesComponent}  from './historic-sales/index';
import { StoreComponent } from './store/index';
import { ProfileComponent } from './profile/index';
import { CartComponent } from './cart/index';
import { MyHomeComponent } from './my-home/index';
import { CreatestoreComponent } from './createstore/index';
import { UpdateStoreComponent} from './update-store/index';
import { SoldoutComponent } from './soldout/index';
import {StoresMenuComponent} from './stores-menu/index'; 
import { DashbordComponent } from './dashbord/index';

import {AuthGuard, AnAuthGuard} from './_guards/index'; 

import { NgxPermissionsGuard } from 'ngx-permissions';

import { ResultComponent } from './result/index';
import { UsersManagerComponent } from './users-manager/index';
import { StoresManagerComponent } from './stores-manager/index';
import { ContactUsComponent } from './contact-us/index';

//import { ContactUsManagerComponent } from './contact-us-manager/index';

const appRoutes: Routes = [
        
   
   {path: 'dashbord', component: DashbordComponent, 
        
      canActivate: [AuthGuard],
      canActivateChild: [AuthGuard],
    
   children:[
  
    { path: '', redirectTo: 'usermanager', pathMatch: 'full'},
   { 
       path: 'usermanager', component: UsersManagerComponent,  
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
   /* { path: 'contactusmanager', component:ContactUsManagerComponent,  
            canActivate: [AuthGuard],
            canActivateChild: [AuthGuard],
    },*/
    
       { path: '**', redirectTo: '', pathMatch: 'full' }
    ]    
      },

    
    
    
    { path: '', component: MyHomeComponent, 
    
     
  
      children:[

       { path: 'dashbord', redirectTo: '/dashbord' , pathMatch: 'full'   },

       { path: 'dashbord/usermanager', redirectTo: '/dashbord/usermanager' , pathMatch: 'full'   },
       { path: 'dashbord/storemanager', redirectTo: '/dashbord/storemanager' , pathMatch: 'full'   },
       { path: 'dashbord/deliverymanager', redirectTo: '/dashbord/deliverymanager' , pathMatch: 'full'   },
       { path: 'dashbord/contactusmanager', redirectTo: '/dashbord/contactusmanager' , pathMatch: 'full'   },
        
       // { path: 'home', redirectTo: '/' , pathMatch: 'full'  }, 
     
      
      
        
        { path: 'result', component: ResultComponent},
    
        { path: 'contactus', component: ContactUsComponent },

        { path: 'home/:myhome/messages/tosend', component: MessageComponent,  canActivate: [ NgxPermissionsGuard ], 
          data: {
            permissions: {
                only: "ADMIN",
                redirectTo : "/home"
             }
          
         }},
        { path: 'home/:myhome/messages', component: ListMessagesComponent,  canActivate: [ NgxPermissionsGuard ], 
          data: {
            permissions: {
                only: "ADMIN",
                redirectTo : "/home"
             }
          
        }}, 
       
       
        { path: 'home/:myhome/cart', component: CartComponent,  canActivate: [ NgxPermissionsGuard ], 
          data: {
            permissions: {
                only: "ADMIN",
                redirectTo : "/home"
             }
          
        }},
        
        { path: 'home/:myhome/done', component: DoneComponent,  canActivate: [ NgxPermissionsGuard ], 
          data: {
            permissions: {
                only: "ADMIN",
                redirectTo : "/home"
             }
          
        }},
        { path: 'home/:myhome/purchase/:commandid', component: PurchaseCommandComponent,  canActivate: [ NgxPermissionsGuard ], 
          data: {
            permissions: {
                only: "ADMIN",
                redirectTo : "/home"
             }
          
        }},

        { path: 'home/:myhome/ongoing', component: OngoingComponent,  canActivate: [ NgxPermissionsGuard ], 
          data: {
            permissions: {
                only: "ADMIN",
                redirectTo : "/home"
             }
          
        }},
        
        { path: 'home/:myhome/createstore', component: CreatestoreComponent,  canActivate: [ NgxPermissionsGuard ], 
          data: {
            permissions: {
                only: "ADMIN",
                redirectTo : "/home"
             }
          
         }},

         { path: 'home/:myhome/profile/:userid', component: ProfileComponent,  canActivate: [AuthGuard] },

        
  
          //{ path: '', redirectTo: 'store', pathMatch: 'full' },//  canActivate:  [ AuthGuard ] },
          { path: 'stores/:store/store', component: StoreComponent},//  canActivate:  [ AuthGuard ]},
          
          { path: 'stores/:store/soldout', component: SoldoutComponent},//  canActivate: [AuthGuard], },
                
          { path: 'stores/:store/sales', component: SalesComponent,  canActivate: [ NgxPermissionsGuard ], 
                     data: {
                       permissions: {
                            only: "ADMINStore",
                            redirectTo : "../store"
                         }
                         } 
           },
                   
           { path: 'stores/:store/monthincome', component: MonthIncomeComponent ,  canActivate: [ NgxPermissionsGuard ], 
                     data: {
                       permissions: {
                            only: "ADMINStore",
                            redirectTo : "../store"
                         }
                         } 
            },
                
            { path: 'stores/:store/commands/:commandid', component: SaleCommandComponent,  canActivate: [ NgxPermissionsGuard ], 
                     data: {
                       permissions: {
                            only: "ADMINStore",
                            redirectTo : "../store"
                         }
                         } 
             },

   
             { path: 'stores/:store/update', component: UpdateStoreComponent,  canActivate: [ NgxPermissionsGuard ], 
                     data: {
                       permissions: {
                            only: "ADMINStore",
                            redirectTo : "../store"
                         }
          
                         }
             },
             { path: 'stores/:store/newarticle', component: NewarticleComponent,  canActivate: [ NgxPermissionsGuard ], 
                     data: {
                       permissions: {
                            only: "ADMINStore",
                            redirectTo : "../store"
                         }
          
                         } 
              },
              
              { path: 'stores/:store/details', component: StoreDetailsComponent},//  canActivate: [AuthGuard], },
                
              { path: 'stores/:store/historic', component: HistoricSalesComponent,  canActivate: [ NgxPermissionsGuard ], 
                     data: {
                       permissions: {
                            only: "ADMINStore",
                            redirectTo : "../store"
                         }
          
                         } 
               },
  
               { path : "stores/:store/articles/:article/update", component: UpArticleComponent,  canActivate: [ NgxPermissionsGuard ], 
                    data: {
                        permissions: {
                        only: "ADMINStore",
                        redirectTo : "../store"
                        }
          
                } },
        
                { path:  'stores/:store/articles/:article', component: ArticleComponent},//  canActivate: [AuthGuard], }, 
        
                { path : "stores/:store/articles/buynow/article", component: BuynowComponent,  canActivate: [AuthGuard], },
        
                { path: 'login', redirectTo: '/login' , pathMatch: 'full' },

                
                 { path: 'home/:myhome/delivery', component: DeliveryComponent,  canActivate: [ NgxPermissionsGuard ], 
                    data: {
                    permissions: {
                        only: "ADMIN",
                        redirectTo : "/home"
                    }
          
                 }},
                 
                   { path: 'home/:myhome/deliverydone', component: DeliveryDoneComponent,  canActivate: [ NgxPermissionsGuard ], 
                    data: {
                    permissions: {
                        only: "ADMIN",
                        redirectTo : "/home"
                    }
          
                 }},
                       { path: 'home/:myhome/deliveryincome', component: DeliveryIncomeComponent,  canActivate: [ NgxPermissionsGuard ], 
                    data: {
                    permissions: {
                        only: "ADMIN",
                        redirectTo : "/home"
                    }
          
                 }},
                           { path: 'home/:myhome/weeklyincome', component: WeeklyIncomeComponent,  canActivate: [ NgxPermissionsGuard ], 
                    data: {
                    permissions: {
                        only: "ADMIN",
                        redirectTo : "/home"
                    }
          
                 }},
           
                { path: '**', redirectTo: '/' , pathMatch: 'full' },
        ]},

    
    { path: 'login', component: HomeComponent, canActivate: [AnAuthGuard] },
   // { path: 'signin', component: SigninComponent, canActivate: [AnAuthGuard] },
   // { path: 'validation/:userid', component: UserValidationComponent, canActivate: [AnAuthGuard] },
    //{ path: 'loginaccount', component: LoginAccountKitComponent, canActivate: [AnAuthGuard] },

       
    
    // otherwise redirect to home
    { path: '**', redirectTo: '', pathMatch: 'full' }
    
    

    ];

export const routing = RouterModule.forRoot(appRoutes);

