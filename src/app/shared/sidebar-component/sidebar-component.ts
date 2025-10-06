import { Component, inject, Input, OnInit } from '@angular/core';
import { MenuItem } from '../../core/interfaces/menu';
import { Router, RouterModule } from '@angular/router';
import { MenuService } from '../../core/services/menu-service';
import { AuthenticationService } from '../../authentication/services/authentication-service';

@Component({
  selector: 'app-sidebar-component',
  imports: [RouterModule],
  templateUrl: './sidebar-component.html',
  styleUrl: './sidebar-component.css',
})
export class SidebarComponent implements OnInit {
  @Input() roles: string[] = [];

  menu: MenuItem[] = [];
  open: Record<string, boolean> = {};

  private router: Router = inject(Router);
  private menuService: MenuService = inject(MenuService);
  private authentService: AuthenticationService = inject(AuthenticationService);

  ngOnInit() {
    if (this.roles && this.roles.length) {
      this.menuService.setRoles(this.roles);
    }

    const roles = this.authentService.getUserRole();
    this.menuService.setRoles(roles);

    this.menu = this.menuService.getMenu();

    // init open state: open first item
    for (const m of this.menu) this.open[m.slug] = false;

    // open parent if active route is inside it
    this.router.events.subscribe(() => {
      const url = this.router.url;
      this.menu.forEach((m) => {
        this.open[m.slug] =
          m.children?.some((c) => this.matchRoute(url, c.route)) || url.startsWith(m.route);
      });
    });
  }

  toggle(slug: string) {
    this.open[slug] = !this.open[slug];
  }

  navigate(route: string) {
    this.router.navigate([route]);
  }

  logout() {
    this.authentService.logout();
    this.router.navigate(['/authentication']);
  }

  isActiveParent(item: MenuItem) {
    const url = this.router.url;

    if (url === item.route) return true;
    if (item.children?.some((c) => this.matchRoute(url, c.route))) return true;
    return false;
  }

  private matchRoute(current: string, routePattern: string) {
    // naive match that supports :id segments
    const patternParts = routePattern.split('/').filter(Boolean);
    const curParts = current.split('/').filter(Boolean);
    if (patternParts.length !== curParts.length) {
      // allow parent route match (e.g. /medecin/patient/123 matches /medecin/patient/:id)
      if (patternParts.length > curParts.length) return false;
    }
    for (let i = 0; i < patternParts.length; i++) {
      if (!curParts[i]) return false;
      const p = patternParts[i];
      if (p.startsWith(':')) continue;
      if (p !== curParts[i]) return false;
    }
    return true;
  }
}
