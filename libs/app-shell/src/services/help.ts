import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelpCenterService {
  private readonly assets = '/assets/pages/help-center/content';

  async getCategories() {
    return fetch(`${this.assets}/all.json`)
      .then(r => r.json() as Promise<HelpCategory[]>);
  }

  async getGroups(category: string, hydrate = false) {
    const all = await fetch(`${this.assets}/${category}/all.json`)
      .then(r => r.json() as Promise<HelpGroup[]>);

    if (hydrate)
      await Promise.all(all.map(g => this.hydrateGroup(category, g)));

    return all;
  }

  async hydrateGroup(category: string, group: HelpGroup) {
    const d = await fetch(`${this.assets}/${category}/${group.slug}.json`)
      .then(r => r.json());
    group.items.forEach(i => Object.assign(i, d[i.slug]));
  }
}


export interface HelpItem {
  slug: string;
  title: string;
  content: string[];
}

export interface HelpGroup {
  slug: string;
  title: string;
  items: HelpItem[];
  link: string;
}

export interface HelpCategory {
  title: string;
  slug: string;
  groups: HelpGroup[];
}