export type AddressComponentType = 'country' | 'postal_code' | 'administrative_area_level_1' | 'locality';

export interface AddressComponent {
  types: AddressComponentType[];
  long_name: string;
  short_name: string;
}

export interface LatLng {
  lat: number;
  lng: number;
}

export interface GeoLocationResponse {
  accuracy: number;
  location: LatLng;
}

export interface GeocodeResult {
  types: AddressComponentType[];
  address_components: AddressComponent[];
}

export interface GeocodeResponse {
  status: 'OK' | 'ZERO_RESULTS';
  results: GeocodeResult[];
}
