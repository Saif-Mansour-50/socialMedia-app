import { Component, inject } from '@angular/core';
import { PostsService } from '../../models/posts.service';
import { Ipost } from '../../models/Ipost/ipost.interface';

@Component({
  selector: 'app-saved',
  imports: [],
  templateUrl: './saved.component.html',
  styleUrl: './saved.component.css',
})
export class SavedComponent {
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
    this.postsService.savePost(this.userId).subscribe({
      next: (res) => {
        this.postList = res.data.posts;
        console.log('my prosts saved', this.postList);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
