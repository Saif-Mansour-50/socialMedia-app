import { Ipost } from '../../features/posts/models/Ipost/ipost.interface';
import { PostsService } from '../../features/posts/models/posts.service';
import { Component, inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  private readonly postsService = inject(PostsService);

  profileDetails: MyProfile = {} as MyProfile;

  postList: Ipost[] = [];

  userId: string = '';

  ngOnInit(): void {
    this.myProfileData();

    this.userId = JSON.parse(localStorage.getItem('userData')!)._id;
    this.profilePost();
  }

  myProfileData() {
    this.postsService.getMyProfile().subscribe({
      next: (res) => {
        this.profileDetails = res.data.user;
        console.log('profileDetails', this.profileDetails);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  profilePost() {
    this.postsService.getUserPost(this.userId).subscribe({
      next: (res) => {
        this.postList = res.data.posts;
        console.log('my prosts', this.postList);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}

export interface MyProfile {
  _id: string;
  name: string;
  username: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  photo: string;
  cover: string;
  bookmarks: string[];
  followers: any[];
  following: string[];
  createdAt: string;
  followersCount: number;
  followingCount: number;
  bookmarksCount: number;
  id: string;
}
