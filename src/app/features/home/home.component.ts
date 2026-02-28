import { Component, inject, OnInit } from '@angular/core';

import { CreatPostComponent } from '../../../shared/components/creat-post/creat-post.component';
import { PostsService } from '../../core/services/posts/posts.service';
import { Ipost } from './../../core/models/Ipost/ipost.interface';

@Component({
  selector: 'app-home',
  imports: [CreatPostComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private readonly postsService = inject(PostsService);

  postList: Ipost[] = [];

  ngOnInit(): void {}
}
