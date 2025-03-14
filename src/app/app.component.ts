import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ContactsService } from './firebase-services/contacts.service';
import { HeaderComponent } from './shared/header/header.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Join';

  public contacts = inject(ContactsService);
  showHeaderAndSidebar: boolean = true;
  isLoggedIn: boolean = false;

  constructor(private router: Router) {}

  onRouterOutletActivate(event: any) {
    this.showHeaderAndSidebar = !(
      event instanceof LoginComponent || event instanceof SignupComponent
    );

    if (this.isLoggedIn && event instanceof LoginComponent) {
      this.router.navigate(['/summary']);
    }
  }

  onRouterOutletDeactivate(event: any) {}
}
