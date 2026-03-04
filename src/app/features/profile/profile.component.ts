import { MyProfile } from '../../core/models/myProfile/my-profile.interface';
import { PostsService } from '../../core/services/posts/posts.service';
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

  // ده لما ادوس علي اي واحد يظهرلي تفاصيله
  profilePost() {
    this.postsService.getUserPost(this.userId).subscribe({
      next: (res) => {
        console.log('my prosts', res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
