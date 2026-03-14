import { Component, inject, OnInit } from '@angular/core';
import { NotificationsService } from '../../models/notifications.service';
import { Notification } from '../../models/notification.interface';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-notifications',

  imports: [RouterLinkActive, RouterLink, DatePipe],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css',
})
export class NotificationsComponent implements OnInit {
  private readonly notificationsService = inject(NotificationsService);

  notList: Notification[] = [];

  currentPage: number = 1;
  limit: number = 10;
  totalItems: number = 0;
  numberOfPages: number = 0;
  isLoading: boolean = false;

  UnreadCount: number = 0;

  ngOnInit(): void {
    this.getNotifications();
    this.getUnreadCount();
  }

  getNotifications(page: number = 1) {
    this.isLoading = true;
    this.notificationsService.getNotifications(page, this.limit).subscribe({
      next: (res) => {
        this.notList = res.data.notifications;
        this.currentPage = res.meta.pagination.currentPage;
        this.totalItems = res.meta.pagination.total;
        this.numberOfPages = res.meta.pagination.numberOfPages;
        this.isLoading = false;
      },
      error: (err) => {
        console.log('Error fetching notifications:', err);
        this.isLoading = false;
      },
    });
  }

  getUnreadCount() {
    this.notificationsService.GetUnreadCount().subscribe({
      next: (res) => {
        this.UnreadCount = res.data.unreadCount;
      },
      error: (err) => {
        console.log('Error fetching unread count:', err);
      },
    });
  }

  markNotificationAsRead(notificationId: string) {
    this.notificationsService.markNotificationAsRead(notificationId).subscribe({
      next: (res) => {
        this.getUnreadCount();

        this.getNotifications(this.currentPage);
      },
      error: (err) => {
        console.log('Error marking notification as read:', err);
      },
    });
  }

  markAllAsRead() {
    this.notificationsService.markAllAsRead().subscribe({
      next: (res) => {
        this.getUnreadCount();
        this.getNotifications(this.currentPage);
      },
      error: (err) => {
        console.log('Error marking all as read:', err);
      },
    });
  }

  nextPage() {
    if (this.currentPage < this.numberOfPages) {
      this.getNotifications(this.currentPage + 1);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.getNotifications(this.currentPage - 1);
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.numberOfPages) {
      this.getNotifications(page);
    }
  }

  getVisiblePages(): number[] {
    const visiblePages: number[] = [];
    const maxVisible = 3;

    if (this.numberOfPages <= maxVisible + 2) {
      for (let i = 1; i <= this.numberOfPages; i++) {
        visiblePages.push(i);
      }
      return visiblePages;
    }

    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.numberOfPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      visiblePages.push(i);
    }

    return visiblePages;
  }

  getNotificationMessage(notification: Notification): string {
    switch (notification.type) {
      case 'like':
        return 'liked your post';

      default:
        return 'interacted with your post';
    }
  }
}
