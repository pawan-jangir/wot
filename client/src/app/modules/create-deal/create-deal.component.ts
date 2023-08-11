import { Component, OnInit,Renderer2 ,Inject,ElementRef } from '@angular/core';
import { Guid } from 'guid-typescript';
import {RegisterService} from '../../services/register.service';
import {CommonService} from '../../services/common.service';
import {AuthService} from '../../services/auth.service';
import {environment} from '../../../environments/environment';
import {Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DOCUMENT } from '@angular/common';
declare let $: any;

@Component({
  selector: 'app-create-deal',
  templateUrl: './create-deal.component.html',
  styleUrls: ['./create-deal.component.css']
})
export class CreateDealComponent implements OnInit {
  public currentStep:any = 1
  public escriptTypes:any = []
  public escriptPorts:any = []
  public buyers:any = []
  public sellers:any = []
  public addedEscripts:any = []
  public commisionData:any = {
    buyer_brokerage : 0,
    buyer_brokerage_type : '%',
    seller_brokerage : 0,
    seller_brokerage_type : '%',
    buyer_ref_fee : 0,
    buyer_ref_fee_type : '%',
    seller_ref_fee : 0,
    seller_ref_fee_type : '%',
    importer_net_rate : 0,
    seller_rm_rate : 0,
    remarks : '',
  }
  public escript:any={
    eScript : '',
    type : '',
    issueDate : '',
    portCode : '',
    originalOwner : '',
    scriptBalanceValue : 0,
    rate : 0,
    amount : 0,
  }
  public dealModel:any={
    buyer : '',
    seller : '',
    date_of_agreement : '',
    escript_data : [],
    commision_data : [],
  }
  public confirmModalData:any = {}
  public selectedSeller:any = {}
  public selectedBuyer:any = {}
  public showBuyerBox:any = false
  public showSellerBox:any = false
  public dealData:any= {}
  public calculationPage:any={
    buyerBrokeragePercent : '-',
    buyerBrokerageAmount : 0,
    sellerBrokeragePercent : '-',
    sellerBrokerageAmount : 0,
    buyerReferralFeepercent : '-',
    buyerReferralFeeAmount : 0,
    sellerReferralFeepercent : '-',
    sellerReferralFeeAmount : 0,
    sellerSideEarningpercent : '-',
    sellerSideEarningAmount : 0,
    buyerSideEarningpercent : '-',
    buyerSideEarningAmount : 0,
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
    // this.auth.get_deal_details('640737faeb1e462080ddd8dc').subscribe((res) => {
    //   if(res.success === true){
    //     this.dealModel = res.data;
    //   }
    // })
    this.auth.get_escript_type_list().subscribe((res) => {
      if(res.success === true){
        this.escriptTypes = res.data;
      }
    })
    this.auth.get_escript_port_list().subscribe((res) => {
      if(res.success === true){
        this.escriptPorts = res.data;
      }
    })
   
    $(document).find('#buyer').on("change", (event:any)=>{
      this.auth.get_user_details($(event.currentTarget).val()).subscribe((res) => {
        if(res.success === true){
          this.selectedBuyer = res.data;
        }
      })
    });
    $(document).find('#seller').on("change", (event:any)=>{
      this.auth.get_user_details($(event.currentTarget).val()).subscribe((res) => {
        if(res.success === true){
          this.selectedSeller = res.data;
        }
      })
    });
  }
  ngAfterViewInit() {

    var s3 = document.createElement("script");
    s3.type = "text/javascript";
    s3.src = "assets/other_scripts/dealPage.js";
    this.elementRef.nativeElement.appendChild(s3);

    // $(document).find('.select2').on("change", function(){
    //   alert($(this).val());
    //  });
  }
  getUsers(userType:any){
    let searchText = userType == 'buyer' ? this.dealModel.buyer  : this.dealModel.seller;
    if(searchText == '' && userType == 'buyer'){
      this.buyers = [];
      this.showBuyerBox = false
    }
    else if(searchText == '' && userType == 'seller'){
      this.sellers = [];
      this.showSellerBox = false
    }else{
      this.auth.get_users_by_type(userType,searchText).subscribe((res) => {
        if(res.success === true){
          if(userType == 'seller'){
            this.showSellerBox = true
            this.sellers = res.data;
          }
          if(userType == 'buyer'){
            this.showBuyerBox = true
            this.buyers = res.data;
          }
          if(!this.dealModel.sellers.length){
            this.showSellerBox = false
          }
          if(!this.dealModel.buyers.length){
            this.showBuyerBox = false
          }
          
        }
      })
    }
    
  }
  selectuserBox(data:any,userType:any=''){
    if(userType == 'buyer'){
      this.selectedBuyer = data;
      this.showBuyerBox = false
     
    }else{
      this.selectedSeller = data;
      this.showSellerBox = false
      
    }
    console.log(data)
  }
  public goToStep(step:Number){
    this.currentStep = step;
  }
  public checkit(){
    console.log(55)
  }
  
