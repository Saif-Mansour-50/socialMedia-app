import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FlowbiteService } from '../../../app/core/services/flowbite/flowbite.service';
import { initFlowbite } from 'flowbite';
import { RouterLinkActive, RouterLinkWithHref } from '@angular/router';
import { AuthService } from '../../../app/core/services/authorization/auth.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterLinkActive, RouterLinkWithHref],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  constructor(private flowbiteService: FlowbiteService) {}

  private readonly authService = inject(AuthService);

  platformId = inject(PLATFORM_ID);

  userData: any = null;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        this.userData = JSON.parse(token);
      }
    }

    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });
  }

  logout() {
    this.authService.logOut();
  }
}
