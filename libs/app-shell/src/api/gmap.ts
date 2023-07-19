import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AddressComponentType, GeoLocationResponse, ReverseGeocodeResponse } from '@easworks/models';
import { firstValueFrom } from 'rxjs';
import { ENVIRONMENT } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class GMapsApi {
  private readonly http = inject(HttpClient);
  private readonly apiKey = inject(ENVIRONMENT).gMapApiKey;

  geolocateByIPAddress() {
    return firstValueFrom(this.http.post<GeoLocationResponse>(`https://www.googleapis.com/geolocation/v1/geolocate?key=${this.apiKey}`, null));
  }

  reverseGeocode(
    coords: { lat: number, lng: number },
    components: AddressComponentType[] = []
  ) {
    let params = new HttpParams()
      .set('key', this.apiKey)
      .set('latlng', `${coords.lat},${coords.lng}`);

    const result_type = components.join('|');
    if (result_type)
      params = params.set('result_type', result_type);

    return firstValueFrom(this.http.get<ReverseGeocodeResponse>(`https://maps.googleapis.com/maps/api/geocode/json`, { params }));
  }
}

