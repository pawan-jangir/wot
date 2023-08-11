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
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public formCurrentStep:Number = 1;
  public apiToken = "";
  public websiteDataLocal:any="register"
  public collegeName = environment.collegeName;
  public signUpdata={
    name : '',
    mobile : '',
    email : '',
    business_name : '',
    password : '',
    confirm_password : '',
    pin_code : '',
    address : '',
    entity_type : '',
    state : '',
    ImpExp : '',
    business_pan : '',
    business_pan_document : '',
    formCurrentStep : 1,
    phoneVerified : false,
    emailVerified : false,
  }
  public signUpdataStepTwo:any={
    business_gstin : '',
    business_gstin_document : '',
    business_cin : '',
    business_iec : '',
    business_ice_gate_id : '',
    formCurrentStep : 2,
  }
  public signUpdataStepThree={
    bank_account_number : '',
    bank_name : '',
    bank_ifsc_code : '',
    bank_confirm_account_number : '',
    bank_cancelled_cheque_document : '',
    beneficiary_name : '',
    formCurrentStep : 3,
  }
  documents = [
    {
      auth_sig_pan_name: '',
      auth_sig_pan_number: '',
      auth_sig_pan: ''
    }
  ];
  public signUpdataStepFour={
    board_res_document : '',
    partnership_deed_document : '',
    documents : this.documents,
    formCurrentStep : 4,
  }
  
  public showLoading = false
  public showPhoneModal = false
  public showEmailModal = false
  public purpose:any=[
    {
      label : 'Recieve and transfer funds for cars',
      value : 'Recieve and transfer funds for cars',
    },
  ]
  public banks:any=[]
  classList: any;
  data:any=[
    {
      value: 'heliotrope',
      label: 'Heliotrope',
      data: { color: 'white', name: 'Heliotrope' },
  },
  {
      value: 'hibiscus',
      label: 'Hibiscus',
      data: { color: 'red', name: 'Hibiscus' },
  },
  ]
  constructor(
    private _renderer2: Renderer2, 
    @Inject(DOCUMENT) private _document: Document,
    private elementRef:ElementRef,
    private register: RegisterService,
    private auth: AuthService,
    private commonService: CommonService,
    private toastr: ToastrService,
    private router: Router
    ) {
      if(this.auth.isLoggedIn){
        console.log("this.auth.getCurrentAuthUser.formCurrentStep",this.auth.getCurrentAuthUser.formCurrentStep);
        if(this.auth.getCurrentAuthUser && this.auth.getCurrentAuthUser.formCurrentStep ==4){
          this.router.navigateByUrl('/dashboard');
        }
        else{
          this.formCurrentStep = (this.auth.getCurrentAuthUser.formCurrentStep)+1;
        }
      }
      //this.formCurrentStep = 3
      
  }
  
  public isLoading:Boolean = false;
  public searchingAgent:Boolean = false;
  ngAfterViewInit() {

    var s3 = document.createElement("script");
    s3.type = "text/javascript";
    s3.src = "assets/js/wizard.js";
    this.elementRef.nativeElement.appendChild(s3);

    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = "assets/other_scripts/register_form.js";
    this.elementRef.nativeElement.appendChild(s);

    
  }
  ngOnInit(): void {
    console.log("signup",this.signUpdata)
    this.auth.getAPIToken.subscribe((val:any) => { this.apiToken = val});
    this.auth.get_bank_list().subscribe((res) => {
      if(res.success === true){
        this.banks = res.data;
      }
    })
  }
  addMore(){
    let blankObject = {
      auth_sig_pan_name: '',
      auth_sig_pan_number: '',
      auth_sig_pan: ''
    }

    this.documents.push(blankObject)
  }
  
  update(){
    console.log(1212)
  }
  showPhoneModalBox(){
    var s33 = document.createElement("script");
    s33.type = "text/javascript";
    s33.src = "assets/js/register_page_verify.js";
    this.elementRef.nativeElement.appendChild(s33);

    let elementRefList = [];
    let errors = false;

    let contact_person_mobile:any = document.querySelector('#contact_person_mobile');
    if(!this.signUpdata.mobile.trim()) {
      errors = true;
      elementRefList.push(document.querySelector("#contact_person_mobile"));
    } 
    else if(contact_person_mobile.parentElement.classList.contains('error')) {
      errors = true;
    }
    else {
      this.commonService.parentHasClassError(document.querySelector("#contact_person_mobile"), 'error')
    }

    if(errors) {
      elementRefList.forEach(v => {
        this.commonService.addDomElement(v, 'error', 'errorMsg', "This field is required");
      })
      return false;
    } else {
      this.showLoading = true;
      let postData = {
        checktype : 'check',
        type : 'mobile',
        mobile : this.signUpdata.mobile,
      }
      this.auth.verifyPhoneEmail(postData).subscribe((res) => {
        if(res.success === true){
          this.showPhoneModal = true;
          document.body.classList.add("active-modal");
          this.toastr.success(res.message);
        }else{
          this.toastr.error(res.message);
        }
      },
      (error) => {
        //this.router.navigateByUrl('/dashboard');
        console.log(error)
        this.toastr.error(error);
        this.showLoading = false;
      }
      )
    }
    
  }
  showEmailModalBox(){
    var s33 = document.createElement("script");
    s33.type = "text/javascript";
    s33.src = "assets/js/register_page_verify.js";
    this.elementRef.nativeElement.appendChild(s33);

    let elementRefList = [];
    let errors = false;

    let contact_person_email:any = document.querySelector('#contact_person_email');
    if(!this.signUpdata.email.trim()) {
      errors = true;
      elementRefList.push(document.querySelector("#contact_person_email"));
    } 
    else if(contact_person_email.parentElement.classList.contains('error')) {
      errors = true;
    }
    else {
      this.commonService.parentHasClassError(document.querySelector("#contact_person_email"), 'error')
    }

    if(errors) {
      elementRefList.forEach(v => {
        this.commonService.addDomElement(v, 'error', 'errorMsg', "This field is required");
      })
      return false;
    } else {
      this.showLoading = true;
      let postData = {
        checktype : 'check',
        type : 'email',
        email : this.signUpdata.email,
      }
      this.auth.verifyPhoneEmail(postData).subscribe((res) => {
        if(res.success === true){
          this.showEmailModal = true;
          document.body.classList.add("active-modal");
          this.toastr.success(res.message);
        }else{
          this.toastr.error(res.message);
        }
      },
      (error) => {
        //this.router.navigateByUrl('/dashboard');
        console.log(error)
        this.toastr.error(error);
        this.showLoading = false;
      }
      )
    }
    
  }
  verifyOTP(type:string){
    if(type == 'mobile'){
      let otp1:any = (<HTMLInputElement>document.getElementById("otp1")).value;
      let otp2:any = (<HTMLInputElement>document.getElementById("otp2")).value;
      let otp3:any = (<HTMLInputElement>document.getElementById("otp3")).value;
      let otp4:any = (<HTMLInputElement>document.getElementById("otp4")).value;
      if(otp1 == '' || otp2  == '' || otp3  == '' || otp4  == ''){
        this.toastr.error("Please enter 4 digit OTP number");
      }else{
        let finalOtp = String(otp1)+String(otp2)+String(otp3)+String(otp4)
        let postData = {
          checktype : 'verify',
          type : 'mobile',
          mobile : this.signUpdata.mobile,
          otp : finalOtp,
        }
        this.auth.verifyPhoneEmail(postData).subscribe((res) => {
          if(res.success === true){
            this.showPhoneModal = false;
            this.signUpdata.phoneVerified = true
            document.body.classList.remove("active-modal");
            this.toastr.success(res.message);
          }else{
            this.toastr.error(res.message);
          }
        },
        (error) => {
          //this.router.navigateByUrl('/dashboard');
          console.log(error)
          this.toastr.error(error);
          this.showLoading = false;
        })
      }
      
    }else{
      let otp1:any = (<HTMLInputElement>document.getElementById("otp1email")).value;
      let otp2:any = (<HTMLInputElement>document.getElementById("otp2email")).value;
      let otp3:any = (<HTMLInputElement>document.getElementById("otp3email")).value;
      let otp4:any = (<HTMLInputElement>document.getElementById("otp4email")).value;
      if(otp1 == '' || otp2  == '' || otp3  == '' || otp4  == ''){
        this.toastr.error("Please enter 4 digit OTP number");
      }else{
        let finalOtp = String(otp1)+String(otp2)+String(otp3)+String(otp4)
        let postData = {
          checktype : 'verify',
          type : 'email',
          email : this.signUpdata.email,
          otp : finalOtp,
        }
        this.auth.verifyPhoneEmail(postData).subscribe((res) => {
          if(res.success === true){
            this.showEmailModal = false;
            this.signUpdata.emailVerified = true
            document.body.classList.remove("active-modal");
            this.toastr.success(res.message);
          }else{
            this.toastr.error(res.message);
          }
        },
        (error) => {
          //this.router.navigateByUrl('/dashboard');
          console.log(error)
          this.toastr.error(error);
          this.showLoading = false;
        })
      }
    }
  }
  
  signup(){
    let elementRefList = [];
    let errors = false;
    this.signUpdata.name = this.commonService.stripScripts(this.signUpdata.name);
    this.signUpdata.business_name = this.commonService.stripScripts(this.signUpdata.business_name);
    this.signUpdata.mobile = this.commonService.stripScripts(this.signUpdata.mobile);
    this.signUpdata.email = this.commonService.stripScripts(this.signUpdata.email);
    this.signUpdata.password = this.commonService.stripScripts(this.signUpdata.password);
    this.signUpdata.confirm_password = this.commonService.stripScripts(this.signUpdata.confirm_password);
    this.signUpdata.address = this.commonService.stripScripts(this.signUpdata.address);
    this.signUpdata.entity_type = this.commonService.stripScripts(document.querySelector<HTMLInputElement>('#entity_type')!.value);
    this.signUpdata.ImpExp = this.commonService.stripScripts(document.querySelector<HTMLInputElement>('#ImpExp')!.value);
    this.signUpdata.pin_code = this.commonService.stripScripts(this.signUpdata.pin_code);
    this.signUpdata.state = this.commonService.stripScripts(document.querySelector<HTMLInputElement>('#state')!.value);
    this.signUpdata.business_pan = this.commonService.stripScripts(this.signUpdata.business_pan);
   
    let name:any = document.querySelector('#contact_person_name');

    if(!this.signUpdata.name.trim()) {
      errors = true;
      elementRefList.push(document.querySelector("#contact_person_name"));
    } 
    else if(name.parentElement.classList.contains('error')) {
      errors = true;
    }
    else {
      this.commonService.parentHasClassError(document.querySelector("#contact_person_name"), 'error')
    }
    
    let business_name:any = document.querySelector('#business_name');
    if(!this.signUpdata.business_name.trim()) {
      errors = true;
      elementRefList.push(document.querySelector("#business_name"));
    } 
    else if(business_name.parentElement.classList.contains('error')) {
      errors = true;
    }
    else {
      this.commonService.parentHasClassError(document.querySelector("#business_name"), 'error')
    }

    let contact_person_mobile:any = document.querySelector('#contact_person_mobile');
    if(!this.signUpdata.name.trim()) {
      errors = true;
      elementRefList.push(document.querySelector("#contact_person_mobile"));
    } 
    else if(contact_person_mobile.parentElement.classList.contains('error')) {
      errors = true;
    }
    else {
      this.commonService.parentHasClassError(document.querySelector("#contact_person_mobile"), 'error')
    }
   
    let contact_person_email:any = document.querySelector('#contact_person_email');
    if(!this.signUpdata.email.trim()) {
      errors = true;
      elementRefList.push(document.querySelector("#contact_person_email"));
    } 
    else if(contact_person_email.parentElement.classList.contains('error')) {
      errors = true;
    }
    else {
      this.commonService.parentHasClassError(document.querySelector("#contact_person_email"), 'error')
    }

    let password:any = document.querySelector('#password');
    if(!this.signUpdata.password) {
      errors = true;
      elementRefList.push(document.querySelector("#password"));
    }
    else if(password.parentElement.classList.contains('error')) {
      errors = true;
    }
     else {
      this.commonService.parentHasClassError(document.querySelector("#password"), 'error')
    }

    let confirm_password:any = document.querySelector('#confirm_password');
    if(!this.signUpdata.confirm_password.trim()) {
      errors = true;
      elementRefList.push(document.querySelector("#confirm_password"));
    } 
    else if(confirm_password.parentElement.classList.contains('error')) {
      errors = true;
    }
    else {
      this.commonService.parentHasClassError(document.querySelector("#confirm_password"), 'error')
    }

    let business_pan:any = document.querySelector('#business_pan');
    if(!this.signUpdata.business_pan.trim()) {
      errors = true;
      elementRefList.push(document.querySelector("#business_pan"));
    } 
    else if(business_pan.parentElement.classList.contains('error')) {
      errors = true;
    }
    else {
      this.commonService.parentHasClassError(document.querySelector("#business_pan"), 'error')
    }

    let pin_code:any = document.querySelector('#pin_code');
    if(!this.signUpdata.pin_code.trim()) {
      errors = true;
      elementRefList.push(document.querySelector("#pin_code"));
    } 
    else if(pin_code.parentElement.classList.contains('error')) {
      errors = true;
    }
    else {
      this.commonService.parentHasClassError(document.querySelector("#pin_code"), 'error')
    }

    let address:any = document.querySelector('#address');
    if(!this.signUpdata.address) {
      errors = true;
      elementRefList.push(document.querySelector("#address"));
    }
    else if(address.parentElement.classList.contains('error')) {
      errors = true;
    }
     else {
      this.commonService.parentHasClassError(document.querySelector("#address"), 'error')
    }

    console.log("this.signUpdata.state",this.signUpdata.state)

    if(!this.signUpdata.entity_type) {
      errors = true;
      elementRefList.push(document.querySelector("#entity_type"));
    }
    else {
      this.commonService.parentHasClassError(document.querySelector("#entity_type"), 'error')
    }

    if(!this.signUpdata.state) {
      errors = true;
      elementRefList.push(document.querySelector("#state"));
    }
     else {
      this.commonService.parentHasClassError(document.querySelector("#state"), 'error')
    }

    if(this.signUpdata.password != this.signUpdata.confirm_password) {
      this.toastr.error("Password & confirm password doesn't match");
      return false;
    }
    

    console.log("elementRefList",elementRefList)
    console.log("errors",errors)
    if(errors) {
      elementRefList.forEach(v => {
        this.commonService.addDomElement(v, 'error', 'errorMsg', "This field is required");
      })
      return false;
    } else {
      // this.signUpdata.phoneVerified = true
      // this.signUpdata.emailVerified = true
      if(!this.signUpdata.phoneVerified || !this.signUpdata.emailVerified){
        this.toastr.error("Please verify email & Phone to proceed further");
      }else{
        this.showLoading = true;
        this.auth.signup(this.signUpdata).subscribe((res) => {
          this.showLoading = false;
          if(res.success === true){
            console.log("res.message",res.message)
            //this.processJS();
            this.formCurrentStep = 2;
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
  submitStepTwo(){
    let elementRefList = [];
    let errors = false;
    this.signUpdataStepTwo.business_gstin = this.commonService.stripScripts(this.signUpdataStepTwo.business_gstin);
    this.signUpdataStepTwo.business_cin = this.commonService.stripScripts(this.signUpdataStepTwo.business_cin);
    this.signUpdataStepTwo.business_iec = this.commonService.stripScripts(this.signUpdataStepTwo.business_iec);
    this.signUpdataStepTwo.business_ice_gate_id = this.commonService.stripScripts(this.signUpdataStepTwo.business_ice_gate_id);
   
    
    let business_gstin:any = document.querySelector('#business_gstin');
    if(!this.signUpdataStepTwo.business_gstin.trim()) {
      errors = true;
      elementRefList.push(document.querySelector("#business_gstin"));
    } 
    else if(business_gstin.parentElement.classList.contains('error')) {
      errors = true;
    }
    else {
      this.commonService.parentHasClassError(document.querySelector("#business_gstin"), 'error')
    }

    let business_cin:any = document.querySelector('#business_cin');
    if(!this.signUpdataStepTwo.business_cin.trim()) {
      errors = true;
      elementRefList.push(document.querySelector("#business_cin"));
    } 
    else if(business_cin.parentElement.classList.contains('error')) {
      errors = true;
    }
    else {
      this.commonService.parentHasClassError(document.querySelector("#business_cin"), 'error')
    }

    let business_iec:any = document.querySelector('#business_iec');
    if(!this.signUpdataStepTwo.business_iec.trim()) {
      errors = true;
      elementRefList.push(document.querySelector("#business_iec"));
    } 
    else if(business_iec.parentElement.classList.contains('error')) {
      errors = true;
    }
    else {
      this.commonService.parentHasClassError(document.querySelector("#business_iec"), 'error')
    }

    let business_ice_gate_id:any = document.querySelector('#business_ice_gate_id');
    if(!this.signUpdataStepTwo.business_ice_gate_id.trim()) {
      errors = true;
      elementRefList.push(document.querySelector("#business_ice_gate_id"));
    } 
    else if(business_ice_gate_id.parentElement.classList.contains('error')) {
      errors = true;
    }
    else {
      this.commonService.parentHasClassError(document.querySelector("#business_ice_gate_id"), 'error')
    }
    

    if(!this.signUpdataStepTwo.business_gstin_document) {
      errors = true;
      elementRefList.push(document.querySelector("#business_gstin_document"));
    }else {
      this.commonService.parentHasClassError(document.querySelector("#business_gstin_document"), 'error')
    }
    console.log("errors",errors)
    if(errors) {
      elementRefList.forEach(v => {
        console.log("v",v)
        this.commonService.addDomElement(v, 'error', 'errorMsg', "This field is required");
      })
      return false;
    } else {
      this.showLoading = true;
      this.auth.signupStepTwo(this.signUpdataStepTwo).subscribe((res) => {
        this.showLoading = false;
        if(res.success === true){
          console.log("res.message",res.message)
          //this.processJS();
          this.formCurrentStep = 3;
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
  selectVal(){
    alert()
  }
  submitStepThree(){
    let elementRefList = [];
    let errors = false;
    this.signUpdataStepThree.beneficiary_name = this.commonService.stripScripts(this.signUpdataStepThree.beneficiary_name);
    this.signUpdataStepThree.bank_account_number = this.commonService.stripScripts(this.signUpdataStepThree.bank_account_number);
    this.signUpdataStepThree.bank_confirm_account_number = this.commonService.stripScripts(this.signUpdataStepThree.bank_confirm_account_number);
    this.signUpdataStepThree.bank_ifsc_code = this.commonService.stripScripts(this.signUpdataStepThree.bank_ifsc_code);
    this.signUpdataStepThree.bank_name = this.commonService.stripScripts(document.querySelector<HTMLInputElement>('#bank_name')!.value);
   
    if(!this.signUpdataStepThree.beneficiary_name) {
      errors = true;
      elementRefList.push(document.querySelector("#beneficiary_name"));
    }else {
      this.commonService.parentHasClassError(document.querySelector("#beneficiary_name"), 'error')
    }
    if(!this.signUpdataStepThree.bank_account_number) {
      errors = true;
      elementRefList.push(document.querySelector("#bank_account_number"));
    }else {
      this.commonService.parentHasClassError(document.querySelector("#bank_account_number"), 'error')
    }
    if(!this.signUpdataStepThree.bank_confirm_account_number) {
      errors = true;
      elementRefList.push(document.querySelector("#bank_confirm_account_number"));
    }else {
      this.commonService.parentHasClassError(document.querySelector("#bank_confirm_account_number"), 'error')
    }
    if(!this.signUpdataStepThree.bank_ifsc_code) {
      errors = true;
      elementRefList.push(document.querySelector("#bank_ifsc_code"));
    }else {
      this.commonService.parentHasClassError(document.querySelector("#bank_ifsc_code"), 'error')
    }
    console.log("this.signUpdataStepThree.bank_name",this.signUpdataStepThree.bank_name)
    let bank_name:any = document.querySelector('#bank_name');
    if(!this.signUpdataStepThree.bank_name) {
      errors = true;
      elementRefList.push(document.querySelector("#bank_name"));
    }
     else {
      this.commonService.parentHasClassError(document.querySelector("#address"), 'error')
    }
    
    if(!this.signUpdataStepThree.bank_cancelled_cheque_document) {
      errors = true;
      elementRefList.push(document.querySelector("#bank_cancelled_cheque_document"));
    }else {
      this.commonService.parentHasClassError(document.querySelector("#bank_cancelled_cheque_document"), 'error')
    }
    if(this.signUpdataStepThree.bank_confirm_account_number != this.signUpdataStepThree.bank_account_number){
      this.toastr.error("Bank account no and Confirm account no does not matched");
      return false;
    }
   
    if(errors) {
      elementRefList.forEach(v => {
        this.commonService.addDomElement(v, 'error', 'errorMsg', "This field is required");
      })
      return false;
    } else {
      this.showLoading = true;
      this.auth.signupStepThree(this.signUpdataStepThree).subscribe((res) => {
        this.showLoading = false;
        if(res.success === true){
          console.log("res.message",res.message)
          //this.processJS();
          this.formCurrentStep = 4;
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
  submitStepFour(){
    let elementRefList:any = [];
    let errors = false;
    if(!this.signUpdataStepFour.partnership_deed_document) {
      errors = true;
      elementRefList.push(document.querySelector("#partnership_deed_document"));
    }else {
      this.commonService.parentHasClassError(document.querySelector("#partnership_deed_document"), 'error')
    }
    if(!this.signUpdataStepFour.board_res_document) {
      errors = true;
      elementRefList.push(document.querySelector("#board_res_document"));
    }else {
      this.commonService.parentHasClassError(document.querySelector("#board_res_document"), 'error')
    }
    if(errors) {
      elementRefList.forEach((v:any) => {
        this.commonService.addDomElement(v, 'error', 'errorMsg', "This field is required");
      })
      return false;
    } else {
      this.showLoading = true;
      this.auth.signupStepFour(this.signUpdataStepFour).subscribe((res) => {
        this.showLoading = false;
        if(res.success === true){
          this.formCurrentStep = 0;
          console.log("res.message",res.message)
          //this.processJS();
          this.router.navigateByUrl('/dashboard');
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
  generateGUID(){
    //bca68a9a-874d-443f-8328-8664e495b84d
    return  Guid.create().toString();
  }
  importBusinessPanFile(event:any) {
    if (event.target.files.length == 0) {
        console.log("No file selected!");
        return
    }
    this.signUpdata.business_pan_document = event.target.files[0]
    $(event.target).closest('div').find('header').text(event.target.files[0].name)
  }
  importBusinessGSTINFile(event:any) {
    if (event.target.files.length == 0) {
        console.log("No file selected!");
        return
    }
    this.signUpdataStepTwo.business_gstin_document = event.target.files[0]
    $(event.target).closest('div').find('header').text(event.target.files[0].name)
  }
  importCancelledChequeFile(event:any) {
    if (event.target.files.length == 0) {
        console.log("No file selected!");
        return
    }
    this.signUpdataStepThree.bank_cancelled_cheque_document = event.target.files[0]
    $(event.target).closest('div').find('header').text(event.target.files[0].name)
  }
  
  importSig1PanFile(event:any,index=0) {
    if (event.target.files.length == 0) {
        console.log("No file selected!");
        return
    }
    this.documents[index].auth_sig_pan = event.target.files[0]
    console.log(this.documents)
    $(event.target).closest('div').find('header').text(event.target.files[0].name)
  }
  
  importDeedReviewFile(event:any) {
    if (event.target.files.length == 0) {
        console.log("No file selected!");
        return
    }
    this.signUpdataStepFour.partnership_deed_document = event.target.files[0]
    $(event.target).closest('div').find('header').text(event.target.files[0].name)
  }
  importBoardResFile(event:any) {
    if (event.target.files.length == 0) {
        console.log("No file selected!");
        return
    }
    this.signUpdataStepFour.board_res_document = event.target.files[0]
    $(event.target).closest('div').find('header').text(event.target.files[0].name)
  }
  
  public goToStep(step:Number){
    this.formCurrentStep = step;
  }

  public loadScript(url: string) {
    const body = <HTMLDivElement> document.body;
    const script = document.createElement('script');
    script.innerHTML = '';
    script.src = url;
    script.async = false;
    script.defer = true;
    body.appendChild(script);
  }

  public processJS(){
    const verifyPhone:any = document.querySelector(".verify-phone");
    const verifyEmail:any = document.querySelector(".verify-email");
    
    const phoneBoxModal:any = document.querySelector(".phone-box-modal");
    const phoneInnerBodyModal:any = document.querySelector(".phone-inner-body-modal");
    const phoneOverlay:any = document.querySelector(".phone-overlay");
    const customBtnPhone:any = document.querySelector(".customBtnPhone");
    
    const emailBoxModal:any = document.querySelector(".email-box-modal");
    const emailInnerBodyModal:any = document.querySelector(".email-inner-body-modal");
    const emailOverlay:any = document.querySelector(".email-overlay");
    const customBtnEmail:any = document.querySelector(".customBtnEmail");
    
    const mobile_field:any = document.getElementById("contact_person_mobile");
    const email_field:any = document.getElementById("contact_person_email");
    
    let digitValidate = function (ele:any) {
      console.log(ele.value);
      ele.value = ele.value.replace(/[^0-9]/g, "");
    };
    
    let tabChange = function (val:any) {
      let ele = document.querySelectorAll("input");
      if (ele[val - 1].value != "") {
        ele[val].focus();
      } else if (ele[val - 1].value == "") {
        ele[val - 2].focus();
      }
    };
  }

}
