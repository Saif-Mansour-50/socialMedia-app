import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FriendsService } from '../../models/friends.service';
import { SuggestedFriends } from '../../models/suggestedFriends/suggested-friends.interface';
import { SearchFriendsPipe } from '../../../../shared/pipes/search-friends-pipe';

@Component({
  selector: 'app-suggested-friends',
  imports: [FormsModule, SearchFriendsPipe],
  templateUrl: './suggested-friends.component.html',
  styleUrl: './suggested-friends.component.css',
})
export class SuggestedFriendsComponent implements OnInit {
  private readonly friendsService = inject(FriendsService);

  isLoading = false;

  currentid = '';

  searchTerm = '';

  showFriends: boolean = true;

  suggestedFriendsList: SuggestedFriends[] = [];

  ngOnInit(): void {
    this.getSuggested();
  }

  getSuggested() {
    this.isLoading = true;

    this.friendsService.getFrindesSuggestition().subscribe({
      next: (res) => {
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