  submitStepOne(){
   
    let elementRefList:any = [];
    let errors = false;
    if(!this.dealModel.date_of_agreement) {
      errors = true;
      elementRefList.push(document.querySelector("#date_of_agreement"));
    }else {
      this.commonService.parentHasClassError(document.querySelector("#date_of_agreement"), 'error')
    }
    if(!this.dealModel.buyer) {
      errors = true;
      elementRefList.push(document.querySelector("#select_buyer"));
    }else {
      this.commonService.parentHasClassError(document.querySelector("#select_buyer"), 'error')
    }
    if(!this.dealModel.seller) {
      errors = true;
      elementRefList.push(document.querySelector("#select_seller"));
    }else {
      this.commonService.parentHasClassError(document.querySelector("#select_seller"), 'error')
    }
    
    if(errors) {
      console.log(elementRefList)
      elementRefList.forEach((v:any) => {
        this.commonService.addDomElement(v, 'error', 'errorMsg', "This field is required");
      })
      return false;
    } else {
      this.dealModel.seller = this.selectedBuyer._id
      this.dealModel.buyer = this.selectedSeller._id
      this.auth.create_deal_one(this.dealModel).subscribe((res) => {
        if(res.success === true){
          this.dealModel = res.data;
          console.log(this.dealModel)
          this.currentStep = 2;
        }
      })
      
    }
  }
  submitStepTwo(){
    if(!this.addedEscripts.length){
      this.toastr.error("Please enter escript data");
    }else{
      this.dealModel.escript_data = this.addedEscripts;
      this.auth.create_deal_two(this.dealModel).subscribe((res) => {
        if(res.success === true){
          this.dealModel = res.data;
          console.log(this.dealModel)
          this.currentStep = 3;
        }
      })
      
    }
    
  }
  submitStepThree(){
    let elementRefList:any = [];
    let errors = false;
    // if(this.commisionData.buyer_brokerage != ) {
    //   errors = true;
    //   elementRefList.push(document.querySelector("#buyer_brokerage"));
    // }else {
    //   this.commonService.parentHasClassError(document.querySelector("#buyer_brokerage"), 'error')
    // }
    // if(!isNaN(this.commisionData.seller_brokerage)) {
    //   errors = true;
    //   elementRefList.push(document.querySelector("#seller_brokerage"));
    // }else {
    //   this.commonService.parentHasClassError(document.querySelector("#seller_brokerage"), 'error')
    // }
    // if(!this.commisionData.buyer_ref_fee) {
    //   errors = true;
    //   elementRefList.push(document.querySelector("#buyer_ref_fee"));
    // }else {
    //   this.commonService.parentHasClassError(document.querySelector("#buyer_ref_fee"), 'error')
    // }
    // if(!this.commisionData.seller_ref_fee) {
    //   errors = true;
    //   elementRefList.push(document.querySelector("#seller_ref_fee"));
    // }else {
    //   this.commonService.parentHasClassError(document.querySelector("#seller_ref_fee"), 'error')
    // }
    if(errors) {
      console.log(elementRefList)
      elementRefList.forEach((v:any) => {
        this.commonService.addDomElement(v, 'error', 'errorMsg', "This field is required");
      })
      return false;
    } else {
      this.dealModel.commision_data = this.commisionData;
      this.auth.create_deal_three(this.dealModel,this.calculationPage).subscribe((res) => {
        if(res.success === true){
          $('#view_detailModal').modal('show')
          this.dealModel = res.data;
          this.confirmModalData = res.detailed_data;
          console.log(this.dealModel)
          this.currentStep = 3;
        }
      })
    }

  }
  calculateCommision(){
    if(isNaN(this.commisionData.buyer_brokerage)){
      this.toastr.error("Value should be number only");
      this.commisionData.buyer_brokerage = 0;
    }
    if(isNaN(this.commisionData.seller_brokerage)){
      this.toastr.error("Value should be number only");
      this.commisionData.seller_brokerage = 0;
    }
    if(isNaN(this.commisionData.buyer_ref_fee)){
      this.toastr.error("Value should be number only");
      this.commisionData.buyer_ref_fee = 0;
    }
    if(isNaN(this.commisionData.seller_ref_fee)){
      this.toastr.error("Value should be number only");
      this.commisionData.seller_ref_fee = 0;
    }
    console.log("data",this.dealModel)
    let escript_data = this.dealModel.escript_data;
    let totalAmount = 0
    escript_data.map((item:any)=>{ totalAmount += Number(item.amount) })



    if(this.commisionData.buyer_brokerage){
      if(this.commisionData.buyer_brokerage_type == 'INR'){
        this.calculationPage.buyerBrokeragePercent = '-';
        this.calculationPage.buyerBrokerageAmount = this.commisionData.buyer_brokerage;
      }else{
        this.calculationPage.buyerBrokeragePercent = this.commisionData.buyer_brokerage;
        this.calculationPage.buyerBrokerageAmount = Math.ceil((totalAmount*this.commisionData.buyer_brokerage)/100);
      }
    }

    if(this.commisionData.seller_brokerage){
      if(this.commisionData.seller_brokerage_type == 'INR'){
        this.calculationPage.sellerBrokeragePercent = '-';
        this.calculationPage.sellerBrokerageAmount = this.commisionData.seller_brokerage;
      }else{
        this.calculationPage.sellerBrokeragePercent = this.commisionData.seller_brokerage;
        this.calculationPage.sellerBrokerageAmount = Math.ceil((totalAmount*this.commisionData.seller_brokerage)/100);
      }
    }

    if(this.commisionData.buyer_ref_fee){
      if(this.commisionData.buyer_ref_fee_type == 'INR'){
        this.calculationPage.buyerReferralFeepercent = '-';
        this.calculationPage.buyerReferralFeeAmount = this.commisionData.buyer_ref_fee;
      }else{
        this.calculationPage.buyerReferralFeepercent = this.commisionData.buyer_ref_fee;
        this.calculationPage.buyerReferralFeeAmount = Math.ceil((totalAmount*this.commisionData.buyer_ref_fee)/100);
      }
    }

    if(this.commisionData.seller_ref_fee){
      if(this.commisionData.seller_ref_fee_type == 'INR'){
        this.calculationPage.sellerReferralFeepercent = '-';
        this.calculationPage.sellerReferralFeeAmount = this.commisionData.seller_ref_fee;
      }else{
        this.calculationPage.sellerReferralFeepercent = this.commisionData.seller_ref_fee;
        this.calculationPage.sellerReferralFeeAmount = Math.ceil((totalAmount*this.commisionData.seller_ref_fee)/100);
      }
    }
    this.calculationPage.buyerSideEarningAmount = Math.ceil(this.calculationPage.buyerBrokerageAmount-this.calculationPage.buyerReferralFeeAmount)
    this.calculationPage.sellerSideEarningAmount = Math.ceil(this.calculationPage.sellerBrokerageAmount-this.calculationPage.sellerReferralFeeAmount)

  }
  submitStepFour(status:any){
    if(status == 0){
      $('#view_detailModal').modal('hide')
    }else{
      this.dealModel.status = status;
      this.auth.create_deal_four(this.dealModel).subscribe((res) => {
        if(res.success === true){
          this.toastr.success(res.message);
          $('#view_detailModal').modal('hide')
          this.router.navigateByUrl('/dashboard');
        }else{
          this.toastr.error(res.message);
        }
      })
    }
  }
  importescriptCSV(event:any) {
    if (event.target.files.length == 0) {
        console.log("No file selected!");
        return
    }
    const formData = new FormData();
    formData.append('document', event.target.files[0]);
    this.auth.read_escript_data(formData).subscribe((res) => {
      if(res.success === true){
        this.addedEscripts = res.data
      }
      // if(res.success === true){
      //  this.addedEscripts.push(res.data);
      //  console.log(this.addedEscripts)
      // }
    })
    //this.signUpdata.business_pan_document = event.target.files[0]
    $(event.target).closest('div').find('header').text(event.target.files[0].name)
  }
  removeItem(index:any){
    this.addedEscripts.splice(index, 1);
  }
  addToTable(){
    this.escript.type = this.commonService.stripScripts(document.querySelector<HTMLInputElement>('#type')!.value);
    this.escript.portCode = this.commonService.stripScripts(document.querySelector<HTMLInputElement>('#portcode')!.value);
    let elementRefList:any = [];
    let errors = false;
    if(!this.escript.eScript) {
      errors = true;
      elementRefList.push(document.querySelector("#eScript"));
    }else {
      this.commonService.parentHasClassError(document.querySelector("#eScript"), 'error')
    }
   
    if(!this.escript.issueDate) {
      errors = true;
      elementRefList.push(document.querySelector("#issueDate"));
    }else {
      this.commonService.parentHasClassError(document.querySelector("#issueDate"), 'error')
    }
    if(!this.escript.originalOwner) {
      errors = true;
      elementRefList.push(document.querySelector("#originalOwner"));
    }else {
      this.commonService.parentHasClassError(document.querySelector("#originalOwner"), 'error')
    }
    if(!this.escript.scriptBalanceValue) {
      errors = true;
      elementRefList.push(document.querySelector("#scriptBalanceValue"));
    }else {
      this.commonService.parentHasClassError(document.querySelector("#scriptBalanceValue"), 'error')
    }
    if(!this.escript.rate) {
      errors = true;
      elementRefList.push(document.querySelector("#rate"));
    }else {
      this.commonService.parentHasClassError(document.querySelector("#rate"), 'error')
    }
    if(!this.escript.type) {
      errors = true;
      elementRefList.push(document.querySelector("#type"));
    }else {
      this.commonService.parentHasClassError(document.querySelector("#type"), 'error')
    }
    if(!this.escript.portCode) {
      errors = true;
      elementRefList.push(document.querySelector("#portcode"));
    }else {
      this.commonService.parentHasClassError(document.querySelector("#portcode"), 'error')
    }
    if(!this.escript.amount) {
      errors = true;
      elementRefList.push(document.querySelector("#amount"));
    }else {
      this.commonService.parentHasClassError(document.querySelector("#amount"), 'error')
    }
    if(errors) {
      console.log(elementRefList)
      elementRefList.forEach((v:any) => {
        this.commonService.addDomElement(v, 'error', 'errorMsg', "This field is required");
      })
      return false;
    } else {
      console.log("this.escript",this.escript)
      this.addedEscripts.push(this.escript);
      this.escript = {}
    }
  }


}
