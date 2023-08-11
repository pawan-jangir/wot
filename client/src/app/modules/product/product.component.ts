import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import {RegisterService} from '../../services/register.service';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {CommonService} from '../../services/common.service';
import {DefaultService} from '../../services/default.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items:1
      }
    },
    nav: true
  }
  public sliders1:any=[
    {
      name : 'asdf',
    },
    {
      name : '2',
    },
    {
      name : '3',
    }
  ]
  public showLoading = false
  public prouctList:any=[]
  public imgBaseUrl:any=''

  constructor(
    private register: RegisterService,
    private auth: AuthService,
    private router: Router,
    private commonService: CommonService,
    private toastr: ToastrService,
    private defaultService: DefaultService,

  ) { }

  ngOnInit(): void {
    this.defaultService.getProductList().subscribe((res) => {
      this.showLoading = false;
      //this.router.navigateByUrl('/user-profile');
      this.prouctList = res.data
      this.imgBaseUrl = res.img_url
      // this.toastr.success(res.message, '');
      // console.log(this.prouctList)
    },
    (error) => {
      console.log(error)
      this.toastr.error(error);
      this.showLoading = false;
    }
    )
  }

}
