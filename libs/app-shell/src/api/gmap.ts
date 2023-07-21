import { Injectable, inject, isDevMode } from '@angular/core';
import { AddressComponentType, GeoLocationResponse, GeocodeResponse } from '@easworks/models';
import { ENVIRONMENT } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class GMapsApi {
  private readonly devMode = isDevMode();
  private readonly apiKey = inject(ENVIRONMENT).gMapApiKey;

  geolocateByIPAddress() {
    const url = new URL('https://www.googleapis.com/geolocation/v1/geolocate');
    url.searchParams.set('key', this.apiKey);
    return fetch(url, { method: 'POST' })
      .then(async res => {
        await this.handleErrorsIfAny(res);
        return res.json() as Promise<GeoLocationResponse>;
      });
  }

  reverseGeocode(
    coords: { lat: number, lng: number },
    components: AddressComponentType[] = []
  ) {
    const url = new URL('https://maps.googleapis.com/maps/api/geocode/json');
    url.searchParams.set('key', this.apiKey);
    url.searchParams.set('latlng', `${coords.lat},${coords.lng}`);
    const result_type = components.join('|');
    if (result_type)
      url.searchParams.set('result_type', result_type);

    return fetch(url)
      .then(async res => {
        await this.handleErrorsIfAny(res);
        return res.json() as Promise<GeocodeResponse>;
      });
  }

  private async handleErrorsIfAny(response: Response) {
    if (!response.ok) {
      const body = await response.json();
      if (this.devMode) {
        console.error(body);
      }
      throw body;
    }
  }
}

