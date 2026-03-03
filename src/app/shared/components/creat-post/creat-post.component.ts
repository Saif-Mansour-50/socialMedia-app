import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, inject, signal } from '@angular/core';

import { PickerComponent } from '@ctrl/ngx-emoji-mart';

import { PostsService } from '../../../core/services/posts/posts.service';
import { User } from '../../../core/models/Icomment/icomment.interface';

@Component({
  selector: 'app-creat-post',
  imports: [ReactiveFormsModule, PickerComponent],
  templateUrl: './creat-post.component.html',
  styleUrl: './creat-post.component.css',
})
export class CreatPostComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly postsService = inject(PostsService);

  content: FormControl = new FormControl('');

  privacy: FormControl = new FormControl('public');

  isSubmitted = signal(false);

  upLoadedFile: any;
  userData!: User;
  imagePreview: any;

  ngOnInit(): void {
    const user = localStorage.getItem('userData');

    if (user) {
      this.userData = JSON.parse(user);
    }
  }

  form = this.formBuilder.group({
    body: ['', [Validators.required, Validators.minLength(3)]],
    image: [null],
  });

  onFileSelected(e: Event) {
    let input = e.target as HTMLInputElement;

    if (input.files) {
      this.upLoadedFile = input.files[0];
      this.imagePreview = URL.createObjectURL(this.upLoadedFile);
    }
  }

  cratPost() {
    this.isSubmitted.set(true);
    if (this.form.valid) {
      let formData = new FormData();

      if (this.form.value.body) {
        formData.append('body', this.form.value.body);
      }

      if (this.upLoadedFile) {
        formData.append('image', this.upLoadedFile);
      }

      if (this.privacy.value) {
        formData.append('privacy', this.privacy.value);
      }

      this.postsService.createPost(formData).subscribe({
        next: (res) => {
          this.postsService.getAllPosts();
          this.isSubmitted.set(false);
          this.form.reset();
          this.imagePreview = '';
        },
        error: (err) => {
          this.isSubmitted.set(false);
        },
      });
    }
  }

  selectEmoji($event: any) {
    let value = this.form.value.body;

    this.form.controls.body.setValue(`${value ?? ''}${$event.emoji.native}`);
  }
}
