import { Component, inject, OnInit } from '@angular/core';
import { AsideFeedComponent } from '../../components/aside-feed/aside-feed.component';
import { SuggestedFriendsComponent } from '../../components/suggested-friends/suggested-friends.component';
import { SinglePostComponent } from '../../components/single-post/single-post.component';
import { PostsService } from '../../models/posts.service';
import { Ipost } from '../../models/Ipost/ipost.interface';
import { CreatPostComponent } from '../../components/creat-post/creat-post.component';

@Component({
  selector: 'app-my-posts',
  imports: [AsideFeedComponent, SuggestedFriendsComponent, CreatPostComponent],
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
        console.log('my prosts', this.postList);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
