import { Component, inject, OnInit, signal, HostListener } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { PickerComponent } from '@ctrl/ngx-emoji-mart';

import { CommentsService } from '../../models/comments.service';
import { AuthService } from '../../../auth/models/auth.service';
import { PostsService } from '../../models/posts.service';
import { CommentsComponent } from '../../components/comments/comments.component';
import { PostCardComponent } from '../../components/post-card/post-card.component';

@Component({
  selector: 'app-single-post',
  imports: [CommonModule, ReactiveFormsModule, PostCardComponent],
  templateUrl: './feed.component.html',
})
export class FeedComponent implements OnInit {
  protected postsService = inject(PostsService);

  isLoadingMore = false;
  visibleCount = 10;
  userId: string = '';

  imagePreview: string | null = null;
  uploadedFile: File | null = null;
  imagePreviewForPost = signal<string | null>(null);

  ngOnInit(): void {
    this.getUserId();
    this.getAllPosts();
  }

  refreshPosts(): void {
    console.log('Refreshing posts...');
    this.getAllPosts();
    this.visibleCount = 5;
  }

  ngOnDestroy(): void {
    if (this.imagePreview) {
      URL.revokeObjectURL(this.imagePreview);
    }
  }

  private getUserId(): void {
    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        this.userId = JSON.parse(userData)._id;
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  getAllPosts(): void {
    this.postsService.isLoading.set(true);
    this.postsService.getAllPosts();
  }

  likePost(): void {
    this.postsService.likePost(this.userId);
  }

  @HostListener('document:click')
  handleClickOutside(): void {}

  loadMore(): void {
    if (this.isLoadingMore) return;

    this.isLoadingMore = true;

    setTimeout(() => {
      this.visibleCount += 20;
      this.isLoadingMore = false;
    }, 500);
  }
}
