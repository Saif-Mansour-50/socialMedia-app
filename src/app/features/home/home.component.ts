import { isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private readonly id = inject(PLATFORM_ID);

  ngOnInit(): void {
    this.getToken();
  }
  getToken() {
    if (isPlatformBrowser(this.id)) {
      let token = localStorage.getItem('token');
      if (token) {
        let decodedToken = jwtDecode(token);

        console.log('token : ', decodedToken);
      }
    }
  }
}
