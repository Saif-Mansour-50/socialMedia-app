import { Component, inject, OnInit } from '@angular/core';

import { Ipost } from '../../models/Ipost/ipost.interface';
import { PostsService } from '../../models/posts.service';
import { PostCardComponent } from '../../components/post-card/post-card.component';

@Component({
  selector: 'app-my-posts',
  imports: [PostCardComponent],
  templateUrl: './my-posts.component.html',
  styleUrl: './my-posts.component.css',
})
export class MyPostsComponent implements OnInit {
  private readonly postsService = inject(PostsService);

  postList: Ipost[] = [];

  userId: string = '';

  ngOnInit(): void {
    this.userId = JSON.parse(localStorage.getItem('userData')!)._id;
    this.profilePost();
  }

  profilePost() {
    this.postsService.getUserPost(this.userId).subscribe({
      next: (res) => {
        this.postList = res.data.posts;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  refreshPosts(): void {
    this.profilePost();
  }
}
