import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FriendsService } from '../../models/friends.service';
import { SuggestedFriends } from '../../models/suggestedFriends/suggested-friends.interface';
import { SearchFriendsPipe } from '../../../../shared/pipes/search-friends-pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-all-friends',
  imports: [RouterLink, SearchFriendsPipe, FormsModule],
  templateUrl: './all-friends.component.html',
  styleUrl: './all-friends.component.css',
})
export class AllFriendsComponent implements OnInit {
  private readonly friendsService = inject(FriendsService);

  searchTerm = '';

  currentid = '';

  isLoading = false;

  isLoadingAll = false;
  allSuggestedFriends: SuggestedFriends[] = [];

  ngOnInit(): void {
    this.getAllSuggested();
  }

  getAllSuggested() {
    this.isLoadingAll = true;
    this.friendsService.getAllSuggestedFriends().subscribe({
      next: (res) => {
        this.allSuggestedFriends = res.data.suggestions;

        this.isLoadingAll = false;
      },
      error: (err) => {
        console.log(err);
        this.isLoadingAll = false;
      },
    });
  }

  followFriend(id: string) {
    this.isLoading = true;

    console.log(id);
    this.currentid = id;
    this.friendsService.followFriend(id).subscribe({
      next: (res) => {
        this.isLoading = false;

        this.getAllSuggested();
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      },
    });
  }
}
