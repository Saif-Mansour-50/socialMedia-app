import { Component, inject, Input, OnInit } from '@angular/core';
import { CommentsService } from '../../../core/services/comments/comments.service';
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

  commentList: Icomment[] = [];

  ngOnInit(): void {
    this.getPostComment();
  }

  getPostComment() {
    this.commentsService.getPostComments(this.postId).subscribe({
      next: (res) => {
        if (res.success) {
          // console.log(res);

          this.commentList = res.data.comments;
          console.log(this.commentList);
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
