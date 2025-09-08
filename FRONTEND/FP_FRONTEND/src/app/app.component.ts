import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';
import { AppStore } from './store/app.store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'FP Frontend';
  isAuthenticated$ = this.appStore.isAuthenticated$;

  constructor(
    private authService: AuthService,
    private appStore: AppStore
  ) {}

  ngOnInit(): void {
    // Initialize authentication state from localStorage
    this.authService.initializeAuth();
  }
}