import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {RegisterComponent} from './modules/register/register.component';
import {AuthGuard} from './guards/auth.guard';
import { AuthService } from './services/auth.service';
import { LoginComponentComponent } from './modules/login-component/login-component.component';
import { ForgotPasswordComponent } from './modules/forgot-password/forgot-password.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { AddRmComponent } from './modules/add-rm/add-rm.component';
import { ListRmComponent } from './modules/list-rm/list-rm.component';
import { CreateDealComponent } from './modules/create-deal/create-deal.component';
import { AboutUsComponent } from './modules/about-us/about-us.component';
// import { CmsComponentComponent } from './modules/cms-component/cms-component.component';
import { ContactComponentComponent } from './modules/contact-component/contact-component.component';
// import { BlogComponent } from './modules/blog/blog.component';
import { TermsConditionsComponent } from './modules/terms-conditions/terms-conditions.component';
import { PrivacyPolicyComponent } from './modules/privacy-policy/privacy-policy.component';
// import { LogoutComponent } from './modules/logout/logout.component';
import { UserProfileComponent } from './modules/user-profile/user-profile.component';
import { BusinessComponent } from './modules/business/business.component';
import { ProductComponent } from './modules/product/product.component';
import { SupportComponent } from './modules/support/support.component';
import { AmbassadorComponent } from './modules/ambassador/ambassador.component';
import { BuycardComponent } from './modules/buycard/buycard.component';
import { HowitworkComponent } from './modules/howitwork/howitwork.component';
import { TeamsComponent } from './modules/teams/teams.component';
import { CheckoutComponent } from './modules/checkout/checkout.component';
import { FrameComponent } from './modules/frame/frame.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  },
  {
    path: 'business',
    component: BusinessComponent
  },
  {
    path: 'checkout/:id',
    component: CheckoutComponent
  },
  {
    path: 'frame/:id',
    component: FrameComponent
  },
  {
    path: 'product',
    component: ProductComponent
  },
  {
    path: 'support',
    component: SupportComponent
  },
  {
    path: 'ambassador',
    component: AmbassadorComponent
  },
  {
    path: 'buycard',
    component: BuycardComponent
  },
  {
    path: 'howitwork',
    component: HowitworkComponent
  },
  {
    path: 'teams',
    component: TeamsComponent
  },
  {
    path: 'login',
    component: LoginComponentComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'add_relationship_manager.html',
    //canActivate:[AuthGuard],
    component: AddRmComponent
  },
  {
    path: 'list_rm.html',
    //canActivate:[AuthGuard],
    component: ListRmComponent
  },
  {
    path: 'create-deal.html',
    //canActivate:[AuthGuard],
    component: CreateDealComponent
  },
  {
    path: 'terms-conditions',
    component: TermsConditionsComponent
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent
  },
  {
    path: 'user-profile',
    canActivate:[AuthGuard],
    component: UserProfileComponent
  },
  {
    path: 'my-orders',
    canActivate:[AuthGuard],
    component: ListRmComponent
  },
  {
    path: 'about',
    component: AboutUsComponent
  },
  {
    path: 'contact-us',
    component: ContactComponentComponent
  },
  // {
  //   path: 'blogs',
  //   component: BlogComponent
  // },
  // {
  //   path: 'cms/:type',
  //   component: CmsComponentComponent
  // },
  // {
  //   path: 'logout',
  //   canActivate:[AuthGuard],
  //   component: LogoutComponent
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthService, AuthGuard,],
})
export class AppRoutingModule { }
