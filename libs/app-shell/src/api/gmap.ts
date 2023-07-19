import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject, isDevMode } from '@angular/core';
import { ENVIRONMENT } from '../environment';
import { firstValueFrom } from 'rxjs';
import { AddressComponentType, GeoLocationResponse, ReverseGeocodeResponse } from '@easworks/models';

@Injectable({
  providedIn: 'root'
})
export class GMapsApi {
  protected readonly http = inject(HttpClient);
  protected readonly apiKey = inject(ENVIRONMENT).gMapApiKey;

  private readonly devMode = isDevMode();

  geolocateByIPAddress() {
    return firstValueFrom(this.http.post<GeoLocationResponse>(`https://www.googleapis.com/geolocation/v1/geolocate?key=${this.apiKey}`, null));
  }

  reverseGeocode(
    coords: { lat: number, lng: number },
    components: AddressComponentType[] = []
  ) {
    let params = new HttpParams();
    params = params.set('key', this.apiKey);
    params = params.set('latlng', `${coords.lat},${coords.lng}`);
    const result_type = components.join('|');
    if (result_type)
      params = params.set('result_type', result_type);

    return firstValueFrom(this.http.get<ReverseGeocodeResponse>(`https://maps.googleapis.com/maps/api/geocode/json`, { params }));
  }
}

