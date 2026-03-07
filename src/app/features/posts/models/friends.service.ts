import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class FriendsService {
  private readonly httpClient = inject(HttpClient);

  getFrindesSuggestition(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + '/users/suggestions?limit=6');
  }

  followFriend(id: string): Observable<any> {
    return this.httpClient.put(environment.baseUrl + `/users/${id}/follow`, null);
  }
}
