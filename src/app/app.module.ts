import { NgModule }      from '@angular/core';

//import { registerLocaleData } from '@angular/common';
//import {localeFr} from '@angular/common/locales/fr';
//import {localeFrExtra} from '@angular/common/locales/extra/fr';

import { BrowserModule, Title } from '@angular/platform-browser';
import { AppComponent }  from './app.component';

/*import { FormsModule }    from '@angular/forms';
import { StarRatingModule } from 'angular-star-rating';
import { MzModalService } from 'ng2-materialize';
import { FormWizardModule } from 'angular2-wizard';
//import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { HttpClientModule, HTTP_INTERCEPTORS  } from '@angular/common/http';
import { routing }        from './app.routing';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
//import {BusyModule} from 'angular2-busy';
import { NgxClickToEditModule } from 'ngx-click-to-edit';
import { ArchwizardModule } from 'ng2-archwizard';
import { TextMaskModule } from 'angular2-text-mask'; 
import { BootstrapModalModule } from 'ng2-bootstrap-modal';
import { RouterModule, Routes } from '@angular/router';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { NgxAutoScrollModule} from "ngx-auto-scroll";
import { NgxPermissionsModule } from 'ngx-permissions';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { SidebarModule } from 'ng-sidebar';
import { NgxPaginationModule} from 'ngx-pagination';
import { NgxLoadingModule } from 'ngx-loading';
import {TooltipModule} from 'ng2-tooltip-directive';

import {NgxImageCompressService} from 'ngx-image-compress';

import { ImageCropperModule } from 'ngx-image-cropper';


import {JwtHttpInterceptor,AuthService, ContactusService,  PicService, FirebaseService, DeliveryService, AddressService,  RatingModalService, MessagesService, OngoingService, AuthenticationService, UserService, StoreService, MyhomeService , SearchService, CartService, BuynowService, UserdetailsService} from './_services/index';


import { EqualValidatorDirective } from './directives/equal-validator.directive';
import { ExistEmailValidatorDirective } from './directives/exist-email-validator.directive';

import { AuthGuard,AnAuthGuard} from './_guards/index';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/index';
import { SigninComponent } from './signin/index';
import { RegistrationDetailsComponent } from './registration-details/registration-details.component';
import { StoreComponent } from './store/index';
import { ProfileComponent } from './profile/profile.component';
import { MenuComponent } from './menu/menu.component';
import { CartComponent } from './cart/cart.component';
import { MyHomeComponent } from './my-home/my-home.component';
import { SearchComponent } from './search/search.component';
import { CreatestoreComponent } from './createstore/createstore.component';
import { ArticleComponent } from './article/article.component';
import { ModalComponent } from './article/modal.component';
import {ModalhomeComponent  } from './home/modalhome.component';
import { RatingModalComponent } from './ongoing/rating-modal.component';
import { StopModalComponent } from   './ongoing/stop-modal.component';
import { StopModal2Component } from   './purchase-command/stop-modal2.component';


import { RatingModal2Component } from './purchase-command/rating-modal2.component';
import { NgxCheckboxModule } from 'ngx-checkbox';


import { WizardComponent } from './wizard/wizard.component';
import { WizardStepComponent } from './wizard/wizard-step.component';
import { NewarticleComponent } from './newarticle/newarticle.component';
import { UploadImgComponent } from './upload-img/upload-img.component';
import { UpArticleComponent } from './up-article/up-article.component';
import { UpdateStoreComponent } from './update-store/update-store.component';
import { SoldoutComponent } from './soldout/soldout.component';
import { StoresMenuComponent } from './stores-menu/stores-menu.component';
import { MainComponent } from './main/main.component';
import { BuynowComponent } from './buynow/buynow.component';
import { OngoingComponent } from './ongoing/ongoing.component';
import { SalesComponent } from './sales/sales.component';
import { UserValidationComponent } from './user-validation/user-validation.component';
import { ListMessagesComponent } from './list-messages/list-messages.component';
import { MessageComponent } from './message/message.component';
import { StoreDetailsComponent } from './store-details/store-details.component';
import { DoneComponent } from './done/done.component';
import { HistoricSalesComponent } from './historic-sales/historic-sales.component';
import { SaleCommandComponent } from './sale-command/sale-command.component';
import { PurchaseCommandComponent } from './purchase-command/purchase-command.component'; // <-- import the module
import { LoginAccountKitComponent } from './login-account-kit/login-account-kit.component';
import { ResultComponent } from './result/result.component';
import { UsersManagerComponent } from './users-manager/users-manager.component';
import {ScrollToModule} from 'ng2-scroll-to';

import { ShareButtonModule } from '@ngx-share/button';
import { AdressComponent } from './adress/adress.component';
//import { DeliveryComponent } from './delivery/delivery.component';
import { DeliveryListComponent } from './delivery-list/delivery-list.component';
import { DeliveryComponent } from './delivery/delivery.component';

import { AutoGeneratedComponent } from './auto-generated/auto-generated.component';
import { DashbordComponent } from './dashbord/dashbord.component';
import { StoresManagerComponent } from './stores-manager/stores-manager.component';
import { MonthIncomeComponent } from './month-income/month-income.component';
//import { NewDeliveryComponent } from './new-delivery/new-delivery.component';
import { NgxPicaModule } from 'ngx-pica';
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { DeliveryDoneComponent } from './delivery-done/delivery-done.component';
import { WeeklyIncomeComponent } from './weekly-income/weekly-income.component';
import { DeliveryIncomeComponent } from './delivery-income/delivery-income.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { ContactUsManagerComponent } from './contact-us-manager/contact-us-manager.component';


 const config = {
      apiKey: "AIzaSyBgeiMFnB9_2ZPvHim-jZjeu7hx4QeoO9I",
  authDomain: "simsim-87cd3.firebaseapp.com",
  databaseURL: "https://simsim-87cd3.firebaseio.com",
  projectId: "simsim-87cd3",
  storageBucket: "simsim-87cd3.appspot.com",
  messagingSenderId: "235480983456",
  appId: "1:235480983456:web:30ed719315877a688466c5",
  measurementId: "G-4D9Z4XEVGB"

    };
   



export function tokenGetter() {
  console.log(localStorage.getItem('currentUser'));
  return localStorage.getItem('currentUser');
    
};


export function jwtOptionsFactory(userService) {
    return {
        tokenGetter: () => {
            return userService.getToken();
        },
        whitelistedDomains: [  'localhost:4200', 'http://192.168.1.16:4200', 'frontngx.ddns.net','http://192.168.1.16:3000', 'http://192.168.1.16:4000' , 'localhost:3000', 'localhost:4000', 'http://backendapi.ddns.net:3000:' ,'http://backendapi.ddns.net:4000' ],
        blacklistedRoutes: [ 'localhost:8080/login']//, 'http://192.168.1.16:4200/home', 'frontngx.ddns.net/home']
     
    }
}*/
//import {getTranslationProviders ,loadTranslationFile} from "./i18n-providers";
@NgModule({
    imports: [
  /*      RouterModule,
        NgxAutoScrollModule, 
        BrowserAnimationsModule,
       // BusyModule,
        SelectDropDownModule,
        BrowserModule,
        FormsModule,
        routing,  
        HttpClientModule,
        TextMaskModule, 
        StarRatingModule.forRoot(), 
        NgxPaginationModule,  
        SidebarModule.forRoot(),
        BootstrapModalModule.forRoot({container:document.body}),
        NgxClickToEditModule.forRoot(),
        NgxLoadingModule.forRoot({}),
        ImageCropperModule, 
        ScrollToModule.forRoot(),
        TooltipModule,
       /* JwtModule.forRoot({
            jwtOptionsProvider: {
                provide: JWT_OPTIONS,
                useFactory: jwtOptionsFactory,
                deps: [UserService]
            }
            
        }),*/
     /*  DeviceDetectorModule.forRoot(),
        NgxPermissionsModule.forRoot(), 
        NgxCheckboxModule,
         ShareButtonModule,
         NgxPicaModule,
         AngularFireModule.initializeApp(config),
         AngularFireAuthModule*/
      
    ],
         
   declarations: [
     
  //AppComponent,
  /*HomeComponent,
  SigninComponent,
  EqualValidatorDirective,
  RegistrationDetailsComponent,
  LoginComponent,
  ExistEmailValidatorDirective,
  StoreComponent,
  ProfileComponent,
  MenuComponent,
  CartComponent,
  MyHomeComponent,
  SearchComponent,
  CreatestoreComponent,
  ArticleComponent,
  NewarticleComponent,
  UploadImgComponent,
  UpArticleComponent,
  UpdateStoreComponent,
  SoldoutComponent,
  StoresMenuComponent,
  MainComponent,
  ModalComponent,
  BuynowComponent,
  OngoingComponent,
  SalesComponent,
  UserValidationComponent,
  WizardStepComponent,
  WizardComponent,
  ListMessagesComponent,
  MessageComponent,
  RatingModalComponent,
  StopModalComponent, 
   StopModal2Component, 
  StoreDetailsComponent,
  DoneComponent,
  HistoricSalesComponent,
  SaleCommandComponent,
  PurchaseCommandComponent,
  LoginAccountKitComponent,
   RatingModal2Component,
   ResultComponent,
   UsersManagerComponent,
   AdressComponent,
  DeliveryComponent,
   DeliveryListComponent,
  AutoGeneratedComponent,
  DashbordComponent,
  StoresManagerComponent,
  MonthIncomeComponent,
   ModalhomeComponent,
   DeliveryDoneComponent,
   WeeklyIncomeComponent,
   DeliveryIncomeComponent,
   ContactUsComponent,
   ContactUsManagerComponent, */
 //  NewDeliveryComponent
   
  ],
    
   providers: [
   //  getTranslationProviders ,loadTranslationFile,
/*
    { provide: HTTP_INTERCEPTORS, useClass: JwtHttpInterceptor, multi: true }, 
     
       AuthGuard,
        AnAuthGuard,
        AuthenticationService,
        UserService,
        StoreService, 
        MyhomeService, 
        SearchService,
        CartService,
        OngoingService,
        MessagesService, 
        UserdetailsService, 
        RatingModalService,
	    AddressService,
	    DeliveryService,
        FirebaseService,
        PicService,
        AuthService,
        NgxImageCompressService, 
        ContactusService*/
      
    ],
  
    bootstrap: [AppComponent]

})

export class AppModule { }

