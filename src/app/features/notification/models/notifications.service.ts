import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private readonly httpClient = inject(HttpClient);

  getNotifications(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + '/notifications?unread=false&page=1&limit=10');
  }

  GetUnreadCount(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `/notifications/unread-count`);
  }
}
