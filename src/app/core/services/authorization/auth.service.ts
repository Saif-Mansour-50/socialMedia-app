import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);

  private readonly router = inject(Router);

  signup(data: any): Observable<any> {
    return this.httpClient.post(environment.baseUrl + '/users/signup', data);
  }
  signin(data: any): Observable<any> {
    return this.httpClient.post(environment.baseUrl + '/users/signin', data);
  }

  logOut() {
    this.router.navigate(['/login']);

    localStorage.removeItem('token');
  }

  changePassword(data: any): Observable<any> {
    return this.httpClient.patch(environment.baseUrl + '/users/change-password', data);
  }

  sharePost(postId: any): Observable<any> {
    return this.httpClient.post(environment.baseUrl + `/posts/${postId}/share`, null);
  }
}
