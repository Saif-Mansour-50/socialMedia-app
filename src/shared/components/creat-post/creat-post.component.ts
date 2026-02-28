import { PostsService } from './../../../app/core/services/posts/posts.service';
import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { log } from 'console';
import { SinglePostComponent } from '../single-post/single-post.component';

@Component({
  selector: 'app-creat-post',
  imports: [ReactiveFormsModule, SinglePostComponent],
  templateUrl: './creat-post.component.html',
  styleUrl: './creat-post.component.css',
})
export class CreatPostComponent {
  private readonly postsService = inject(PostsService);

  upLoadedFile: any;

  postDesctiption: FormControl = new FormControl(null, [Validators.required]);

  onFileSelected(e: Event) {
    let input = e.target as HTMLInputElement;

    if (input) {
      if (input.files) {
        this.upLoadedFile = input.files[0];
      }
    }
  }

  cratPost(e: SubmitEvent) {
    e.preventDefault();

    let formData = new FormData();

    formData.append('body', this.postDesctiption.value);
    formData.append('image', this.upLoadedFile);

    this.postsService.createPost(formData).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
