import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import {RegisterService} from '../../services/register.service';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {CommonService} from '../../services/common.service';
import {DefaultService} from '../../services/default.service';
import { ActivatedRoute } from '@angular/router';
import { WindowRefService } from '../../services/window-ref.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  providers: [WindowRefService]
})
export class CheckoutComponent implements OnInit {

  public cart_id:any = ''
  public showLoading = false
  public imgBaseUrl:any=''
 
  public currentProduct:any={}
  public originalProduct:any={}
  displayStyle = "none";
  displayStyleLogo = "none";
  public companyLogo:any = ''
  public checkoutData:any={}
  public couponCode = '';
  public discountObj:any={}
  public grandTotal = 0;
  public discountAmt = 0;
  public discountAppliedSuccess = false
  constructor(
    private register: RegisterService,
    private auth: AuthService,
    private router: Router,
    private commonService: CommonService,
    private toastr: ToastrService,
    private defaultService: DefaultService,
    private route: ActivatedRoute,
    private winRef: WindowRefService
  ) { 
    this.cart_id = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.defaultService.get_cart(this.cart_id).subscribe((res) => {
      this.showLoading = false;
      this.currentProduct = res.data
      this.grandTotal = res.data.amount
      this.originalProduct = this.currentProduct ? JSON.parse(this.currentProduct.product) : {}
      this.imgBaseUrl = res.product_img_url
    },
    (error) => {
      console.log(error)
      this.toastr.error(error);
      this.showLoading = false;
    })
  }
  
  makePayment(id:any){
  let data = this.checkoutData;
  data.id = id;
  data.amount = this.currentProduct.amount
  data.discount = this.discountAmt
  data.grandTotal = this.grandTotal
  data.discountObj = JSON.stringify(this.discountObj)

  this.defaultService.order_with_razor_pay(data).subscribe((res) => {
    let order_data = res.data;
    let order_id = res.order_id;
    this.payWithRazor(order_id,(order_data.grandTotal*100))
  })
  }

  payWithRazor(order_id:any,amount:any) {
    const options: any = {
      key: 'rzp_test_rFXwtHIILu1CTU',
      amount: amount, // amount should be in paise format to display Rs 1255 without decimal point
      currency: 'INR',
      name: '', // company name or product name
      description: '',  // product description
      image: '../../assets/images/white-logo.svg', // company logo or product image
      order_id: order_id, // order_id created by you in backend
      modal: {
        // We should prevent closing of the form when esc key is pressed.
        escape: false,
      },
      notes: {
        // include notes if any
      },
      theme: {
        color: '#0c238a'
      }
    };
    options.handler = ((response:any, error:any) => {
      options.response = response;
      console.log(response);
      console.log(options);
      response.status = 'paid'
      this.updatePayment(response)
      this.toastr.success('Your payment is successful, Thanks for order with us');
      // call your backend api to verify payment signature & capture transaction
    });
    options.modal.ondismiss = ((response:any) => {
      // console.log("on cancel",response)
      // response.status = 'paid'
      // this.updatePayment(response)
      // this.toastr.error('Your payment is failed, Please try again');
      // // handle the case when user closes the form while transaction is in progress
      // console.log('Transaction cancelled.');
    });
    const rzp = new this.winRef.nativeWindow.Razorpay(options);
    rzp.open();
  }
  updatePayment(response:any){
    response.discount = this.discountAmt
    response.discountObj = this.discountObj
    response.grandTotal = this.grandTotal
    this.defaultService.update_payment_status(response).subscribe((res) => {
      this.toastr.success(res.message);
      this.router.navigateByUrl('/');
    })
  }
  checkCouponCode(){
    let postD = {coupon_code:this.couponCode}
    this.defaultService.check_coupon_code(postD).subscribe((res) => {
      if(res.success === true){
        console.log(res)
        this.discountObj = res.data;
        this.toastr.success(res.message);
        this.discountAppliedSuccess = true
      }else{
        this.toastr.error(res.message);
        this.showLoading = false;
        this.discountAppliedSuccess = false
        this.calculatePrice()
      }
     
      //this.router.navigateByUrl('/');
    },
    (error) => {
      console.log(error)
      this.toastr.error(error);
      this.showLoading = false;
      this.calculatePrice()
    },
    )
  }
  calculatePrice(discountobj:any=''){
    if(this.discountAppliedSuccess){
      console.log("true")
      let totalAmt = this.currentProduct.amount;
      let discountAmt = 0
      if(discountobj.type == 'amount'){
        discountAmt = discountobj.type_value
        totalAmt = totalAmt-discountAmt;
        if(totalAmt<=0){
          totalAmt = 0
        }
      }else if(discountobj.type == 'percent'){
        let discountPr = Number((totalAmt*discountobj.type_value)/100);
        totalAmt = totalAmt-discountPr;
        discountAmt = discountPr
        if(totalAmt<=0){
          totalAmt = 0
        }
      }
      this.grandTotal = totalAmt
      this.discountAmt = discountAmt
      return discountAmt
    }else{
      console.log("true")
      this.grandTotal = this.currentProduct.amount
      this.discountAmt = 0
      return this.discountAmt
    }
    
  }
}
