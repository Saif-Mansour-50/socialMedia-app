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
    return this.httpClient.get(environment.baseUrl + `/notifications/${notificationId}/read`);
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
}
