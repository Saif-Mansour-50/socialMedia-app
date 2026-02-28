import { Ipost } from './../../core/models/Ipost/ipost.interface';
import { isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { CreatPostComponent } from '../../../shared/components/creat-post/creat-post.component';
import { PostsService } from '../../core/services/posts/posts.service';

@Component({
  selector: 'app-home',
  imports: [CreatPostComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private readonly id = inject(PLATFORM_ID);

  private readonly postsService = inject(PostsService);

  postList: Ipost[] = [];

  ngOnInit(): void {
    this.getToken();
    // this.getAllPosts();
  }
  getToken() {
    if (isPlatformBrowser(this.id)) {
      let token = localStorage.getItem('token');
      if (token) {
        let decodedToken = jwtDecode(token);

        // console.log('token : ', decodedToken);
      }
    }
  }
}
