import { RouterLinkActive, RouterLinkWithHref } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';

import { jwtDecode } from 'jwt-decode';

import { AuthService } from '../../../core/services/authorization/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLinkActive, RouterLinkWithHref],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  private readonly authService = inject(AuthService);

  userData: any = null;

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      this.userData = decodedToken;
    }
  }

  logout() {
    this.authService.logOut();
  }
}
