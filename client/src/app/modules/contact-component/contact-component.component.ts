import { Component, OnInit } from '@angular/core';
import {RegisterService} from '../../services/register.service';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DefaultService } from 'src/app/services/default.service';
import { CommonService } from 'src/app/services/common.service';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-contact-component',
  templateUrl: './contact-component.component.html',
  styleUrls: ['./contact-component.component.css']
})
export class ContactComponentComponent implements OnInit {

  public websiteDataLocal:any='contact-us'
  public content:any = {}
  public feedback:any = {
    full_name : '',
    email : '',
    mobile_number : '',
    company_name : '',
  }
  public courseImgPath:any = ''
  public showLoading = false
  constructor(
    private register: RegisterService,
    private auth: AuthService,
    private router: Router,
    private DefaultService: DefaultService,
    private commonService: CommonService,
    private toastr: ToastrService
    ) {
     
     
  }
  
  public isLoading:Boolean = false;
  
  ngOnInit(): void {
    // this.DefaultService.getSettingContent().subscribe((data)=>{
    //   if(data && data.success){
    //     this.content = data.data;
    //   }else{
    //     this.content = {};
    //   }
    // });
  }

  submitFeddback(){
    let elementRefList = [];
    let errors = false;
    this.feedback.full_name = this.commonService.stripScripts(this.feedback.full_name);
    this.feedback.email = this.commonService.stripScripts(this.feedback.email);
   
    let name:any = document.querySelector('#full_name');

    if(!this.feedback.full_name.trim()) {
      errors = true;
      elementRefList.push(document.querySelector("#full_name"));
    } 
    else if(name.parentElement.classList.contains('error')) {
      errors = true;
    }
    else {
      this.commonService.parentHasClassError(document.querySelector("#full_name"), 'error')
    }

   
    let emailNote:any = document.querySelector('#email');
    if(!this.feedback.email.trim()) {
      errors = true;
      elementRefList.push(document.querySelector("#email"));
    } 
    else if(emailNote.parentElement.classList.contains('error')) {
      errors = true;
    }
    else {
      this.commonService.parentHasClassError(document.querySelector("#email"), 'error')
    }

    let phoneNumberNote:any = document.querySelector('#mobile_number');
    if(!this.feedback.mobile_number) {
      errors = true;
      elementRefList.push(document.querySelector("#mobile_number"));
    }
    else if(phoneNumberNote.parentElement.classList.contains('error')) {
      errors = true;
    }
     else {
      this.commonService.parentHasClassError(document.querySelector("#mobile_number"), 'error')
      
    }

    if(!this.feedback.company_name.trim()) {
      errors = true;
      elementRefList.push(document.querySelector("#company_name"));
    } 
    else if(name.parentElement.classList.contains('error')) {
      errors = true;
    }
    else {
      this.commonService.parentHasClassError(document.querySelector("#company_name"), 'error')
    }
    
    if(errors) {
      elementRefList.forEach(v => {
        this.commonService.addDomElement(v, 'error', 'errorMsg', "This field is required");
      })
      return false;
    } else {
      this.showLoading = true;
      this.DefaultService.contactEnquiry(this.feedback).subscribe((res) => {
        this.showLoading = false;
        this.feedback = {
          full_name : '',
          email : '',
          mobile_number : '',
          company_name : '',
        }
        this.toastr.success(res.message);
      },
      (error) => {
        console.log(error)
        this.toastr.error(error);
        this.showLoading = false;
      }
      )
    }
  }

}
