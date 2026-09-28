import { Component, signal, inject, effect } from '@angular/core'
import { NgOptimizedImage } from "@angular/common";
import { Button, ButtonModule } from 'primeng/button'
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../auth/auth-service';

@Component({
  selector: 'app-navbar',
  imports: [NgOptimizedImage, Button, RouterLink, ButtonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  public authService = inject(AuthService);
  public router = inject(Router);
  
  readonly DARK_MODE_KEY = 'dark-mode';
  isDark = signal(localStorage.getItem(this.DARK_MODE_KEY) === 'true');

  loggingOut = signal<boolean>(false);

  constructor() {
    effect(() => {
      document.documentElement.classList.toggle('app-dark', this.isDark());
      localStorage.setItem(this.DARK_MODE_KEY, String(this.isDark()));
    })
  }


  loggout() {
    this.loggingOut.set(true);

    this.authService.logout().subscribe(() => {
      this.loggingOut.set(false);
      
      void this.router.navigate(['/']);
    })
  }
}
