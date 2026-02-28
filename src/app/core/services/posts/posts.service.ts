import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
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
