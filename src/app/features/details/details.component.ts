import { Component, inject, OnInit } from '@angular/core';
import { PostsService } from '../../core/services/posts/posts.service';
import { ActivatedRoute } from '@angular/router';
import { Ipost } from '../../core/models/Ipost/ipost.interface';

@Component({
  selector: 'app-details',
  imports: [],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent implements OnInit {
  protected readonly postsService = inject(PostsService);
  protected readonly activatedRoute = inject(ActivatedRoute);

  postId: string = '';

  postDetails: Ipost = {} as Ipost;

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((param) => {
      console.log(param.get('id'));
      this.postId = param.get('id')!;
      this.getPostDetails();
    });
  }

  getPostDetails(): void {
    this.postsService.getSinglePost(this.postId).subscribe({
      next: (res) => {
        console.log(res);
        this.postDetails = res.data.post;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
