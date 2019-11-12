import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu-transactions',
  templateUrl: './menu-transactions.component.html',
  styleUrls: ['./menu-transactions.component.css']
})
export class MenuTransactionsComponent implements OnInit {

   me= JSON.parse(localStorage.getItem('currentUser')).userid ; 

  constructor() { }

  ngOnInit() {
  }

}
