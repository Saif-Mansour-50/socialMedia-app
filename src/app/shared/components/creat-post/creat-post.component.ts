import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, inject, signal } from '@angular/core';

import { PostsService } from '../../../core/services/posts/posts.service';
import { User } from '../../../core/models/Icomment/icomment.interface';

@Component({
  selector: 'app-creat-post',
  imports: [ReactiveFormsModule],
  templateUrl: './creat-post.component.html',
  styleUrl: './creat-post.component.css',
})
export class CreatPostComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly postsService = inject(PostsService);

  isSubmitted = signal(false);

  upLoadedFile: any;
  userData!: User;

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

      this.postsService.createPost(formData).subscribe({
        next: () => {
          this.postsService.getAllPosts();
          this.isSubmitted.set(false);

          this.form.reset();
        },
        error: (err) => {
          this.isSubmitted.set(false);
        },
      });
    }
  }
}
