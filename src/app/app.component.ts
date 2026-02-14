import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { SidebarViewComponent } from '../sidebar/infrestructure/input_adapters/sidebar-view/sidebar-view.component';
import { SidebarMovilViewComponent } from '../sidebar/infrestructure/input_adapters/sidebar-movil-view/sidebar-movil-view.component';
import { SidebarService } from '../sidebar/application/sidebar.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    SidebarMovilViewComponent,
    SidebarViewComponent,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  isMobile: boolean = false;
  isLoginPage = false;
  private readonly isBrowser: boolean;

  constructor(
    private readonly router: Router,
    private readonly sidebarService: SidebarService,
    @Inject(PLATFORM_ID) private readonly platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.isMobile = window.innerWidth <= 768;
      window.addEventListener('resize', this.onResize.bind(this));
    }
    this.router.events.subscribe(() => {
      this.isLoginPage = this.router.url === '/';
    });
  }

  toggleSidebar() {
    this.sidebarService.toggleMenu();
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.onResize();
    }
  }

  onResize() {
    if (this.isBrowser) {
      this.isMobile = window.innerWidth <= 768;
    }
  }
}
