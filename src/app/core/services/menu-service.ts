import { Injectable } from '@angular/core';
import { MenuItem, MENUS_BY_ROLE } from '../interfaces/menu';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private roles: string[] = [];
  private cachedMenu: MenuItem[] | null = null;

  setRoles(roles: string[] | string) {
    this.roles = (Array.isArray(roles) ? roles : [roles]).map((r) => r.toLowerCase());
    this.cachedMenu = null; // reset cache
  }

  getMenu(): MenuItem[] {
    if (this.cachedMenu) return this.cachedMenu;

    const result: MenuItem[] = [];
    const seenSlugs = new Set<string>();

    for (const r of this.roles) {
      const list = (MENUS_BY_ROLE as any)[r];
      if (!list) continue;
      for (const item of list) {
        if (!seenSlugs.has(item.slug)) {
          result.push(item);
          seenSlugs.add(item.slug);
        } else {
          // merge children if same slug (utile si un user a plusieurs rôles)
          const existing = result.find((x) => x.slug === item.slug)!;
          if (item.children?.length) {
            existing.children = existing.children || [];
            for (const c of item.children) {
              if (!existing.children.some((ec) => ec.route === c.route)) existing.children.push(c);
            }
          }
        }
      }
    }

    this.cachedMenu = result;
    return result;
  }

  canAccessRoute(route: string): boolean {
    const menu = this.getMenu();
    for (const m of menu) {
      if (m.route === route) return true;
      if (m.children?.some((c) => c.route === route)) return true;
    }
    return false;
  }
}
