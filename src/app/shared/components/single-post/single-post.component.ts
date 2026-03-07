import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, inject, OnInit, signal, HostListener } from '@angular/core';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { CommentsService } from '../../../core/services/comments/comments.service';
import { PostsService } from '../../../core/services/posts/posts.service';
import { CommentsComponent } from '../comments/comments.component';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/authorization/auth.service';

@Component({
  selector: 'app-single-post',
  imports: [CommonModule, CommentsComponent, ReactiveFormsModule, RouterLink, PickerComponent],
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.css'],
})
export class SinglePostComponent implements OnInit {
  private readonly commentsService = inject(CommentsService);
  private readonly authService = inject(AuthService);
  protected readonly postsService = inject(PostsService);

  isLoadingMore = false;
  visibleCount = 5; // Start with 5 posts
  userId: string = '';

  openDropdownId = signal<string | null>(null);
  showCommentsForPost = signal<string | null>(null);
  isEmojiPickerOpen = signal<string | null>(null);

  commentControls = new Map<string, FormControl>();

  imagePreview: string | null = null;
  uploadedFile: File | null = null;
  imagePreviewForPost = signal<string | null>(null);

  ngOnInit(): void {
    this.getAllPosts();
    this.getUserId();

    document.addEventListener('click', this.handleClickOutside.bind(this));
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.handleClickOutside.bind(this));
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

  getCommentControl(postId: string): FormControl {
    if (!this.commentControls.has(postId)) {
      this.commentControls.set(postId, new FormControl('', [Validators.required]));
    }
    return this.commentControls.get(postId)!;
  }

  createComment(e: SubmitEvent, postId: string): void {
    e.preventDefault();
    const control = this.getCommentControl(postId);

    if (control.valid) {
      const formData = new FormData();
      formData.append('content', control.value);

      if (this.uploadedFile && this.imagePreviewForPost() === postId) {
        formData.append('image', this.uploadedFile);
      }

      this.commentsService.createComment(formData, postId).subscribe({
        next: (res) => {
          if (res.success) {
            control.reset();
            this.removeImage();
            this.getAllPosts();
          }
        },
        error: (err) => {
          console.error('Error creating comment:', err);
        },
      });
    }
  }

  deletePostItem(postId: string): void {
    if (confirm('Are you sure you want to delete this post?')) {
      this.postsService.deletePost(postId).subscribe({
        next: (res) => {
          console.log('Post deleted:', res);
          this.getAllPosts();
          this.closeDropdown();
        },
        error: (err) => {
          console.error('Error deleting post:', err);
        },
      });
    }
  }

  likePost(postId: string): void {
    this.postsService.likePost(postId).subscribe({
      next: (res) => {
        this.getAllPosts();
      },
      error: (err) => {
        console.error('Error liking post:', err);
      },
    });
  }

  savePost(postId: string): void {
    this.postsService.savePost(postId).subscribe({
      next: (res) => {
        console.log('Post saved:', res);
        this.getAllPosts();
        this.closeDropdown();
      },
      error: (err) => {
        console.error('Error saving post:', err);
      },
    });
  }

  sharePost(postId: string): void {
    this.authService.sharePost(postId).subscribe({
      next: (res) => {
        console.log('Post shared:', res);
        this.getAllPosts();
      },
      error: (err) => {
        console.error('Error sharing post:', err);
      },
    });
  }

  editPost(post: any): void {
    console.log('Edit post:', post);
    this.closeDropdown();
  }

  toggleDropdown(event: MouseEvent, postId: string): void {
    event.stopPropagation();
    this.openDropdownId.set(this.openDropdownId() === postId ? null : postId);
  }

  closeDropdown(): void {
    this.openDropdownId.set(null);
  }

  @HostListener('document:click')
  handleClickOutside(): void {
    this.closeDropdown();
  }

  toggleComments(postId: string): void {
    this.showCommentsForPost.set(this.showCommentsForPost() === postId ? null : postId);
  }

  onFileSelected(e: Event, postId: string): void {
    const input = e.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      this.uploadedFile = file;
      this.imagePreviewForPost.set(postId);

      if (this.imagePreview) {
        URL.revokeObjectURL(this.imagePreview);
      }

      this.imagePreview = URL.createObjectURL(file);
    }
  }

  removeImage(): void {
    if (this.imagePreview) {
      URL.revokeObjectURL(this.imagePreview);
      this.imagePreview = null;
    }
    this.uploadedFile = null;
    this.imagePreviewForPost.set(null);

    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach((input) => {
      (input as HTMLInputElement).value = '';
    });
  }

  toggleEmojiPicker(postId: string): void {
    this.isEmojiPickerOpen.set(this.isEmojiPickerOpen() === postId ? null : postId);
  }

  selectEmoji($event: any, postId: string): void {
    const control = this.getCommentControl(postId);
    const currentValue = control.value || '';
    control.setValue(`${currentValue}${$event.emoji.native}`);
    this.isEmojiPickerOpen.set(null);
  }

  loadMore(): void {
    if (this.isLoadingMore) return;

    this.isLoadingMore = true;

    setTimeout(() => {
      this.visibleCount += 5;
      this.isLoadingMore = false;
    }, 500);
  }

  isModalOpen = signal<boolean>(false);
  selectedImage = signal<string | null>(null);

  openImageModal(imageUrl: string): void {
    this.selectedImage.set(imageUrl);
    this.isModalOpen.set(true);
  }

  closeImageModal(): void {
    this.isModalOpen.set(false);
    this.selectedImage.set(null);
  }
}
