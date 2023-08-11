import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import {RegisterService} from '../../services/register.service';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {CommonService} from '../../services/common.service';
import {DefaultService} from '../../services/default.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-frame',
  templateUrl: './frame.component.html',
  styleUrls: ['./frame.component.css']
})
export class FrameComponent implements OnInit {
  public cart_id:any = ''
  public showLoading = false
  public imgBaseUrl:any=''
 
  public currentProduct:any={}
  public originalProduct:any={}
  displayStyle = "none";
  displayStyleLogo = "none";
  public companyLogo:any = ''
  constructor(
    private register: RegisterService,
    private auth: AuthService,
    private router: Router,
    private commonService: CommonService,
    private toastr: ToastrService,
    private defaultService: DefaultService,
    private route: ActivatedRoute,
  ) { 
    this.cart_id = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.defaultService.get_cart(this.cart_id).subscribe((res) => {
      this.showLoading = false;
      this.currentProduct = res.data
      this.originalProduct = this.currentProduct ? JSON.parse(this.currentProduct.product) : {}
      this.imgBaseUrl = res.img_url
    },
    (error) => {
      console.log(error)
      this.toastr.error(error);
      this.showLoading = false;
    })
  }
  addRemoveAddSpareCard(flag:any,id:any){
    let data = {
      id : id,
      isSparePartAdded : flag,
    }
    this.defaultService.update_cart(data).subscribe((res) => {
      this.defaultService.get_cart(this.cart_id).subscribe((res) => {
        this.showLoading = false;
        this.currentProduct = res.data
        this.originalProduct = this.currentProduct ? JSON.parse(this.currentProduct.product) : {}
        this.imgBaseUrl = res.img_url
        this.toastr.success(res.message);
      },
      (error) => {
        console.log(error)
        this.toastr.error(error);
        this.showLoading = false;
      })
    })
    console.log(flag)
    console.log(id)
  }
  submitUpdate(id:any){

    let data = this.currentProduct;
    data.id = id;
    this.defaultService.update_cart(data).subscribe((res) => {
      this.defaultService.get_cart(this.cart_id).subscribe((res) => {
        this.showLoading = false;
        this.currentProduct = res.data
        this.originalProduct = this.currentProduct ? JSON.parse(this.currentProduct.product) : {}
        this.imgBaseUrl = res.img_url
        this.toastr.success(res.message);
        this.closePopup()
      },
      (error) => {
        console.log(error)
        this.toastr.error(error);
        this.showLoading = false;
      })
    })
  }
  
  
  openPopup() {
    this.displayStyle = "block";
  }
  closePopup() {
    this.displayStyle = "none";
  }
  openPopupLogo() {
    this.displayStyleLogo = "block";
  }
  closePopupLogo() {
    this.displayStyleLogo = "none";
  }
  importLogo(event:any,id:any){
  //   if (event.target.files.length == 0) {
  //       console.log("No file selected!");
  //       return
  //   }
  // let data = {
  //   isLogoAdded : true,
  //   companyLogo : event.target.files[0],
  //   id : id,
  // }
  // this.defaultService.update_cart(data).subscribe((res) => {
  //   this.defaultService.get_cart(this.cart_id).subscribe((res) => {
  //     this.showLoading = false;
  //     this.currentProduct = res.data
  //     this.originalProduct = this.currentProduct ? JSON.parse(this.currentProduct.product) : {}
  //     this.imgBaseUrl = res.img_url
  //     this.closePopup()
  //     this.toastr.success(res.message);
  //   },
  //   (error) => {
  //     console.log(error)
  //     this.toastr.error(error);
  //     this.showLoading = false;
  //   })
  // })

  // this.isLogoAdded = true;
  // this.companyLogo = event.target.files[0]
  // this.addonlogoprice = this.currentProduct.addonlogoprice
  // this.totalAmount = this.baseprice+this.addonlogoprice+this.spareprice
  }

}
