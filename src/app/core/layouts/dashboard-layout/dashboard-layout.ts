import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../../shared/sidebar-component/sidebar-component';
import { NavbarComponent } from '../../../shared/navbar-component/navbar-component';

@Component({
  selector: 'app-dashboard-layout',
  imports: [RouterOutlet, SidebarComponent, NavbarComponent],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css',
})
export class DashboardLayout {
  ngAfterViewInit(): void {
    const scrollable = document.getElementById('scrollable');
    const content = document.getElementById('content');
    const navHeight = 64; // 16rem * 4px = 64px

    scrollable?.addEventListener('scroll', () => {
      if (scrollable.scrollTop > 0) {
        content!.style.paddingTop = navHeight + 'px';
      } else {
        content!.style.paddingTop = '0px';
      }
    });
  }
}
