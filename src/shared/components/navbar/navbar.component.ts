import { Component, inject } from '@angular/core';
import { FlowbiteService } from '../../../app/core/services/flowbite/flowbite.service';
import { initFlowbite } from 'flowbite';
import { RouterLinkActive, RouterLinkWithHref } from '@angular/router';
import { AuthService } from '../../../app/core/services/authorization/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLinkActive, RouterLinkWithHref],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  constructor(private flowbiteService: FlowbiteService) {}

  private readonly authService = inject(AuthService);

  ngOnInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });
  }

  logout() {
    this.authService.logOut();
  }
}
