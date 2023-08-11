import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HeaderComponent } from './modules/common/header/header.component';
import { FooterComponent } from './modules/common/footer/footer.component';
import { AuthInterceptor } from './helper/authconfig.interceptor';
import { ErrorInterceptor } from './helper/error.interceptor';
import { RegisterComponent } from './modules/register/register.component';
import { InputValidatorDirective } from './directives/input-validator.directive';
import { EmailValidatorDirective } from './directives/email-validator.directive';
import {BroadcastingService} from './services/broadcasting.service';
import { PhoneValidationDirective } from './directives/phone-validation.directive';
import { LoginComponentComponent } from './modules/login-component/login-component.component';
import { CmsComponentComponent } from './modules/cms-component/cms-component.component';
import { ContactComponentComponent } from './modules/contact-component/contact-component.component';
import { AboutUsComponent } from './modules/about-us/about-us.component';
import { TermsConditionsComponent } from './modules/terms-conditions/terms-conditions.component';
import { PrivacyPolicyComponent } from './modules/privacy-policy/privacy-policy.component';
import { SafePipe } from './safe.pipe';
import { LogoutComponent } from './modules/logout/logout.component';
import { UserProfileComponent } from './modules/user-profile/user-profile.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { DateAgoPipe } from './pipes/pipes/date-ago.pipe';
import { MyLoaderComponent } from './modules/my-loader/my-loader.component';
import { LoaderService } from './services/loader.service';
import { LoaderInterceptor } from './interceptors/loader-interceptor.service';
import { RatingModule } from 'ng-starrating';
import { ForgotPasswordComponent } from './modules/forgot-password/forgot-password.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { SidebarComponent } from './modules/common/sidebar/sidebar.component';
import { AddRmComponent } from './modules/add-rm/add-rm.component';
import { ListRmComponent } from './modules/list-rm/list-rm.component';
import { CreateDealComponent } from './modules/create-deal/create-deal.component';
import { BusinessComponent } from './modules/business/business.component';
import { ProductComponent } from './modules/product/product.component';
import { SupportComponent } from './modules/support/support.component';
import { AmbassadorComponent } from './modules/ambassador/ambassador.component';
import { BuycardComponent } from './modules/buycard/buycard.component';
import { HowitworkComponent } from './modules/howitwork/howitwork.component';
import { TeamsComponent } from './modules/teams/teams.component';
import { CheckoutComponent } from './modules/checkout/checkout.component';
import { FrameComponent } from './modules/frame/frame.component';


@NgModule({
  declarations: [
    AppComponent,
    MyLoaderComponent,
    InputValidatorDirective,
    EmailValidatorDirective,
    HeaderComponent,
    FooterComponent,
    RegisterComponent,
    PhoneValidationDirective,
    LoginComponentComponent,
    CmsComponentComponent,
    ContactComponentComponent,
    AboutUsComponent,
    TermsConditionsComponent,
    PrivacyPolicyComponent,
    SafePipe,
    LogoutComponent,
    UserProfileComponent,
    DateAgoPipe,
    MyLoaderComponent,
    ForgotPasswordComponent,
    DashboardComponent,
    SidebarComponent,
    AddRmComponent,
    ListRmComponent,
    CreateDealComponent,
    BusinessComponent,
    ProductComponent,
    SupportComponent,
    AmbassadorComponent,
    BuycardComponent,
    HowitworkComponent,
    TeamsComponent,
    CheckoutComponent,
    FrameComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    CarouselModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
    RatingModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    BroadcastingService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
