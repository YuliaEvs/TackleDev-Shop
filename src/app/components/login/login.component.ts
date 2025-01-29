import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import myAppConfig from '../../config/my-app-config';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import OktaSignIn from '@okta/okta-signin-widget';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  oktaSignin: any;

  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth
  // ,
    // @Inject(PLATFORM_ID) private platformId: Object
    ){
    // if (typeof window !== 'undefined') {

      this.oktaSignin = new OktaSignIn({
        logo: 'assets/images/logo.png',
        baseUrl: myAppConfig.oidc.issuer.split('/auth2')[0],
        clientId: myAppConfig.oidc.clientId,
        redirectUrl: myAppConfig.oidc.redirectUrl,
        authParams: {
          pkce: true,
          issuer: myAppConfig.oidc.issuer,
          scopes: myAppConfig.oidc.scopes
        }
      });
    }

  ngOnInit(): void {

    this.oktaSignin.remove();

    // if (typeof window !== 'undefined') {
    //   if (isPlatformBrowser(this.platformId)) {
    //     import('@okta/okta-signin-widget').then(module => {
    //       const OktaSignIn = module.default;
    //       const oktaSignIn = new OktaSignIn({});
    //       oktaSignIn.renderEl({ el: '#okta-sign-in' });
    //     }).catch(err => console.error('Error loading Okta SignIn Widget:', err));
    //   };
      
      this.oktaSignin.renderEl({
        el: '#okta-sign-in-widget'},
        (response: any) => {
          if (response.status === 'SUCCESS') {
            this.oktaAuth.signInWithRedirect();
          }
        },
        (error: any) => {
          throw error;
        }
      );
    }
  }

