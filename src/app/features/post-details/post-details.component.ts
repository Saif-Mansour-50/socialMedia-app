import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CommentsComponent } from '../../shared/components/comments/comments.component';
import { PostsService } from '../../core/services/posts/posts.service';
import { Ipost } from '../../core/models/Ipost/ipost.interface';

@Component({
  selector: 'app-post-details',
  imports: [CommentsComponent],
  templateUrl: './post-details.component.html',
  styleUrl: './post-details.component.css',
})
export class PostDetailsComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly postsService = inject(PostsService);

  postId: any;

  post!: Ipost;

  ngOnInit(): void {
    this.getPostIdFromRoute();
  }

  getPostIdFromRoute() {
    this.activatedRoute.paramMap.subscribe((urlPath) => {
      this.postId = urlPath.get('id');
      this.getPostDetails();
    });
  }

  getPostDetails() {
    this.postsService.getSinglePost(this.postId).subscribe({
      next: (res) => {
        console.log(res);
        this.post = res.data.post;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
