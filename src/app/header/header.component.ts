import { Component, OnInit } from '@angular/core';
import { AuthService } from '../login/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService) { }

  roleId = 0;
  userData = { "_id": "", "email": "", "roleId": 0, "firstName": "", "lastName": "", "lastLogin": "" };

  ngOnInit() {
    var retrievedObject = localStorage.getItem('userdata');
    this.userData = JSON.parse(retrievedObject);
    this.roleId = this.userData.roleId;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
