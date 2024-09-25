import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { forkJoin, map, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HelpCenterService {
  private readonly assets = '/assets/public/help-center/content';

  private readonly http = inject(HttpClient);

  getCategories() {
    return this.http.get<HelpCategory[]>(`${this.assets}/all.json`);
  }

  getGroups(category: string, hydrate = false) {
    let all = this.http.get<HelpGroup[]>(`${this.assets}/${category}/all.json`);

    if (hydrate)
      all = all.pipe(
        switchMap(all =>
          forkJoin(all.map(g => this.hydrateGroup(category, g)))
            .pipe(map(() => all))
        )
      );

    return all;
  }

  hydrateGroup(category: string, group: HelpGroup) {
    return this.http.get<any>(`${this.assets}/${category}/${group.slug}.json`)
      .pipe(
        map(d => {
          group.items.forEach(i => Object.assign(i, d[i.slug]));
        }));
    ;
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
