import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {catchError, map, retry} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DefaultService {
  
  constructor(private http: HttpClient) { 

   
  }
  private baseUrl = environment.url;
  private baseApi = environment.base_api;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    })
  };
  getProductList(currentParent:any=''): Observable<any> {
    return this.http.get<any>(this.baseApi+'products', this.httpOptions)
      .pipe(map((res:any)=>{
        return res
      }))
  }
  getMenuItems(currentParent:any=''): Observable<any> {
    return this.http.get<any>(this.baseApi+'nav-course-menu', this.httpOptions)
      .pipe(map((res:any)=>{
        return res
      }))
  }
  getHomeSlider(currentParent:any=''): Observable<any> {
    return this.http.get<any>(this.baseApi+'home-slider', this.httpOptions)
      .pipe(map((res:any)=>{
        return res
      }))
  }
  getHomeCourses(currentParent:any=''): Observable<any> {
    return this.http.get<any>(this.baseApi+'home-page-course', this.httpOptions)
      .pipe(map((res:any)=>{
        return res
      }))
  }
  getHomeCategories(currentParent:any=''): Observable<any> {
    return this.http.get<any>(this.baseApi+'home-category', this.httpOptions)
      .pipe(map((res:any)=>{
        return res
      }))
  }
  getCMSPageContent(page:string): Observable<any> {
    return this.http.get<any>(this.baseApi+'page/'+page, this.httpOptions)
      .pipe(map((res:any)=>{
        return res
      }))
  }
  getSettingContent(): Observable<any> {
    return this.http.get<any>(this.baseApi+'setting', this.httpOptions)
      .pipe(map((res:any)=>{
        return res
      }))
  }
  
  submitChatForm(data:any): Observable<any> {
    //this.httpOptions.headers.set('Content-Type', 'application/json; charset=utf-8');

    return this.http.post<any>(this.baseApi,data, this.httpOptions)
      .pipe(map((res:any)=>{
        return res
      }))
  }
  saveNewsletter(data:any): Observable<any> {
    data = convertData(data);
    return this.http.post<any>(this.baseApi+'save-newsletter',data, this.httpOptions)
      .pipe(map((res:any)=>{
        
        return res
      }))
  }
  contactEnquiry(data:any): Observable<any> {
    data = convertData(data);
    return this.http.post<any>(this.baseApi+'contact_us',data,this.httpOptions)
      .pipe(map((res:any)=>{
        
        return res
      }))
  }
  getCourses(data:any,page:Number): Observable<any> {
    data = convertData(data);
    return this.http.post<any>(this.baseApi+'all-courses?page='+page,data,this.httpOptions)
      .pipe(map((res:any)=>{
        
        return res
      }))
  }
  getCourseDetails(data:any): Observable<any> {
    data = convertData(data);
    return this.http.post<any>(this.baseApi+'course-details',data,this.httpOptions)
      .pipe(map((res:any)=>{
        
        return res
      }))
  }
  myCourseDetails(data:any): Observable<any> {
    data = convertData(data);
    return this.http.post<any>(this.baseApi+'my-course-details',data,this.httpOptions)
      .pipe(map((res:any)=>{
        
        return res
      }))
  }
  saveRating(data:any): Observable<any> {
    data = convertData(data);
    return this.http.post<any>(this.baseApi+'give-rating',data,this.httpOptions)
      .pipe(map((res:any)=>{
        
        return res
      }))
  }
  reportVideo(data:any): Observable<any> {
    data = convertData(data);
    return this.http.post<any>(this.baseApi+'flag-video',data,this.httpOptions)
      .pipe(map((res:any)=>{
        
        return res
      }))
  }
  addtoCart(data:any): Observable<any> {
    let formDatad = convertFormData(data);
    return this.http.post<any>(this.baseApi+'add_cart',formDatad)
      .pipe(map((res:any)=>{
        
        return res
      }))
  }
  get_cart(cart_id:any=''): Observable<any> {
    return this.http.get<any>(this.baseApi+'get_cart/'+cart_id, this.httpOptions)
      .pipe(map((res:any)=>{
        return res
      }))
  }
  update_cart(data:any): Observable<any> {
    let formDatad = convertFormData(data);
    return this.http.post<any>(this.baseApi+'update_cart', formDatad)
      .pipe(map((res:any)=>{
        return res
      }))
  }
  order_with_razor_pay(data:any): Observable<any> {
    let formDatad = convertData(data);
    return this.http.post<any>(this.baseApi+'payment/order-with-rozorpay', formDatad,this.httpOptions)
      .pipe(map((res:any)=>{
        return res
      }))
  }
  update_payment_status(data:any): Observable<any> {
    let formDatad = convertData(data);
    return this.http.post<any>(this.baseApi+'payment/update_payment_status', formDatad,this.httpOptions)
      .pipe(map((res:any)=>{
        return res
      }))
  }
  check_coupon_code(data:any): Observable<any> {
    let formDatad = convertData(data);
    return this.http.post<any>(this.baseApi+'payment/check_coupon_code', formDatad,this.httpOptions)
      .pipe(map((res:any)=>{
        return res
      }))
  }
}

function convertData(data:any){
  let httpParams = new HttpParams();
  Object.keys(data).forEach(function (key) {
      httpParams = httpParams.append(key, data[key]);
  });
  return httpParams.toString();
}

function convertFormData(data:any){
  const formData = new FormData();
  Object.keys(data).forEach(function (key) {
    formData.append(key, data[key]);
  })
  return formData;
  // formData.append('image', image);

  // let httpParams = new HttpParams();
  // Object.keys(data).forEach(function (key) {
  //     httpParams = httpParams.append(key, data[key]);
  // });
  // return httpParams.toString();
}
