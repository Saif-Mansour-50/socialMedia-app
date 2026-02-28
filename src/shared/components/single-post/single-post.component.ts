import { Component, inject, Input, OnInit } from '@angular/core';
import { Ipost } from '../../../app/core/models/Ipost/ipost.interface';
import { PostsService } from '../../../app/core/services/posts/posts.service';
import { CommentsComponent } from '../comments/comments.component';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommentsService } from '../../../app/core/services/comments/comments.service';

@Component({
  selector: 'app-single-post',
  imports: [CommentsComponent, ReactiveFormsModule],
  templateUrl: './single-post.component.html',
  styleUrl: './single-post.component.css',
})
export class SinglePostComponent implements OnInit {
  private readonly postsService = inject(PostsService);
  private readonly commentsService = inject(CommentsService);

  postList: Ipost[] = [];

  commentValue: FormControl = new FormControl(null, [Validators.required]);

  ngOnInit(): void {
    this.getAllPosts();
  }

  getAllPosts() {
    this.postsService.getAllPosts().subscribe({
      next: (res) => {
        if (res.success) {
          this.postList = res.data.posts.map((post: Ipost) => ({
            ...post,
            timeAgo: this.getTimeAgo(post.createdAt),
          }));

          console.log(this.postList);
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
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

  creatComment(e: SubmitEvent, postId: any) {
    e.preventDefault();
    console.log('hello');
    if (this.commentValue.valid) {
      let formData = new FormData();

      formData.append('content', this.commentValue.value);

      this.commentsService.createComment(formData, postId).subscribe({
        next: (res) => {
          console.log(res);
          if (res.success) {
            this.commentValue.reset();

            // clear input value , getPostComments
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }
}
