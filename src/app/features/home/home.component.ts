import { Component, inject } from '@angular/core';

import { CreatPostComponent } from '../../shared/components/creat-post/creat-post.component';
import { PostsService } from '../../core/services/posts/posts.service';
import { SinglePostComponent } from '../../shared/components/single-post/single-post.component';

@Component({
  selector: 'app-home',
  imports: [CreatPostComponent, SinglePostComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  protected readonly postsService = inject(PostsService);
}
