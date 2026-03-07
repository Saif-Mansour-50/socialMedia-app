import { CommentsService } from './../../../core/services/comments/comments.service';
import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { Icomment } from '../../../core/models/Icomment/icomment.interface';

@Component({
  selector: 'app-comments',
  imports: [],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css',
})
export class CommentsComponent implements OnInit {
  private readonly commentsService = inject(CommentsService);

  @Input({ required: true }) postId!: string;

  @Output() upDateComment: EventEmitter<any> = new EventEmitter();

  commentList: Icomment[] = [];

  constructor(private CommentsService: CommentsService) {}

  ngOnInit(): void {
    this.getPostComment();
  }

  getPostComment() {
    this.commentsService.getPostComments(this.postId).subscribe({
      next: (res) => {
        if (res.success) {
          this.commentList = res.data.comments;
          this.upDateComment.emit();
          console.log(this.commentList);
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  isModalOpen = signal<boolean>(false);
  selectedImage = signal<string | null>(null);

  openImageModal(imageUrl: string): void {
    this.selectedImage.set(imageUrl);
    this.isModalOpen.set(true);
  }

  closeImageModal(): void {
    this.isModalOpen.set(false);
    this.selectedImage.set(null);
  }

  getMinTimeUnit(timestamp: string): string {
    const now = new Date();
    const commentDate = new Date(timestamp);
    const diffMs = now.getTime() - commentDate.getTime();

    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays >= 1) {
      return `${diffDays}d`;
    } else if (diffHours >= 1) {
      return `${diffHours}h`;
    } else {
      return `${diffMinutes}m`;
    }
  }
}
