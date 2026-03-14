import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Ipost } from '../../models/Ipost/ipost.interface';
import { PostsService } from '../../models/posts.service';

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

  postDetails: Ipost | null = null;

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((param) => {
      this.postId = param.get('id')!;
      this.getPostDetails();
    });
  }

  getPostDetails(): void {
    this.postsService.getSinglePost(this.postId).subscribe({
      next: (res) => {
        this.postDetails = res.data.post;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
