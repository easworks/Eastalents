import { Injectable } from '@angular/core';
import { Deferred } from '../utilities/deferred';

@Injectable({
  providedIn: 'root'
})
export class GeoLocationService {
  status() {
    return navigator.permissions.query({
      name: 'geolocation'
    })
  }
  async get(silent = false) {
    try {
      if (silent) {
        const status = await this.status();
        if (status.state !== 'granted')
          return null;
      }

      const location = new Deferred<GeolocationPosition>();
      navigator.geolocation.getCurrentPosition(pos => location.resolve(pos), location.reject, {
        enableHighAccuracy: true,
        maximumAge: 0,
      });

      return await location;
    }
    catch (e) {
      console.error(e)
      return null;
    }
  }
}