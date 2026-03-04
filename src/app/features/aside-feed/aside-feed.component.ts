import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-aside-feed',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './aside-feed.component.html',
  styleUrl: './aside-feed.component.css',
})
export class AsideFeedComponent {}
