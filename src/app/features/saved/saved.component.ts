import { Component } from '@angular/core';
import { AsideFeedComponent } from '../aside-feed/aside-feed.component';
import { SuggestedFriendsComponent } from '../suggested-friends/suggested-friends.component';

@Component({
  selector: 'app-saved',
  imports: [AsideFeedComponent, SuggestedFriendsComponent],
  templateUrl: './saved.component.html',
  styleUrl: './saved.component.css',
})
export class SavedComponent {}
