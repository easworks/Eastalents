import { Injectable } from '@angular/core';
import { Deferred } from '../utilities';

@Injectable({
  providedIn: 'root'
})
export class GeoLocationService {
  get() {
    const location = new Deferred<GeolocationPosition>();
    navigator.geolocation.getCurrentPosition(pos => location.resolve(pos), location.reject, {
      enableHighAccuracy: true,
      maximumAge: 0,
    });

    return location.catch(e => {
      console.error(e)
      return null;
    });
  }
}