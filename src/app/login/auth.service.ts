import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) { }

  public login(email, password) {
    return this.http.post<any>(environment.baseUrl + `auth/cmsLogin`, { email, password });
  }

  public isLoggedIn() {
    return JSON.parse(localStorage.getItem('isLogin'));
  }

  public logout() {
    localStorage.removeItem('isLogin');
    localStorage.removeItem('userdata');
    this.router.navigate(['/login']);
  }
}
