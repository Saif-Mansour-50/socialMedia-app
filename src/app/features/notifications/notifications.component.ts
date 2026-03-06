import { Component, inject, OnInit } from '@angular/core';
import { NotificationsService } from '../../core/services/notifications/notifications.service';
import { Notification } from '../../core/models/notification/notification.interface';

@Component({
  selector: 'app-notifications',
  imports: [],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css',
})
export class NotificationsComponent implements OnInit {
  private readonly notificationsService = inject(NotificationsService);

  notList: Notification[] = [];

  ngOnInit(): void {
    this.notificationsService.getNotifications().subscribe({
      next: (res) => {
        this.notList = res.data.notifications;
        console.log('notification', this.notList);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
