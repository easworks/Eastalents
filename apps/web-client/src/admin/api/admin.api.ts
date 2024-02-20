import { Injectable } from '@angular/core';
import { BackendApi } from '@easworks/app-shell/api/backend';
import { CACHE } from '@easworks/app-shell/common/cache';
import { AdminDataState } from '../models/admin-data';

@Injectable({
  providedIn: 'root'
})
export class AdminApi extends BackendApi {
  private readonly DTO_KEY = 'dto';

  readonly get = async () => {
    const data = await CACHE.admin.get<AdminDataState>(this.DTO_KEY);

    //data!.domains = [];
    //await this.save(data!);

    const state: AdminDataState = data || {
      skills: [],
      techGroups: [],
      easRoles: [],
      softwareProducts: [],
      domainModules: [],
      domains: [],
    };

    return state;
  };

  readonly save = async (dto: AdminDataState) => {
    await CACHE.admin.set(this.DTO_KEY, dto);
  };
}
