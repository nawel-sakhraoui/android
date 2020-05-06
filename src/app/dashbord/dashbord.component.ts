import { Component, OnInit } from '@angular/core';
import { NgxPermissionsService, NgxRolesService } from 'ngx-permissions';  

@Component({
  selector: 'app-dashbord',
  templateUrl: './dashbord.component.html',
  styleUrls: ['./dashbord.component.css']
})
export class DashbordComponent implements OnInit {

 me :string ; 
  constructor(private permissionsService: NgxPermissionsService, 
                 private rolesService : NgxRolesService) { }

  ngOnInit() {
       this.me =  JSON.parse(localStorage.getItem('currentUser')).userid ; 

      if (this.me == "1820ad1b57ff06677e1044be32659c3c" ) {
                                 
                                    this.permissionsService.addPermission('writeSuperAdmin', () => {
                                          return true;
                                    });
                                     this.permissionsService.addPermission('readSuperAdmin', () => {
                                          return true;
                                    });
                                  
                                    this.rolesService.addRole('SUPERADMIN', ['readSuperAdmin','writeSuperAdmin' ]);
                                 
                             }
  }

}
