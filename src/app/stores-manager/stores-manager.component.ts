import { Component, OnInit } from '@angular/core';
import {StoreService, UserdetailsService} from '../_services/index';

@Component({
    selector: 'stores-manager',
    templateUrl: './stores-manager.component.html',
    styleUrls: ['./stores-manager.component.css']
})
export class StoresManagerComponent implements OnInit {

    constructor(private storeService: StoreService,
        private userdetailsService: UserdetailsService) {


    }
    storetitle;
    count;
    store: any = {};
    fullname = {};
    editStatus = {};
    tempOpen={};
    page = 1;
    size = 10;
    loading = false;
    stores:any=[]  ;
    tempStores = [];
    //get all store or search by store name 
    me = JSON.parse(localStorage.getItem('currentUser')).userid;

    ngOnInit() {
        this.storeService.getStoresCount()
            .subscribe(
            data => {
                console.log(data);
                this.count = data['count'];
            }, error => {
                console.log(error);

            });
                        this.getPage(1) ; 

    }

    getStore(event) {
        this.storeService.getStoresManager(this.storetitle)
            .subscribe(
            data => {
                console.log(data);
                this.store = data;
                this.store.created = new Date(this.store.created).toLocaleDateString();

                //creator+ admin fullname 
                this.userdetailsService.getFullname(this.store.userid)
                    .subscribe(
                    data => {
                        this.store.userfullname = data['fullname'];
                    }, error => {
                        console.log(error);
                    }
                    )
                if (!this.store.hasOwnProperty("administrators"))
                    this.store.administrators = [];

                this.stores = [ {"_source":this.store, '_id':this.storetitle} ] ; 

            }, error => {
                console.log(error);

            })
    }



    getPage(page) {
        ///     get from to size blabla 
        this.page = page;
        this.loading = true;
        this.storeService.getAllStores((page - 1) * this.size, this.size)
           .subscribe(

            data => {
                console.log( data['hits']['hits']);
                this.stores = data['hits']['hits'];
                
                
                for (let i = 0; i < this.stores.length ; i++) {

                     this.editStatus[this.stores[i]._id] = false ; 
                    
                    this.stores[i]._source.created = new Date(this.stores[i]._source.created).toLocaleDateString();

                    //creator+ admin fullname 
                    this.userdetailsService.getFullname(this.stores[i]._source.userid)
                        .subscribe(
                        data => {
                            this.stores[i]._source.userfullname = data['fullname'];
                        }, error => {
                            console.log(error);
                        }
                        )
                    if (!this.stores[i]._source.hasOwnProperty("administrators"))
                        this.stores[i]._source.administrators = [];

                            this.loading = false;
                    
                    }
                

            }, error => {
                console.log(error);
                this.loading = false;
            });
    }


    
    editingStatus(store) {
        this.editStatus[store._id] = true;
        this.tempOpen[store._id]  = store._source.suspend;
    }
    removeStatus(store) {
        this.editStatus[store._id] = false;
        store._source.suspend = this.tempOpen[store._id] ; 

    }

    saveStatus(store) {

        //save store and articles in store  status 
        this.storeService.putSuspendArticles(store._id, store._source.suspend)
            .subscribe(
            data => {
                console.log(data);
                this.editStatus[store._id] = false;
            }, error => {
                console.log(error);
            });
        this.storeService.putSuspend(store._id, store._source.suspend)
            .subscribe(
            data => {
                console.log(data);
                this.editStatus = false;
            }, error => {
                console.log(error);
            });

    }

}
