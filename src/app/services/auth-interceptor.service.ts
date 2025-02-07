import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OktaAuth } from '@okta/okta-auth-js';
import { from, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor( private oktaAuth: OktaAuth) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.handleAccess(request, next));
  }

  private async handleAccess(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
    
    //Only add an access token for secured endpoints
    const theEndpoint = environment.tackledevshopApiUrl + '/orders';
    const securedEndpoints = [theEndpoint];

    if (securedEndpoints.some(url => request.urlWithParams.includes(url))) {
       // Get access token
       const accessToken = await this.oktaAuth.getAccessToken();

       // Clone the request and add new header with accews token
       request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`
        }
       });
    }
    return next.handle(request).toPromise() as Promise<HttpEvent<any>>;
  }
}
