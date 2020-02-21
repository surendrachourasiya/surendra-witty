import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isSubmitted = false;
  authFails = false;
  constructor(private authService: AuthService, private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get formControls() {
    return this.loginForm.controls;
  }

  login() {
    this.isSubmitted = true;
    if (this.loginForm.invalid) {
      this.authFails = false;
      return;
    }
    this.authService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe(data => {
      if (data.status == 200 && data.data._id != '' && data.data._id != undefined) {
        this.authFails = false;
        localStorage.setItem('isLogin', JSON.stringify('true'));
        localStorage.setItem('userdata', JSON.stringify(data.data));
        if(data.data.roleId == 1){
          this.router.navigateByUrl('/dashboard/content');
        } else if(data.data.roleId == 2){
          this.router.navigateByUrl('/dashboard/review-publish');
        } else if(data.data.roleId == 3){
          this.router.navigateByUrl('/dashboard/content');
        } else if (data.data.roleId == 4) {
          this.router.navigateByUrl('/dashboard/videos');
        }        
      } else {
        this.authFails = true;
        this.router.navigateByUrl('/login');
      }
    });
  }
}
