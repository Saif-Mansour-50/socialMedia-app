import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FriendsService } from '../../models/friends.service';
import { SuggestedFriends } from '../../models/suggestedFriends/suggested-friends.interface';
import { SearchFriendsPipe } from '../../../../shared/pipes/search-friends-pipe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-suggested-friends',
  imports: [FormsModule, SearchFriendsPipe, RouterLink],
  templateUrl: './suggested-friends.component.html',
  styleUrl: './suggested-friends.component.css',
})
export class SuggestedFriendsComponent implements OnInit {
  private readonly friendsService = inject(FriendsService);

  isLoading = false;

  isLoadingAll = false;

  currentid = '';

  searchTerm = '';

  showFriends: boolean = true;

  suggestedFriendsList: SuggestedFriends[] = [];

  allSuggestedFriends: SuggestedFriends[] = [];

  ngOnInit(): void {
    this.getSuggested();
    this.getAllSuggested();
  }

  getSuggested() {
    this.isLoading = true;

    this.friendsService.getFrindesSuggestition().subscribe({
      next: (res) => {
        this.suggestedFriendsList = res.data.suggestions;
        console.log(this.suggestedFriendsList);

        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);

        this.isLoading = false;
      },
    });
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
        this.getSuggested();
        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      },
    });
  }
}
