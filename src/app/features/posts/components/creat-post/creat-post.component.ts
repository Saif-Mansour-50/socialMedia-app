import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, inject, signal, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { PostsService } from '../../models/posts.service';
import { User } from '../../models/Icomment/icomment.interface';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-creat-post',
  imports: [ReactiveFormsModule, PickerComponent, RouterLink, CommonModule],
  templateUrl: './creat-post.component.html',
  styleUrl: './creat-post.component.css',
})
export class CreatPostComponent implements OnInit, OnDestroy {
  private readonly formBuilder = inject(FormBuilder);
  private readonly postsService = inject(PostsService);

  @Output() getNewPosts: EventEmitter<any> = new EventEmitter();

  privacy = new FormControl('public');
  isSubmitted = signal(false);
  upLoadedFile: File | null = null;
  userData!: User;
  imagePreview: string | null = null;
  isEmojiPickerOpen = signal(false);

  form = this.formBuilder.group({
    body: ['', [Validators.required, Validators.minLength(3)]],
  });

  ngOnInit(): void {
    const user = localStorage.getItem('userData');
    if (user) {
      this.userData = JSON.parse(user);
    }

    document.addEventListener('click', this.handleClickOutside.bind(this));
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.handleClickOutside.bind(this));
    if (this.imagePreview) {
      URL.revokeObjectURL(this.imagePreview);
    }
  }

  handleClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('#emoji-menu') && !target.closest('#emoji-dropdown')) {
      this.isEmojiPickerOpen.set(false);
    }
  }

  onFileSelected(e: Event) {
    const input = e.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      this.upLoadedFile = file;

      if (this.imagePreview) {
        URL.revokeObjectURL(this.imagePreview);
      }

      this.imagePreview = URL.createObjectURL(file);
    }
  }

  createPost() {
    this.isSubmitted.set(true);

    if (this.form.valid) {
      const formData = new FormData();

      if (this.form.value.body) {
        formData.append('body', this.form.value.body);
        console.log('Body:', this.form.value.body);
      }

      if (this.upLoadedFile) {
        formData.append('image', this.upLoadedFile, this.upLoadedFile.name);
        console.log(
          'File:',
          this.upLoadedFile.name,
          this.upLoadedFile.type,
          this.upLoadedFile.size,
        );
      }

      formData.append('privacy', this.privacy.value || 'public');

      this.postsService.createPost(formData).subscribe({
        next: (res) => {
          console.log('creatPost', res);
          this.getNewPosts.emit();
          this.resetForm();
        },
        error: (err) => {
          console.error('Error creating post:', err);
          this.isSubmitted.set(false);
        },
      });
    }
  }

  resetForm(): void {
    this.isSubmitted.set(false);
    this.form.reset();

    if (this.imagePreview) {
      URL.revokeObjectURL(this.imagePreview);
      this.imagePreview = null;
    }
    this.upLoadedFile = null;

    const fileInput = document.getElementById('photoInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }

    this.privacy.setValue('public');
  }

  selectEmoji($event: any) {
    const currentValue = this.form.value.body || '';
    this.form.controls.body.setValue(`${currentValue}${$event.emoji.native}`);
    this.isEmojiPickerOpen.set(false);
  }

  toggleEmojiPicker(): void {
    this.isEmojiPickerOpen.set(!this.isEmojiPickerOpen());
  }

  removeImage(): void {
    if (this.imagePreview) {
      URL.revokeObjectURL(this.imagePreview);
      this.imagePreview = null;
    }
    this.upLoadedFile = null;

    const fileInput = document.getElementById('photoInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
}
