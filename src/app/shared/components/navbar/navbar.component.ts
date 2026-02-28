import { RouterLinkActive, RouterLinkWithHref } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';

import { AuthService } from '../../../core/services/authorization/auth.service';
import { User } from '../../../core/models/Icomment/icomment.interface';

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
    const user = localStorage.getItem('userData');

    if (user) {
      this.userData = JSON.parse(user);
    }
  }

  logout() {
    this.authService.logOut();
  }
}
