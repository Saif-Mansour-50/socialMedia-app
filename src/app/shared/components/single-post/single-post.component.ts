import { Icomment } from './../../../core/models/Icomment/icomment.interface';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';

import { CommentsService } from '../../../core/services/comments/comments.service';
import { PostsService } from '../../../core/services/posts/posts.service';
import { CommentsComponent } from '../comments/comments.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-single-post',
  imports: [CommentsComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './single-post.component.html',
  styleUrl: './single-post.component.css',
})
export class SinglePostComponent implements OnInit {
  private readonly commentsService = inject(CommentsService);

  protected readonly postsService = inject(PostsService);

  isLoadingMore = false;

  commentValue: FormControl = new FormControl(null, [Validators.required]);

  commentList: Icomment[] = [];

  @Output() upDateLike: EventEmitter<any> = new EventEmitter();

  userId: string = '';

  visibleCount = 20;

  ngOnInit(): void {
    this.getAllPosts();

    this.userId = JSON.parse(localStorage.getItem('userData')!)._id;
    console.log(this.userId);
  }

  getAllPosts() {
    this.postsService.isLoading.set(true);
    this.postsService.getAllPosts();
  }

  creatComment(e: SubmitEvent, postId: any) {
    e.preventDefault();
    if (this.commentValue.valid) {
      let formData = new FormData();

      formData.append('content', this.commentValue.value);

      this.commentsService.createComment(formData, postId).subscribe({
        next: (res) => {
          if (res.success) {
            this.commentValue.reset();
            this.commentList = res.data.comments;
            console.log('comment', res);
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  deletePostItem(postId: string): void {
    this.postsService.deletePost(postId).subscribe({
      next: (res) => {
        console.log(res);
        this.getAllPosts();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  likePost(postId: string) {
    this.isLoadingMore = true;
    this.postsService.likePost(postId).subscribe({
      next: (res) => {
        this.getAllPosts();
        this.isLoadingMore = false;
      },
      error: (err) => {
        console.log(err);
        this.isLoadingMore = false;
      },
    });
  }

  savePost(postId: string) {
    this.postsService.savePost(postId).subscribe({
      next: (res) => {},
      error: (err) => {
        console.log(err);
      },
    });
  }

  sharePost(postId: string) {
    this.postsService.savePost(postId).subscribe({
      next: (res) => {
        console.log('share', res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  editPost(postId: string, body: any) {
    this.postsService.savePost(postId).subscribe({
      next: (res) => {
        console.log('edit', res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // loadMore() {
  //   if (this.isLoadingMore) return;
  //   this.isLoadingMore = true;

  //   const total = this.postsService.postList().length;
  //   if (this.visibleCount < total) {
  //     this.visibleCount += 5;
  //   }
  //   setTimeout(() => {
  //     this.isLoadingMore = false;
  //   }, 2000);
  // }
}
