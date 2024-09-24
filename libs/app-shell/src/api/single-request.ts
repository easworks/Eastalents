import { Injectable } from '@angular/core';
import { finalize, Observable, share } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SingleRequest {
  private readonly map = new Map<string, Observable<unknown>>();

  public process<T>(
    id: string,
    request: Observable<T>
  ) {
    const cached = this.map.get(id);
    if (cached) return cached as Observable<T>;

    const obs = request.pipe(
      finalize(() => this.map.delete(id)),
      share()
    );

    this.map.set(id, obs);
    return obs;
  }
}