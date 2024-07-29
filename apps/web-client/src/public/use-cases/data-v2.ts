import { Type } from '@angular/core';

export interface UseCaseRouteData {
  id: string;
  dynamicComponents: {
    hero: Type<unknown>;
    details: Type<unknown>;
    overview: Type<unknown>;
    process: Type<unknown>;
  };
}
