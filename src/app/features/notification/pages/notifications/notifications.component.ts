import { Component, inject, OnInit } from '@angular/core';
import { NotificationsService } from '../../models/notifications.service';
import { Notification } from '../../models/notification.interface';
import { RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-notifications',
  imports: [RouterLinkActive],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css',
})
export class NotificationsComponent implements OnInit {
  private readonly notificationsService = inject(NotificationsService);

  notList: Notification[] = [];

  UnreadCount: string = '';

  notificationId: string = '';

  ngOnInit(): void {
    this.getNotifications();
    this.GetUnreadCount();
  }

  getNotifications() {
    this.notificationsService.getNotifications().subscribe({
      next: (res) => {
        this.notList = res.data.notifications;
        console.log('getNotifications', res);
        // this.notificationId = res.data.notifications;-- id not fount :D :D :D
        // console.log('getNotifications', this.notificationId);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  GetUnreadCount() {
    this.notificationsService.GetUnreadCount().subscribe({
      next: (res) => {
        this.UnreadCount = res.data.unreadCount;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
