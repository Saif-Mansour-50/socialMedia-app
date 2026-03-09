import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, EventEmitter, inject, input, Output, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PickerComponent } from '@ctrl/ngx-emoji-mart';

import { CommentsComponent } from '../comments/comments.component';

import { AuthService } from '../../../auth/models/auth.service';
import { CommentsService } from '../../models/comments.service';
import { PostsService } from '../../models/posts.service';

import { Ipost } from '../../models/Ipost/ipost.interface';

@Component({
  selector: 'app-post-card',
  imports: [ReactiveFormsModule, RouterLink, CommentsComponent, PickerComponent, FormsModule],
  templateUrl: './post-card.component.html',
})
export class PostCardComponent implements OnInit {
  private readonly commentsService = inject(CommentsService);
  protected readonly postsService = inject(PostsService);
  private readonly authService = inject(AuthService);

  @Output() getNewPosts: EventEmitter<any> = new EventEmitter();

  post = input.required<Ipost>();

  showCommentsForPost = signal<string | null>(null);
  imagePreviewForPost = signal<string | null>(null);
  isEmojiPickerOpen = signal<string | null>(null);
  openDropdownId = signal<string | null>(null);
  selectedImage = signal<string | null>(null);
  editingPostId = signal<string | null>(null);
  editingContent = signal<string>('');
  isModalOpen = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  shareModalOpen = signal<boolean>(false);
  shareContent = signal<string>('');
  sharedPost = signal<Ipost | null>(null);
  shareLoading = signal<boolean>(false);

  // body: FormControl = new FormControl('', Validators.minLength(3));

  commentControls = new Map<string, FormControl>();

  userId: string = '';
  imagePreview: string | null = null;
  uploadedFile: File | null = null;

  ngOnInit(): void {
    this.getUserId();
  }

  toggleDropdown(event: MouseEvent, postId: string): void {
    event.stopPropagation();
    this.openDropdownId.set(this.openDropdownId() === postId ? null : postId);
  }

  toggleEmojiPicker(postId: string): void {
    this.isEmojiPickerOpen.set(this.isEmojiPickerOpen() === postId ? null : postId);
  }

  openImageModal(imageUrl: string): void {
    this.selectedImage.set(imageUrl);
    this.isModalOpen.set(true);
  }

  private getUserId(): void {
    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        this.userId = JSON.parse(userData)._id;
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }

  savePost(postId: string): void {
    this.isLoading.set(true);
    this.postsService.savePost(postId).subscribe({
      next: (res) => {
        // console.log('Post saved:', res);
        this.getNewPosts.emit();
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error saving post:', err);
        this.isLoading.set(false);
      },
    });
  }

  getSavePost(postId: string): void {
    this.isLoading.set(true);
    this.postsService.savePost(postId).subscribe({
      next: (res) => {
        console.log('Posts zzzzz saved:', res);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error saving post:', err);
        this.isLoading.set(false);
      },
    });
  }

  editPost(postId: string): void {
    this.editingPostId.set(postId);
    this.editingContent.set(this.post().body || '');
  }

  saveEdit(postId: string, privacy?: string): void {
    if (!this.editingContent().trim()) return;

    const updateData: any = {
      body: this.editingContent(),
    };

    if (privacy) {
      updateData.privacy = privacy;
    }

    this.postsService.editPost(postId, updateData).subscribe({
      next: () => {
        this.editingPostId.set(null);
        this.editingContent.set('');
        this.getNewPosts.emit();
      },
      error: (err) => {
        console.error('Error editing post:', err);
      },
    });
  }

  cancelEdit(): void {
    this.editingPostId.set(null);
    this.editingContent.set('');
  }

  deletePostItem(postId: string): void {
    if (confirm('Are you sure you want to delete this post?')) {
      this.postsService.deletePost(postId).subscribe({
        next: (res) => {
          console.log('Post deleted:', res);
          this.getNewPosts.emit();
        },
        error: (err) => {
          console.error('Error deleting post:', err);
        },
      });
    }
  }

  likePost(postId: string): void {
    this.isLoading.set(true);

    this.postsService.likePost(postId).subscribe({
      next: (res) => {
        console.log(res);
        this.getNewPosts.emit();
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error liking post:', err);
        this.isLoading.set(false);
      },
    });
  }

  toggleComments(postId: string): void {
    this.showCommentsForPost.set(this.showCommentsForPost() === postId ? null : postId);
  }

  openShareModal(post: Ipost): void {
    this.sharedPost.set(post);
    this.shareContent.set('');
    this.shareModalOpen.set(true);
  }

  closeShareModal(): void {
    this.shareModalOpen.set(false);
    this.sharedPost.set(null);
    this.shareContent.set('');
  }

  submitShare(postId: string): void {
    this.shareLoading.set(true);

    const shareData = {
      body: this.shareContent(),
      originalPostId: postId,
    };
    console.log(this);

    this.postsService.sharePost(shareData, postId).subscribe({
      next: (res) => {
        console.log('Post shared:', res);
        this.getNewPosts.emit();
        this.closeShareModal();
        this.shareLoading.set(false);
      },
      error: (err) => {
        console.error('Error sharing post:', err);
        this.shareLoading.set(false);
      },
    });
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

  selectEmoji($event: any, postId: string): void {
    const control = this.getCommentControl(postId);
    const currentValue = control.value || '';
    control.setValue(`${currentValue}${$event.emoji.native}`);
    this.isEmojiPickerOpen.set(null);
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

  // comments section
  getCommentControl(postId: string) {
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
            this.getNewPosts.emit();
          }
          console.log(res);
        },
        error: (err) => {
          console.error('Error creating comment:', err);
        },
      });
    }
  }

  closeImageModal(): void {
    this.isModalOpen.set(false);
    this.selectedImage.set(null);
  }
}
