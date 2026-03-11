import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private readonly httpClient = inject(HttpClient);

  getNotifications(page: number = 1, limit: number = 10): Observable<any> {
    return this.httpClient.get(environment.baseUrl + '/notifications?unread=false&page=1&limit=10');
  }

  GetUnreadCount(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `/notifications/unread-count`);
  }
  markNotificationAsRead(notificationId: any): Observable<any> {
    return this.httpClient.patch(environment.baseUrl + `/notifications/${notificationId}/read`, {});
  }
  markAllAsRead(notificationId: any): Observable<any> {
    return this.httpClient.patch(environment.baseUrl + `/notifications/read-all`, {});
  }
}
