import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../features/auth/models/auth.service';
import { Ipost } from '../../features/posts/models/Ipost/ipost.interface';
import { PostsService } from '../../features/posts/models/posts.service';
import { Component, inject, OnInit, input } from '@angular/core';
import { PostCardComponent } from '../../features/posts/components/post-card/post-card.component';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, PostCardComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  private readonly postsService = inject(PostsService);
  private readonly authService = inject(AuthService);

  profileDetails: MyProfile = {} as MyProfile;
  postList: Ipost[] = [];
  userId: string = '';

  uploadedFile!: File;
  isUploading: boolean = false;

  uploadedCoverFile!: File;
  isUploadingCover: boolean = false;

  body: FormControl = new FormControl();

  ngOnInit(): void {
    this.myProfileData();
    this.userId = JSON.parse(localStorage.getItem('userData')!)._id;
    this.profilePost();
  }

  myProfileData() {
    this.postsService.getMyProfile().subscribe({
      next: (res) => {
        this.profileDetails = res.data.user;
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
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  refreshPosts() {
    this.profilePost();
  }

  onFileSelected(e: Event) {
    if (e.target) {
      let input = e.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        this.uploadedFile = input.files[0];

        if (!this.uploadedFile.type.startsWith('image/')) {
          alert('only photo');
          return;
        }

        console.log('upload profile', this.uploadedFile);
        this.uploadProfilePhoto();
      }
    }
  }

  onCoverSelected(e: Event) {
    if (e.target) {
      let input = e.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        this.uploadedCoverFile = input.files[0];

        if (!this.uploadedCoverFile.type.startsWith('image/')) {
          return;
        }

        if (this.uploadedCoverFile.size > 5 * 1024 * 1024) {
          return;
        }

        console.log('upload cover', this.uploadedCoverFile);
        this.uploadCoverPhoto();
      }
    }
  }

  uploadProfilePhoto() {
    if (!this.uploadedFile) {
      return;
    }

    this.isUploading = true;

    this.authService.uploadProfilePhoto(this.uploadedFile).subscribe({
      next: (res) => {
        this.isUploading = false;

        if (res.data && res.data.photo) {
          this.profileDetails.photo = res.data.photo;

          const userData = JSON.parse(localStorage.getItem('userData')!);
          if (userData) {
            userData.photo = res.data.photo;
            localStorage.setItem('userData', JSON.stringify(userData));
          }
        }
      },
      error: (err) => {
        this.isUploading = false;
      },
    });
  }

  uploadCoverPhoto() {
    if (!this.uploadedCoverFile) {
      return;
    }

    this.isUploadingCover = true;

    this.authService.uploadCoverPhoto(this.uploadedCoverFile).subscribe({
      next: (res) => {
        this.isUploadingCover = false;

        if (res.data && res.data.cover) {
          this.profileDetails.cover = res.data.cover;
        }
      },
      error: (err) => {
        this.isUploadingCover = false;
      },
    });
  }

  previewImage(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (event: any) => {};
      reader.readAsDataURL(input.files[0]);
    }
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
