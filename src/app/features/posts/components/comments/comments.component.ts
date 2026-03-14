import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { CommentsService } from '../../models/comments.service';
import { Icomment } from '../../models/Icomment/icomment.interface';
import { PostsService } from '../../models/posts.service';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';

@Component({
  selector: 'app-comments',
  imports: [ReactiveFormsModule, PickerComponent],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css',
})
export class CommentsComponent implements OnInit {
  private readonly commentsService = inject(CommentsService);
  private readonly postsService = inject(PostsService);

  @Input({ required: true }) postId!: string;
  @Output() upDateComment: EventEmitter<any> = new EventEmitter();

  commentList: Icomment[] = [];
  replyList: Icomment[] = [];
  isLoading = signal<boolean>(false);
  isLoadingR = signal<boolean>(false);
  LikeTheam = signal<string | null>(null);
  openDropdownId = signal<string | null>(null);
  commentControls = new Map<string, FormControl>();
  uploadedFile: File | null = null;
  imagePreviewForPost = signal<string | null>(null);
  imagePreview: string | null = null;
  isEmojiPickerOpen = signal<string | null>(null);
  userId: string = '';
  isModalOpen = signal<boolean>(false);
  selectedImage = signal<string | null>(null);
  replyMap = new Map<string, Icomment[]>();
  replyLikes = new Map<string, boolean>();

  editingCommentId = signal<string | null>(null);
  editContent = new FormControl('', [Validators.required]);
  editImagePreview: string | null = null;
  editUploadedFile: File | null = null;

  ngOnInit(): void {
    this.getPostComment();
    this.getUserId();
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

  getPostComment() {
    this.commentsService.getPostComments(this.postId).subscribe({
      next: (res) => {
        if (res.success) {
          this.commentList = res.data.comments;
          this.upDateComment.emit();
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  openImageModal(imageUrl: string): void {
    this.selectedImage.set(imageUrl);
    this.isModalOpen.set(true);
  }

  closeImageModal(): void {
    this.isModalOpen.set(false);
    this.selectedImage.set(null);
  }

  getMinTimeUnit(timestamp: string): string {
    const now = new Date();
    const commentDate = new Date(timestamp);
    const diffMs = now.getTime() - commentDate.getTime();

    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays >= 1) {
      return `${diffDays}d`;
    } else if (diffHours >= 1) {
      return `${diffHours}h`;
    } else {
      return `${diffMinutes}m`;
    }
  }

  likecomment(postId: string, commentId: string): void {
    this.isLoading.set(true);
    this.commentsService.likecomment(postId, commentId).subscribe({
      next: (res) => {
        this.upDateComment.emit();
        this.isLoading.set(false);
        this.LikeTheam.set(res.data.liked);
      },
      error: (err) => {
        console.log(err);
        this.isLoading.set(false);
      },
    });
  }

  likereplay(postId: string, replyId: string): void {
    this.isLoadingR.set(true);
    this.commentsService.likecomment(postId, replyId).subscribe({
      next: (res) => {
        this.upDateComment.emit();
        this.isLoadingR.set(false);

        this.replyLikes.set(replyId, res.data.liked);
      },
      error: (err) => {
        console.log(err);
        this.isLoadingR.set(false);
      },
    });
  }

  selectEmoji($event: any, postId: string): void {
    const control = this.getCommentControl(postId);
    const currentValue = control.value || '';
    control.setValue(`${currentValue}${$event.emoji.native}`);
    this.isEmojiPickerOpen.set(null);
  }

  selectEmojiForEdit($event: any): void {
    const currentValue = this.editContent.value || '';
    this.editContent.setValue(`${currentValue}${$event.emoji.native}`);
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

  onEditFileSelected(e: Event): void {
    const input = e.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      this.editUploadedFile = file;

      if (this.editImagePreview) {
        URL.revokeObjectURL(this.editImagePreview);
      }

      this.editImagePreview = URL.createObjectURL(file);
    }
  }

  toggleEmojiPicker(postId: string): void {
    this.isEmojiPickerOpen.set(this.isEmojiPickerOpen() === postId ? null : postId);
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

  removeEditImage(): void {
    if (this.editImagePreview) {
      URL.revokeObjectURL(this.editImagePreview);
      this.editImagePreview = null;
    }
    this.editUploadedFile = null;
  }

  getCommentControl(postId: string) {
    if (!this.commentControls.has(postId)) {
      this.commentControls.set(postId, new FormControl('', [Validators.required]));
    }
    return this.commentControls.get(postId)!;
  }

  createComment(e: SubmitEvent, postId: string, commentId: string): void {
    e.preventDefault();
    const control = this.getCommentControl(commentId);

    if (control.valid || this.uploadedFile) {
      const formData = new FormData();

      if (control.value) {
        formData.append('content', control.value);
      }
      if (this.uploadedFile && this.imagePreviewForPost() === commentId) {
        formData.append('image', this.uploadedFile);
      }

      this.commentsService.replayComment(postId, commentId, formData).subscribe({
        next: (res) => {
          if (res.success) {
            control.reset();
            this.removeImage();
            this.upDateComment.emit();
            console.log('replay', res);
            let Replies = this.replyMap.get(commentId) || [];
            this.replyMap.set(commentId, [...Replies, res.data.reply]);
          }
        },
        error: (err) => {
          console.error('Error creating comment:', err);
        },
      });
    }
  }

  toggleDropdown(event: MouseEvent, commentId: string): void {
    event.stopPropagation();
    this.openDropdownId.set(this.openDropdownId() === commentId ? null : commentId);
  }

  deletecomment(commentId: string): void {
    if (confirm('Are you sure you want to delete this comment?')) {
      this.commentsService.deleteComment(this.postId, commentId).subscribe({
        next: (res) => {
          this.getPostComment();
          this.upDateComment.emit();
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  startEdit(comment: Icomment): void {
    this.editingCommentId.set(comment._id);
    this.editContent.setValue(comment.content);
    this.editImagePreview = comment.image || null;
    this.editUploadedFile = null;
    this.openDropdownId.set(null);
  }

  cancelEdit(): void {
    this.editingCommentId.set(null);
    this.editContent.reset();
    this.removeEditImage();
  }

  saveEdit(commentId: string): void {
    if (this.editContent.valid || this.editUploadedFile) {
      const formData = new FormData();

      if (this.editContent.value) {
        formData.append('content', this.editContent.value);
      }

      if (this.editUploadedFile) {
        formData.append('image', this.editUploadedFile);
      }

      this.commentsService.editComment(this.postId, commentId, formData).subscribe({
        next: (res) => {
          if (res.success) {
            this.cancelEdit();
            this.getPostComment();
            this.upDateComment.emit();
          }
        },
        error: (err) => {
          console.error('Error editing comment:', err);
        },
      });
    }
  }
}
