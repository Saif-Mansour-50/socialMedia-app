import { Component, inject } from '@angular/core';
import { Ipost } from '../../models/Ipost/ipost.interface';
import { PostsService } from '../../models/posts.service';
import { PostCardComponent } from '../../components/post-card/post-card.component';

@Component({
  selector: 'app-community',
  imports: [PostCardComponent],
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

  refreshPosts(): void {
    console.log('Refreshing posts...');
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
