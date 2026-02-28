import { RouterLinkActive, RouterLinkWithHref } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';

import { initFlowbite } from 'flowbite';

import { FlowbiteService } from '../../../core/services/flowbite/flowbite.service';
import { AuthService } from '../../../core/services/authorization/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLinkActive, RouterLinkWithHref],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  private readonly flowbiteService = inject(FlowbiteService);
  private readonly authService = inject(AuthService);

  userData: any = null;

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.userData = JSON.parse(token);
    }

    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });
  }

  logout() {
    this.authService.logOut();
  }
}
