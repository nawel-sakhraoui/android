import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptModule } from 'nativescript-angular/nativescript.module';
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS  } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { MaskedTextFieldModule } from "nativescript-masked-text-field/angular";

// Uncomment and add to NgModule imports if you need to use two-way binding
// import { NativeScriptFormsModule } from 'nativescript-angular/forms';

// Uncomment and add to NgModule imports  if you need to use the HTTP wrapper

import {  PicService, RatingModalService, OngoingService, JwtHttpInterceptor,
          AuthenticationService, UserService,UserdetailsService, 
          AddressService, StoreService, MessagesService, SearchService, 
          BuynowService, CartService, MyhomeService, DeliveryService} from './_services/index';

import { NativeScriptHttpClientModule } from 'nativescript-angular/http-client';
import { MyHomeComponent } from './my-home/my-home.component';
import { MenuComponent } from './menu/menu.component';
//import { SocketIOModule } from "nativescript-socketio/angular";
//import { DropDownModule } from "nativescript-drop-down/angular";


import { AuthGuard,AnAuthGuard} from './_guards/index';
import {NgxPermissionsModule} from 'ngx-permissions';
import { ProfileComponent } from './profile/profile.component';
import { ListMessagesComponent } from './list-messages/list-messages.component';
import { MainComponent } from './main/main.component';
import { CartComponent } from './cart/cart.component';
import { MenuStoresComponent } from './menu-stores/menu-stores.component';
import { MenuTransactionsComponent } from './menu-transactions/menu-transactions.component';
import { MenuNotificationsComponent } from './menu-notifications/menu-notifications.component';
//import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular"
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";
import { NativeScriptUISideDrawerModule } from "nativescript-ui-sidedrawer/angular";
import { DropDownModule } from "nativescript-drop-down/angular";
import { StoreComponent } from './store/store.component';
import { CreatestoreComponent } from './createstore/createstore.component';
//import { AccordionModule } from "nativescript-accordion/angular";

import { TNSCheckBoxModule } from '@nstudio/nativescript-checkbox/angular'; 

import { registerElement } from 'nativescript-angular/element-registry';
// Register Custom Elements for Angular
import { Carousel, CarouselItem } from 'nativescript-carousel';
import { ArticleComponent } from './article/article.component';
import {ModalComponent } from './article/modal.component';

import { ResultComponent } from './result/result.component';
import { NewarticleComponent } from './newarticle/newarticle.component';
import { StoreDetailsComponent } from './store-details/store-details.component';
import { StoresManagerComponent } from './stores-manager/stores-manager.component';
import { SoldoutComponent } from './soldout/soldout.component';
import { SalesComponent } from './sales/sales.component';
import { UpdateStoreComponent } from './update-store/update-store.component';
import { HistoricSalesComponent } from './historic-sales/historic-sales.component';
import { MonthIncomeComponent } from './month-income/month-income.component';
import { OngoingComponent } from './ongoing/ongoing.component';
import { StopModalComponent} from './ongoing/stop-modal.component';
import { RatingModalComponent} from './ongoing/rating-modal.component';

import { DoneComponent } from './done/done.component';

import { ModalDialogService } from "nativescript-angular/modal-dialog";
import { MessageComponent } from './message/message.component';
import { AdressComponent } from './adress/adress.component';
import { UpArticleComponent } from './up-article/up-article.component';
import { BuynowComponent } from './buynow/buynow.component';
import { PurchaseCommandComponent } from './purchase-command/purchase-command.component'; 
import { StopModal2Component} from './purchase-command/stop-modal2.component';
import { RatingModal2Component} from './purchase-command/rating-modal2.component';
import { SaleCommandComponent } from './sale-command/sale-command.component';
import { StoreMenuComponent } from './store-menu/store-menu.component';
import { Resolver} from './resolver'; 
import { NativeScriptHttpModule } from "nativescript-angular/http";


//import {StarRating} from './nativescript-star-ratings/star-ratings.android';
import {ConfigService} from './_services/api-config.service'; 


registerElement('Carousel', () => Carousel);
registerElement('CarouselItem', () => CarouselItem);
//registerElement('StarRating', () => require('nativescript-star-ratings').StarRating);

import { SocketIOModule } from "nativescript-socketio/angular";
import { MenuBottomComponent } from './menu-bottom/menu-bottom.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MyHomeComponent,
    MenuComponent,
    ProfileComponent,
    ListMessagesComponent,
    MainComponent,
    CartComponent,
    MenuStoresComponent,
    MenuTransactionsComponent,
    MenuNotificationsComponent,
    StoreComponent,
    CreatestoreComponent,
    ArticleComponent,
    ResultComponent,
    NewarticleComponent,
    StoreDetailsComponent,
    StoresManagerComponent,
    SoldoutComponent,
    SalesComponent,
    UpdateStoreComponent,
    HistoricSalesComponent,
    MonthIncomeComponent,
    OngoingComponent,
    DoneComponent,
    StopModalComponent, 
    RatingModalComponent, MessageComponent, AdressComponent, UpArticleComponent,
    ModalComponent,
    BuynowComponent,
    PurchaseCommandComponent,
    StopModal2Component,
      RatingModal2Component,
      SaleCommandComponent,
      StoreMenuComponent,
      MenuBottomComponent,
  
  ],
     entryComponents: [
     
         StopModalComponent,
         RatingModalComponent,
           StopModal2Component,
         RatingModal2Component,
         ModalComponent
      ],
  imports: [
    NativeScriptFormsModule ,
    NativeScriptModule,
    AppRoutingModule,
    NativeScriptHttpClientModule,
    HttpClientModule,
    MaskedTextFieldModule,
    //SocketIOModule.forRoot(),
    NgxPermissionsModule.forRoot(), 
    NativeScriptUISideDrawerModule,
    DropDownModule,
    // NativeScriptUIListViewModule 
    NativeScriptUIListViewModule,
    //  NativeScriptUISideDrawerModule 
    //  AccordionModule 
    TNSCheckBoxModule , 
    //  StarRating
    NativeScriptHttpModule,
    SocketIOModule.forRoot(ConfigService.storeServer),
  ],
    providers: [
   //  getTranslationProviders ,loadTranslationFile,
    Resolver, 
   { provide: HTTP_INTERCEPTORS, useClass: JwtHttpInterceptor, multi: true }, 
             
        OngoingService,   
        AuthGuard,
        AnAuthGuard,
        UserService,
        UserdetailsService, 
        AuthenticationService,
         AddressService, 
         StoreService,
          MessagesService,
          BuynowService, 
          CartService,
          SearchService,
          MyhomeService, 
          DeliveryService,
          RatingModalService, 
          ModalDialogService, 
          PicService
    ],

  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule { }
