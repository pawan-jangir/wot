import { Component, OnInit } from '@angular/core';
import {RegisterService} from '../../services/register.service';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {CommonService} from '../../services/common.service';

@Component({
  selector: 'app-login-component',
  templateUrl: './login-component.component.html',
  styleUrls: ['./login-component.component.css']
})
export class LoginComponentComponent implements OnInit {

  public websiteDataLocal:any={}
  public otp:any = ''
  public loginData:any = {
    email : '',
    password : '',
    remember : '',
  }
  public showLoading = false
  constructor(
    private register: RegisterService,
    private auth: AuthService,
    private router: Router,
    private commonService: CommonService,
    private toastr: ToastrService
    ) {
      if(this.auth.isLoggedIn){
        this.router.navigateByUrl('/user-profile');
      }
     
  }
  
  public isLoading:Boolean = false;
  
  ngOnInit(): void {
 
  }

  login(){
    let elementRefList = [];
    let errors = false;

    
    let emailNote:any = document.querySelector('#email');
    if(!this.loginData.email.trim()) {
      errors = true;
      elementRefList.push(document.querySelector("#email"));
    } 
    else if(emailNote.parentElement.classList.contains('error')) {
      errors = true;
    }
    else {
      this.commonService.parentHasClassError(document.querySelector("#email"), 'error')
    }
    let passwordNote:any = document.querySelector('#password');
    if(!this.loginData.password) {
      errors = true;
      elementRefList.push(document.querySelector("#password"));
    }
    else if(passwordNote.parentElement.classList.contains('error')) {
      errors = true;
    }
     else {
      this.commonService.parentHasClassError(document.querySelector("#password"), 'error')
    }
    
    if(errors) {
      elementRefList.forEach(v => {
        this.commonService.addDomElement(v, 'error', 'errorMsg', "This field is required");
      })
      return false;
    } else {
      this.showLoading = true;
      this.auth.login(this.loginData).subscribe((res) => {
        if(res.success==true){
          this.toastr.success(res.message);
          this.router.navigateByUrl('/dashboard');
        }else{
          this.toastr.error(res.message);
        }
        this.showLoading = false;
       
      },
      (error) => {
        this.toastr.error(error);
        this.showLoading = false;
      }
      )
    }

  }
  // submitOTP(){
  //   if(this.otp == ''){
  //     this.toastr.error('Please enter otp', '');
  //     return false;
  //   }
  //   let datas = {
  //     otp : this.otp,
  //     mobile_number : this.mobile,
  //   }
  //   this.register.verifyOTP(datas).subscribe((data)=>{
  //     this.otpScreen = false;
  //     this.router.navigate(['/']);
  //   });
  // }

}
