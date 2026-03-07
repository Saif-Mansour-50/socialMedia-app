import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../environments/environment.development';
import { Ipost } from './Ipost/ipost.interface';
import { ServerResponse } from '../../../core/models/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private readonly httpClient = inject(HttpClient);

  isLoading = signal(false);

  postList = signal<Ipost[]>([]);

  getAllPosts() {
    return this.httpClient.get<any>(`${environment.baseUrl}/posts`).subscribe({
      next: (res) => {
        const response = res.data.posts.map((post: Ipost) => ({
          ...post,
          timeAgo: this.getTimeAgo(post.createdAt),
        }));

        this.postList.set(response);
        this.isLoading.set(false);
      },
    });
  }

  createPost(data: FormData) {
    return this.httpClient.post<ServerResponse<{ post: Ipost }>>(
      `${environment.baseUrl}/posts`,
      data,
    );
  }

  getSinglePost(postId: any) {
    return this.httpClient.get<any>(`${environment.baseUrl}/posts/${postId}`);
  }

  getTimeAgo(dateString: string): string {
    let different = Date.now() - new Date(dateString).getTime();

    let day = 1000 * 60 * 60 * 24;
    let hour = 1000 * 60 * 60;
    let minute = 1000 * 60;

    if (different >= day) {
      return `${Math.floor(different / day)}d`;
    }

    if (different >= hour) {
      return `${Math.floor(different / hour)}h`;
    }

    return `${Math.floor(different / minute)}m`;
  }

  deletePost(postId: any): Observable<any> {
    return this.httpClient.delete(environment.baseUrl + `/posts/${postId}`);
  }

  getMyProfile(): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/users/profile-data`);
  }

  // getUserPost(userId: any): Observable<any> {
  //   return this.httpClient.get(`${environment.baseUrl}/users/${userId}/posts`);
  // }

  getUserPost(userId: any): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/posts/feed?only=following&limit?`);
  }

  likePost(postId: any): Observable<any> {
    return this.httpClient.put(`${environment.baseUrl}/posts/${postId}/like`, null);
  }

  savePost(postId: any): Observable<any> {
    return this.httpClient.put(`${environment.baseUrl}/posts/${postId}/bookmark`, null);
  }
  getsavePost(postId: any): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/posts/${postId}/bookmark`);
  }

  sharePost(body: any, postId: any): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/posts/${postId}/share`, body);
  }

  editPost(postId: any, body: any): Observable<any> {
    return this.httpClient.put(`${environment.baseUrl}/posts/${postId}`, body);
  }
}
