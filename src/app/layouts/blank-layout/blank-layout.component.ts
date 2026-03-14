import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { NgxSpinnerComponent } from 'ngx-spinner';

@Component({
  selector: 'app-blank-layout',
  imports: [RouterOutlet, NavbarComponent, NgxSpinnerComponent],
  templateUrl: './blank-layout.component.html',
  styleUrl: './blank-layout.component.css',
})
export class BlankLayoutComponent {}
