import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { MyHomeComponent } from './my-home/my-home.component';
import { MenuComponent } from './menu/menu.component';

import { AuthGuard,AnAuthGuard} from './_guards/index';
import { ProfileComponent } from './profile/profile.component';
import { ListMessagesComponent } from './list-messages/list-messages.component';
import { MainComponent } from './main/main.component';
import { CartComponent } from './cart/cart.component';
import { MenuStoresComponent } from './menu-stores/menu-stores.component';
import { MenuTransactionsComponent } from './menu-transactions/menu-transactions.component';
import { MenuNotificationsComponent } from './menu-notifications/menu-notifications.component';
import { StoreComponent } from './store/store.component';
import { CreatestoreComponent } from './createstore/createstore.component';
import { ArticleComponent } from './article/article.component';
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
import { DoneComponent } from './done/done.component';
import { MessageComponent } from './message/message.component';
import { AdressComponent } from './adress/adress.component';
import { UpArticleComponent } from './up-article/up-article.component';
import { BuynowComponent } from './buynow/buynow.component';
import { PurchaseCommandComponent } from './purchase-command/purchase-command.component';
import { SaleCommandComponent } from './sale-command/sale-command.component';
import { StoreMenuComponent } from './store-menu/store-menu.component';



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
    MessageComponent,
    AdressComponent,
    UpArticleComponent,
    BuynowComponent,
    PurchaseCommandComponent,
    SaleCommandComponent,
    StoreMenuComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
