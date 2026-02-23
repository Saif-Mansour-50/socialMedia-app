import { Component, inject, Input, OnInit } from '@angular/core';
import { Ipost } from '../../../app/core/models/Ipost/ipost.interface';
import { PostsService } from '../../../app/core/services/posts/posts.service';
import { CommentsComponent } from '../comments/comments.component';

@Component({
  selector: 'app-single-post',
  imports: [CommentsComponent],
  templateUrl: './single-post.component.html',
  styleUrl: './single-post.component.css',
})
export class SinglePostComponent implements OnInit {
  private readonly postsService = inject(PostsService);

  postList: Ipost[] = [];

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
}
