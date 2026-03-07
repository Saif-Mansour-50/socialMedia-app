import { Component, inject, OnInit } from '@angular/core';

import { CreatPostComponent } from '../../components/creat-post/creat-post.component';
import { PostsService } from '../../models/posts.service';
import { SinglePostComponent } from '../../components/single-post/single-post.component';
import { SuggestedFriends } from '../../models/suggestedFriends/suggested-friends.interface';
import { FriendsService } from '../../models/friends.service';
import { SearchFriendsPipe } from '../../../../shared/pipes/search-friends-pipe';
import { FormsModule } from '@angular/forms';
import { SuggestedFriendsComponent } from '../../components/suggested-friends/suggested-friends.component';
import { RouterLink } from '@angular/router';
import { AsideFeedComponent } from '../../components/aside-feed/aside-feed.component';

@Component({
  selector: 'app-home',
  imports: [
    CreatPostComponent,
    SinglePostComponent,
    FormsModule,
    SuggestedFriendsComponent,
    AsideFeedComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  protected readonly postsService = inject(PostsService);

  private readonly friendsService = inject(FriendsService);

  isLoading = false;

  currentid = '';

  searchTerm = '';

  suggestedFriendsList: SuggestedFriends[] = [];

  ngOnInit(): void {
    this.getSuggested();
  }

  getSuggested() {
    this.isLoading = true;

    this.friendsService.getFrindesSuggestition().subscribe({
      next: (res) => {
        console.log('friends', res);

        this.suggestedFriendsList = res.data.suggestions;
        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);

        this.isLoading = false;
      },
    });
  }
  followFriend(id: string) {
    console.log(id);
    this.currentid = id;
    this.friendsService.followFriend(id).subscribe({
      next: (res) => {
        console.log(res);
        this.getSuggested();
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      },
    });
  }
}
