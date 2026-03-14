import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { SuggestedFriendsComponent } from '../../components/suggested-friends/suggested-friends.component';
import { AsideFeedComponent } from '../../components/aside-feed/aside-feed.component';
import { CreatPostComponent } from '../../components/creat-post/creat-post.component';

import { FriendsService } from '../../models/friends.service';
import { PostsService } from '../../models/posts.service';

import { SuggestedFriends } from '../../models/suggestedFriends/suggested-friends.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [
    CreatPostComponent,
    FormsModule,
    SuggestedFriendsComponent,
    AsideFeedComponent,
    RouterOutlet,
    CommonModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  protected readonly postsService = inject(PostsService);

  private readonly friendsService = inject(FriendsService);

  currentid = '';

  searchTerm = '';

  suggestedFriendsList: SuggestedFriends[] = [];

  activeOption = signal<'feed' | 'community' | 'my-posts' | 'saved'>('feed');

  ngOnInit(): void {
    this.getSuggested();
  }

  getAllPosts() {
    this.postsService.getAllPosts();
  }

  getSuggested() {
    this.friendsService.getFrindesSuggestition().subscribe({
      next: (res) => {
        console.log('friends', res);

        this.suggestedFriendsList = res.data.suggestions;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  followFriend(id: string) {
    console.log(id);
    this.currentid = id;
    this.friendsService.followFriend(id).subscribe({
      next: (res) => {
        this.getSuggested();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
