import { RouterLinkActive, RouterLinkWithHref } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';

import { AuthService } from '../../../features/auth/models/auth.service';
import { User } from '../../../features/posts/models/Icomment/icomment.interface';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-navbar',
  imports: [RouterLinkActive, RouterLinkWithHref],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  private readonly authService = inject(AuthService);

  userData!: User;

  ngOnInit(): void {
    initFlowbite();

    const user = localStorage.getItem('userData');

    if (user) {
      this.userData = JSON.parse(user);
    }
  }

  logout() {
    this.authService.logOut();
  }
}
