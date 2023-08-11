import { Component, OnInit,Renderer2 ,Inject,ElementRef } from '@angular/core';
import { Guid } from 'guid-typescript';
import {RegisterService} from '../../services/register.service';
import {CommonService} from '../../services/common.service';
import {AuthService} from '../../services/auth.service';
import {environment} from '../../../environments/environment';
import {Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DOCUMENT } from '@angular/common';
import $ from "jquery";

@Component({
  selector: 'app-add-rm',
  templateUrl: './add-rm.component.html',
  styleUrls: ['./add-rm.component.css']
})
export class AddRmComponent implements OnInit {
  public showLoading = false
  public payloadData:any={
    first_name : '',
    last_name : '',
    mobile : '',
    alternate_mobile : '',
    email : '',
    address : '',
    state : '',
    city : '',
    pin_code : '',
  }
  constructor(
    private _renderer2: Renderer2, 
    @Inject(DOCUMENT) private _document: Document,
    private elementRef:ElementRef,
    private register: RegisterService,
    private auth: AuthService,
    private commonService: CommonService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    
  }

  addRM(){
    let elementRefList = [];
    let errors = false;
    this.payloadData.first_name = this.commonService.stripScripts(this.payloadData.first_name);
    this.payloadData.last_name = this.commonService.stripScripts(this.payloadData.last_name);
    this.payloadData.mobile = this.commonService.stripScripts(this.payloadData.mobile);
    this.payloadData.alternate_mobile = this.commonService.stripScripts(this.payloadData.alternate_mobile);
    this.payloadData.email = this.commonService.stripScripts(this.payloadData.email);
    this.payloadData.address = this.commonService.stripScripts(this.payloadData.address);
    this.payloadData.city = this.commonService.stripScripts(this.payloadData.city);
    this.payloadData.pin_code = this.commonService.stripScripts(this.payloadData.pin_code);
    this.payloadData.state = this.commonService.stripScripts(document.querySelector<HTMLInputElement>('#state')!.value);
    
   
    let first_name:any = document.querySelector('#first_name');
    if(!this.payloadData.first_name.trim()) {
      errors = true;
      elementRefList.push(document.querySelector("#first_name"));
    } 
    else if(first_name.parentElement.classList.contains('error')) {
      errors = true;
    }
    else {
      this.commonService.parentHasClassError(document.querySelector("#first_name"), 'error')
    }

    let last_name:any = document.querySelector('#last_name');
    if(!this.payloadData.last_name.trim()) {
      errors = true;
      elementRefList.push(document.querySelector("#last_name"));
    } 
    else if(last_name.parentElement.classList.contains('error')) {
      errors = true;
    }
    else {
      this.commonService.parentHasClassError(document.querySelector("#last_name"), 'error')
    }

    let mobile:any = document.querySelector('#mobile');
    if(!this.payloadData.mobile.trim()) {
      errors = true;
      elementRefList.push(document.querySelector("#mobile"));
    } 
    else if(mobile.parentElement.classList.contains('error')) {
      errors = true;
    }
    else {
      this.commonService.parentHasClassError(document.querySelector("#mobile"), 'error')
    }

    let email:any = document.querySelector('#email');
    if(!this.payloadData.email.trim()) {
      errors = true;
      elementRefList.push(document.querySelector("#email"));
    } 
    else if(email.parentElement.classList.contains('error')) {
      errors = true;
    }
    else {
      this.commonService.parentHasClassError(document.querySelector("#email"), 'error')
    }

    let address:any = document.querySelector('#address');
    if(!this.payloadData.address.trim()) {
      errors = true;
      elementRefList.push(document.querySelector("#address"));
    } 
    else if(address.parentElement.classList.contains('error')) {
      errors = true;
    }
    else {
      this.commonService.parentHasClassError(document.querySelector("#address"), 'error')
    }

    let city:any = document.querySelector('#city');
    if(!this.payloadData.city.trim()) {
      errors = true;
      elementRefList.push(document.querySelector("#city"));
    } 
    else if(city.parentElement.classList.contains('error')) {
      errors = true;
    }
    else {
      this.commonService.parentHasClassError(document.querySelector("#city"), 'error')
    }

    if(!this.payloadData.state) {
      errors = true;
      elementRefList.push(document.querySelector("#state"));
    }
     else {
      this.commonService.parentHasClassError(document.querySelector("#state"), 'error')
    }

    let pin_code:any = document.querySelector('#pin_code');
    if(!this.payloadData.pin_code.trim()) {
      errors = true;
      elementRefList.push(document.querySelector("#pin_code"));
    } 
    else if(pin_code.parentElement.classList.contains('error')) {
      errors = true;
    }
    else {
      this.commonService.parentHasClassError(document.querySelector("#pin_code"), 'error')
    }
    
    
    if(errors) {
      elementRefList.forEach(v => {
        this.commonService.addDomElement(v, 'error', 'errorMsg', "This field is required");
      })
      return false;
    } else {
      this.showLoading = true;
      this.auth.addRM(this.payloadData).subscribe((res) => {
        this.showLoading = false;
        if(res.success === true){
          this.toastr.success(res.message);
          this.router.navigateByUrl('/list_rm.html');
        }else{
          this.toastr.error(res.message);
        }
      },
      (error) => {
        //this.router.navigateByUrl('/dashboard');
        console.log(error)
        //this.toastr.error(error);
        this.showLoading = false;
      }
      )
    }
    
  }

}
