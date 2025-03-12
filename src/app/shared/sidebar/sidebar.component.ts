import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../firebase-services/login.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  activeTab: string = 'summary';
  isLoginContext: boolean = false; 

  constructor(private router: Router, public loginService: LoginService) {}

  ngOnInit() {
    this.checkRoute();
    this.router.events.subscribe(() => this.checkRoute())
  }

  checkRoute() {
    const currentUrl = this.router.url;
    // this.isLoginContext = ['/login', '/privacy-notice', '/legal-notice'].includes(currentUrl);
    this.isLoginContext = currentUrl === '/login' || this.loginService.getFromLoginOrSignup();
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
    this.checkRoute(); 
  }

  logout() {
    this.loginService.logout(); 
    this.router.navigate(['/login']); 
  }
}