import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import {RegisterService} from '../../services/register.service';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {CommonService} from '../../services/common.service';
import {DefaultService} from '../../services/default.service';

@Component({
  selector: 'app-buycard',
  templateUrl: './buycard.component.html',
  styleUrls: ['./buycard.component.css']
})
export class BuycardComponent implements OnInit {
  showFootNote: boolean = false;
  public flexRadioDefault:any=''
  public showLoading = false
  public prouctList:any=[]
  public imgBaseUrl:any=''
  public selectedCardImg = ''
  public cardNameUser = ''
  public cardUsrFirstName = ''
  public cardUsrLastName = ''
  public companyName = ''
  public isLogoAdded:boolean= false;
  public isSparePartAdded:boolean= false;
  public selectedColor = 'classic'
  public companyLogo:any = ''
  public totalAmount:any = 0;
  public baseprice:any = 0
  public addonlogoprice:any = 0
  public spareprice:any = 0
  public currentProduct:any={}
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
      this.prouctList = res.data
      this.flexRadioDefault = res.data[0].name
      this.imgBaseUrl = res.img_url
      this.getImage(this.flexRadioDefault)
    },
    (error) => {
      console.log(error)
      this.toastr.error(error);
      this.showLoading = false;
    })
  }
  getImage(modelname:any=''){
    console.log(modelname)
    modelname = modelname.toLowerCase()
    this.prouctList.forEach((element:any) => {
      if((element.name).toLowerCase() == modelname){
        this.selectedCardImg = this.imgBaseUrl+element.image
        this.baseprice = element.baseprice
        this.totalAmount = this.baseprice+this.addonlogoprice+this.spareprice
        this.currentProduct = element
      }
      console.log(this.selectedCardImg)
    });
  }
  printName(){
    this.cardNameUser = this.cardUsrFirstName +' '+ this.cardUsrLastName
    this.companyName = this.companyName
  }
  makeid(lengths:any) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < lengths) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
      return result;
  }
  addtoCart(){
    let elementRefList = [];
    let errors = false;

    let firstName:any = document.querySelector('#myInput');
    if(!this.cardUsrFirstName.trim()) {
      errors = true;
      elementRefList.push(document.querySelector("#myInput"));
    } 
    else if(firstName.parentElement.classList.contains('error')) {
      errors = true;
    }
    else {
      this.commonService.parentHasClassError(document.querySelector("#myInput"), 'error')
    }

    let lastName:any = document.querySelector('#Inputname');
    if(!this.cardUsrLastName.trim()) {
      errors = true;
      elementRefList.push(document.querySelector("#Inputname"));
    } 
    else if(lastName.parentElement.classList.contains('error')) {
      errors = true;
    }
    else {
      this.commonService.parentHasClassError(document.querySelector("#Inputname"), 'error')
    }
    if(this.isLogoAdded && !this.companyLogo){
      this.toastr.error('Please select company logo');
      return
    }

    console.log("1",errors)

    if(errors) {
      elementRefList.forEach(v => {
        this.commonService.addDomElement(v, 'error', 'errorMsg', "This field is required");
      })
      return false;
    } else {
      let unique_id:any = this.makeid(32);
      let data = {
        unique_id:unique_id,
        cardUsrFirstName : this.cardUsrFirstName,
        cardUsrLastName : this.cardUsrLastName,
        cardNameUser : this.cardNameUser,
        companyName : this.companyName,
        islogoAdded : this.isLogoAdded,
        isSparePartAdded : this.isSparePartAdded,
        selectedColor : this.selectedColor,
        companyLogo : this.companyLogo,
        product : JSON.stringify(this.currentProduct),
        product_id : this.currentProduct._id,
        amount : this.totalAmount,
      }
      this.showLoading = true;
      this.defaultService.addtoCart(data).subscribe((res) => {
        this.showLoading = false;
        if(res.success === true){
          console.log("res.message",res.message)
          this.router.navigateByUrl('/frame/'+unique_id);
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
  importLogo(event:any) {
    if (event.target.files.length == 0) {
        console.log("No file selected!");
        return
    }
    this.isLogoAdded = true;
    this.companyLogo = event.target.files[0]
    this.addonlogoprice = this.currentProduct.addonlogoprice
    this.totalAmount = this.baseprice+this.addonlogoprice+this.spareprice
    
    console.log(this.companyLogo)
    //$(event.target).closest('div').find('header').text(event.target.files[0].name)
  }
  importDoc(event:any) {
    if (event.target.files.length == 0) {
        console.log("No file selected!");
        return
    }
    this.selectedColor = event.target.files[0]
    $(event.target).closest('div.customize-card').find('p').text(event.target.files[0].name)
  }
  calculatePrice() {
    this.addonlogoprice = this.currentProduct.addonlogoprice
    this.spareprice = this.currentProduct.sparecardprice
    this.baseprice = this.currentProduct.baseprice

    this.totalAmount = this.baseprice

    if(this.isLogoAdded){
      this.totalAmount = this.totalAmount+this.addonlogoprice
    }

    if(this.isSparePartAdded){
      this.totalAmount = this.totalAmount+this.spareprice
    }
    if(this.isLogoAdded){
      this.showFootNote = true
    }else{
      this.showFootNote = false
    }
  }


}
