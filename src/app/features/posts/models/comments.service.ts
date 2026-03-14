import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private readonly httpClient = inject(HttpClient);

  getPostComments(postId: any): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/posts/${postId}/comments`);
  }

  createComment(data: FormData, postId: any): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/posts/${postId}/comments`, data);
  }

  likecomment(postId: string, commentId: string): Observable<any> {
    return this.httpClient.put(
      `${environment.baseUrl}/posts/${postId}/comments/${commentId}/like`,
      {},
    );
  }

  replayComment(postId: string, commentId: string, formData: FormData): Observable<any> {
    return this.httpClient.post(
      `${environment.baseUrl}/posts/${postId}/comments/${commentId}/replies`,
      formData,
    );
  }

  deleteComment(postId: string, commentId: string): Observable<any> {
    return this.httpClient.delete(`${environment.baseUrl}/posts/${postId}/comments/${commentId}`);
  }

  editComment(postId: string, commentId: string, formData: FormData): Observable<any> {
    return this.httpClient.put(
      `${environment.baseUrl}/posts/${postId}/comments/${commentId}`,
      formData,
    );
  }
}
