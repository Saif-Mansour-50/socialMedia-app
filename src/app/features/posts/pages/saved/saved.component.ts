import { Component, inject } from '@angular/core';
import { PostsService } from '../../models/posts.service';
import { Ipost } from '../../models/Ipost/ipost.interface';
import { PostCardComponent } from '../../components/post-card/post-card.component';

@Component({
  selector: 'app-saved',
  imports: [PostCardComponent],
  templateUrl: './saved.component.html',
  styleUrl: './saved.component.css',
})
export class SavedComponent {
  private readonly postsService = inject(PostsService);

  postList: Ipost[] = [];

  userId: string = '';

  ngOnInit(): void {
    this.savedPost();
  }

  refreshPosts(): void {
    this.savedPost();
  }

  savedPost() {
    this.postsService.getsavePost().subscribe({
      next: (res) => {
        this.postList = res.data.bookmarks;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
