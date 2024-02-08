import { Injectable } from '@angular/core';
import { BackendApi } from '@easworks/app-shell/api/backend';
import { TechSkill } from '../models/tech-skill';
import { CACHE } from '@easworks/app-shell/common/cache';

interface AdminDataDTO {
  skills: TechSkill[];
}

@Injectable({
  providedIn: 'root'
})
export class AdminApi extends BackendApi {
  private readonly DTO_KEY = 'dto';

  readonly get = async () => {
    const data = await CACHE.admin.get<AdminDataDTO>(this.DTO_KEY);

    return data || {
      skills: []
    } satisfies AdminDataDTO;
  };

  readonly save = async (dto: AdminDataDTO) => {
    await CACHE.admin.set(this.DTO_KEY, dto);
  };
}
