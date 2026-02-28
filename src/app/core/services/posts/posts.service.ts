import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  // headerToken: any;

  // constructor() {
  //   this.setHeaderToken();
  // }
  // private readonly id = inject(PLATFORM_ID);

  // setHeaderToken() {
  //   if (isPlatformBrowser(this.id)) {
  //     this.headerToken = {
  //       headers: {
  //         authorization: `Bearer ${localStorage.getItem('token')}`,
  //       },
  //     };
  //   }
  // }

  private readonly httpClient = inject(HttpClient);

  getAllPosts(): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/posts`);
  }

  createPost(data: any): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/posts`, data);
  }

  getSinglePost(postId: any): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/posts/${postId}`);
  }
}
