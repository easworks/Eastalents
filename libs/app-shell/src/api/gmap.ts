import { HttpClient } from '@angular/common/http';
import { Injectable, inject, isDevMode } from '@angular/core';
import { ENVIRONMENT } from '../environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GMapsApi {
  protected readonly http = inject(HttpClient);
  protected readonly apiUrl = 'https://www.googleapis.com';
  protected readonly apiKey = inject(ENVIRONMENT).gMapApiKey;

  private readonly devMode = isDevMode();

  geolocateByIPAddress() {
    if (this.devMode) {
      const stored = localStorage.getItem('geolocateByIPAddress') || 'null';
      const parsed = JSON.parse(stored) as GeoLocationResponse;
      if (parsed)
        return parsed;
    }

    const response = firstValueFrom(this.http.post<GeoLocationResponse>(`${this.apiUrl}/geolocation/v1/geolocate?key=${this.apiKey}`, null));
    if (this.devMode)
      response.then(r => localStorage.setItem('geolocateByIPAddress', JSON.stringify(r)));
    return response;
  }

}

interface GeoLocationResponse {
  accuracy: number;
  location: {
    lat: number;
    lng: number;
  },
}
