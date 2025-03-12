import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoginService } from '../../firebase-services/login.service';
import { HelpUserComponent } from '../../help-user/help-user.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, HelpUserComponent, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  menuOpen = false;
  helpOpen = false;
  initials: string = '';
  isLoginContext: boolean = false;
  fromLoginContext: boolean = false;

  constructor(public loginService: LoginService, private router: Router) {}

  ngOnInit() {
    this.loginService.initials$.subscribe((newInitials) => {
      this.initials = newInitials;
    });
    this.checkRoute();
    this.router.events.subscribe(() => this.checkRoute())
  }

  navigateTo(route: string) {
    this.loginService.setLinkClicked(true); 
    this.router.navigate([route]);
    this.closeMenu();
    setTimeout(() => this.loginService.setLinkClicked(false), 100); 
  }

  checkRoute() {
    const currentUrl = this.router.url;
    this.isLoginContext = currentUrl === '/login';
    if (currentUrl === '/privacy-notice' || currentUrl === '/legal-notice') {
      this.fromLoginContext = this.loginService.getFromLoginOrSignup(); 
    } else {
      this.fromLoginContext = currentUrl === '/login';
    }
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  goToHelp() {
    this.loginService.setHideHelpIcon(true);
    this.router.navigate(['/help-user']);
  }

  logout() {
    this.loginService.logout(); 
    this.closeMenu(); 
    this.router.navigate(['/login']); 
  }
}
