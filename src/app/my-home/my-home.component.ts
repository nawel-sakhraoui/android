import { Component, OnInit } from '@angular/core';


@Component({
        moduleId: module.id,

  selector: 'app-my-home',
  templateUrl: './my-home.component.html',
  styleUrls: ['./my-home.component.css']
})
export class MyHomeComponent implements OnInit {

  constructor( ) { }

    connection :any ; 
   noConnexion = false ; 
  ngOnInit() {

      
  }

}
