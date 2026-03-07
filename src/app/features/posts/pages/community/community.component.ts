import { Component, inject } from '@angular/core';
import { AsideFeedComponent } from '../../components/aside-feed/aside-feed.component';
import { SuggestedFriendsComponent } from '../../components/suggested-friends/suggested-friends.component';
import { Ipost } from '../../models/Ipost/ipost.interface';
import { PostsService } from '../../models/posts.service';
import { CreatPostComponent } from '../../components/creat-post/creat-post.component';

@Component({
  selector: 'app-community',
  imports: [AsideFeedComponent, SuggestedFriendsComponent, CreatPostComponent],
  templateUrl: './community.component.html',
  styleUrl: './community.component.css',
})
export class CommunityComponent {
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
