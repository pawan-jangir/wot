import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Injectable,PLATFORM_ID,Inject } from '@angular/core';
import {Router} from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {catchError, map, retry} from 'rxjs/operators';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.url + '/api';
  private baseApi = environment.base_api;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      //'Access-Control-Allow-Origin': '*',
    })
  };
  private authTokenSubject: BehaviorSubject<any>;
  private APIauthToken: BehaviorSubject<any>;
  private APIauthTokenExpireAt: BehaviorSubject<any>;
  private websiteData: BehaviorSubject<any>;
  private currentAuthUser: BehaviorSubject<any>;
  constructor(private http: HttpClient, private router: Router,@Inject(PLATFORM_ID) private platformId: Object) {
    this.websiteData = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('websiteData') || 'null'));
    this.authTokenSubject = new BehaviorSubject<any>(localStorage.getItem('auth_token'));
    this.APIauthToken = new BehaviorSubject<any>(localStorage.getItem('api_auth_token'));
    this.APIauthTokenExpireAt = new BehaviorSubject<any>(localStorage.getItem('api_auth_token_expire_at'));
    this.currentAuthUser = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('current_auth_user') || 'null'));
  }
  get getToken(): any {
    let token:any;
		let tokenExpireTime:any;
		if(isPlatformBrowser(this.platformId)) {
			let  userToken =  localStorage.getItem('auth_token');
      
			if (typeof userToken != 'undefined' && userToken != null) {		    			
				token	=	userToken;
			}
			tokenExpireTime	=		 localStorage.getItem('refresh_token_time'); 
		}
		
		let  curentTime			= 		new Date().getTime();
		let  isTokenExpired:boolean = true;
		if(tokenExpireTime < curentTime && token != '' && token != null)
		{
			isTokenExpired  = true;
		}
    return token
		if (!isTokenExpired) {
			return token
		}
		return this.refreshTokenData();

    //return this.authTokenSubject.value;
  }
  get getAPIToken(): any {
    let token:any;
		let tokenExpireTime:any;
		if(isPlatformBrowser(this.platformId)) {
			let  userToken =  localStorage.getItem('api_auth_token');
      
			if (typeof userToken != 'undefined' && userToken != null) {		    			
				token	=	userToken;
			}
			tokenExpireTime	=		 localStorage.getItem('api_auth_token_expire_at'); 
		}
		
		let  curentTime			= 		new Date().getTime();
		let  isTokenExpired:boolean = true;
		if(tokenExpireTime < curentTime && token != '' && token != null)
		{
			isTokenExpired  = true;
		}
		if (!isTokenExpired) {
			return token
		}
		return this.authorization();

    //return this.authTokenSubject.value;
  }
  refreshTokenData() {
    // append refresh token if you have one
    let refreshToken      = localStorage.getItem('refresh_token'); 
    let refreshTokenTime  = Number(localStorage.getItem('refresh_token_time')); 
    let authToken         = localStorage.getItem('auth_token');
    var currentTimeStamp       = new Date().getTime();

    if(currentTimeStamp > refreshTokenTime){
      let sendData={
        refreshToken : refreshToken,
        authToken : authToken,
      }
      return this.http.post<any>(this.baseUrl+'/refresh_token', sendData,this.httpOptions).toPromise().then(res => {
        if(res.success == true){
          let currentTime = new Date();
          currentTime.setSeconds(currentTime.getSeconds() + (res.data.tokenExpirationTimeSec-120));
          //currentTime.setSeconds(currentTime.getSeconds() + 300);
          let  tokenExpireTime:any			= 		new Date(currentTime).getTime();
          localStorage.setItem('auth_token', JSON.stringify(res.data.token));
          localStorage.setItem('refresh_token', JSON.stringify(res.data.refreshToken));
          localStorage.setItem('refresh_token_time', tokenExpireTime);
          this.authTokenSubject.next(res.data.token);
        }
        return res
      })
    }
  }
  get getRefreshToken(): any {
    return localStorage.getItem('refresh_token'); 
  }
  get getAuthToken(): any {
    return localStorage.getItem('auth_token'); 
  }
  get getAPIAuthToken(): any {
    return localStorage.getItem('api_auth_token'); 
  }
  get getRefreshTokenTime(): any {
    return localStorage.getItem('refresh_token_time'); 
  }
  get getCurrentAuthUser(): any {
    return JSON.parse(localStorage.getItem('current_user') || 'null'); 
  }
  get isLoggedIn() {
    const authToken = this.authTokenSubject.value;
    return authToken != null;
  }
  get getWebsiteData(): any {
    return this.websiteData.value
  }
  authorization(): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.get<any>(this.baseApi+'auth/token_generate', httpOptions)
      .pipe(map((res:any)=>{
        if(res && res.result && res.result.success){
          let tokenResponse = res.result.result;
         
          localStorage.setItem('api_auth_token', tokenResponse.token);
          this.APIauthToken.next(tokenResponse.token);

          localStorage.setItem('api_auth_token_expire_at', tokenResponse.expireAt);
          this.APIauthTokenExpireAt.next(tokenResponse.expireAt);
          return tokenResponse.token
        }else{
          return '';
        }
        
      }))
  }
  login(data:any): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.post<any>(this.baseApi+'login',data, httpOptions)
      .pipe(map((res:any)=>{
        if(res && res.success){
          let tokenResponse = res.data.TokenAndRefreshToken.original;
          let user = {
            email : res.data.email,
            name : res.data.name,
          };
          localStorage.setItem('current_user', JSON.stringify(user));
          localStorage.setItem('auth_token', tokenResponse.access_token);
          this.currentAuthUser.next(user);
          this.authTokenSubject.next(tokenResponse.access_token);
        }
        return res
      }))
  }
  signup(data:any): Observable<any> {
    let finalData = convertFormData(data);
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'api-token': 'application/json',
      })
    };
    return this.http.post<any>(this.baseApi+'auth/register',finalData)
      .pipe(map((res:any)=>{
        if(res && res.success){
          localStorage.setItem('current_user', JSON.stringify(res.data));
          localStorage.setItem('auth_token', res.token);
          this.currentAuthUser.next(res.data);
          this.authTokenSubject.next(res.token);
        }
        return res
      }))
  }
  signupStepTwo(data:any): Observable<any> {
    let finalData = convertFormData(data);
    return this.http.post<any>(this.baseApi+'auth/update_business_profile',finalData)
      .pipe(map((res:any)=>{
        if(res && res.success){
          localStorage.setItem('current_user', JSON.stringify(res.data));
        }
        return res
      }))
  }
  signupStepThree(data:any): Observable<any> {
    let finalData = convertFormData(data);
    return this.http.post<any>(this.baseApi+'auth/update_bank_details',finalData)
      .pipe(map((res:any)=>{
        if(res && res.success){
          localStorage.setItem('current_user', JSON.stringify(res.data));
        }
        return res
      }))
  }
  signupStepFour(data:any): Observable<any> {
    let finalData = convertFormData(data);
    return this.http.post<any>(this.baseApi+'auth/update_other_details',finalData)
      .pipe(map((res:any)=>{
        if(res && res.success){
          localStorage.setItem('current_user', JSON.stringify(res.data));
        }
        return res
      }))
  }
  signupStepFive(data:any): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'api-token': 'application/json',
      })
    };
    return this.http.post<any>(this.baseApi+'auth/update_concent',data,httpOptions)
      .pipe(map((res:any)=>{
        if(res && res.success){
          localStorage.setItem('current_user', JSON.stringify(res.data));
        }
        return res
      }))
  }
  get_bank_list(): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.get<any>(this.baseApi+'auth/get_bank_list',httpOptions)
      .pipe(map((res:any)=>{
        return res
      }))
  }
  get_escript_type_list(): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.get<any>(this.baseApi+'auth/get_escript_types',httpOptions)
      .pipe(map((res:any)=>{
        return res
      }))
  }
  get_escript_port_list(): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.get<any>(this.baseApi+'auth/get_escript_port_codes',httpOptions)
      .pipe(map((res:any)=>{
        return res
      }))
  }
  get_users_by_type(type:any,searchText:any): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.get<any>(`${this.baseApi}auth/list_users_by_type?type=${type}&search_text=${searchText}`,httpOptions)
      .pipe(map((res:any)=>{
        return res
      }))
  }
  create_deal_one(data:any): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.post<any>(`${this.baseApi}create_deal_one`,data,this.httpOptions)
      .pipe(map((res:any)=>{
        return res
      }))
  }
  create_deal_two(data:any): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.post<any>(`${this.baseApi}create_deal_two`,data,this.httpOptions)
      .pipe(map((res:any)=>{
        return res
      }))
  }
  create_deal_three(data:any,calculation:any): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    data.final_calculation = calculation;
    return this.http.post<any>(`${this.baseApi}create_deal_three`,data,this.httpOptions)
      .pipe(map((res:any)=>{
        return res
      }))
  }
  create_deal_four(data:any): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    
    return this.http.post<any>(`${this.baseApi}create_deal_four`,data,this.httpOptions)
      .pipe(map((res:any)=>{
        return res
      }))
  }
  get_deal_details(deal_id:any): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.get<any>(`${this.baseApi}get_deal_details?deal_id=${deal_id}`,this.httpOptions)
      .pipe(map((res:any)=>{
        return res
      }))
  }
  verifyPhoneEmail(data:any): Observable<any> {
    return this.http.post<any>(this.baseApi+'auth/check_email_phone_exist',data,this.httpOptions)
      .pipe(map((res:any)=>{
        return res
      }))
  }
  logOut(deleteCurrentUser:boolean=true){
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
    this.getLogOut(deleteCurrentUser).then((data) => {
    }).catch((err) => {
      console.log(err);
    });
  }
  addRM(data:any): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'api-token': 'application/json',
      })
    };
    return this.http.post<any>(this.baseApi+'auth/add_rm',data)
      .pipe(map((res:any)=>{
        return res
      }))
  }
  listRM(data:any): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'api-token': 'application/json',
      })
    };
    return this.http.post<any>(this.baseApi+'auth/list_rm',data)
      .pipe(map((res:any)=>{
        return res
      }))
  }
  getProfileDetails(): Observable<any> {
    let token = this.getAuthToken;
    return this.http.get<any>(this.baseApi+'profile', this.httpOptions)
      .pipe(map((res:any)=>{
        return res
      }))
  }
  get_user_details(user_id:any): Observable<any> {
    let token = this.getAuthToken;
    return this.http.get<any>(this.baseApi+'get_user_details?user_id='+user_id, this.httpOptions)
      .pipe(map((res:any)=>{
        return res
      }))
  }
  read_escript_data(data:any): Observable<any> {
    return this.http.post<any>(this.baseApi+'auth/read_escript_data',data)
    .pipe(map((res:any)=>{
      return res
    }))
  }
  updateProfile(data:any): Observable<any> {
    data = convertData(data);
    return this.http.post<any>(this.baseApi+'change-profile',data, this.httpOptions)
      .pipe(map((res:any)=>{
        return res
      }))
  }
  updatePassword(data:any): Observable<any> {
    data = convertData(data);
    return this.http.post<any>(this.baseApi+'change_password',data, this.httpOptions)
      .pipe(map((res:any)=>{
        return res
      }))
  }
  updateProfilePhoto(image:File): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
      })
    };
    const formData = new FormData();

    formData.append('image', image);
    return this.http.post<any>(this.baseApi+'change-profile-image',formData,httpOptions)
      .pipe(map((res:any)=>{
        return res
      }))
  }
  getCheckoutDetails(data:any): Observable<any> {
    data = convertData(data);
    return this.http.post<any>(this.baseApi+'checkout',data,this.httpOptions)
      .pipe(map((res:any)=>{
        
        return res
      }))
  }
  processPayment(data:any): Observable<any> {
    data = convertData(data);
    return this.http.post<any>(this.baseApi+'payment',data,this.httpOptions)
      .pipe(map((res:any)=>{
        
        return res
      }))
  }
  getMyTransactions(): Observable<any> {
    let token = this.getAuthToken;
    return this.http.post<any>(this.baseApi+'my-payment', this.httpOptions)
      .pipe(map((res:any)=>{
        return res
      }))
  }
  getMyCourses(): Observable<any> {
    let token = this.getAuthToken;
    return this.http.post<any>(this.baseApi+'my-courses', this.httpOptions)
      .pipe(map((res:any)=>{
        return res
      }))
  }
  private getLogOut(deleteCurrentUser:boolean=true) {
    return new Promise(resolve => {
      this.authTokenSubject.next(null);
      this.websiteData.next(null);
      this.currentAuthUser.next(null);
      window.location.href= '/login'
      
      resolve("done");
    })
  }

  setGlobalParent(data:any){
    localStorage.setItem('current_global_parent', data);
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

