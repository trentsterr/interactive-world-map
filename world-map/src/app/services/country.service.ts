import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Country {
  id: string;
  name: string;
  capital: string;
  region: string;
  incomeLevel: string;
  longitude?: number;
  latitude?: number;
  iso2Code?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private apiUrl = 'https://api.worldbank.org/v2/country';
  
  constructor(private http: HttpClient) { }
  
  getCountries(): Observable<Country[]> {
    return this.http.get<any>(`${this.apiUrl}?format=json&per_page=300`)
      .pipe(
        map(response => {
        const countries = response[1];
          
          return countries.map((country: any) => ({
            id: country.id,
            name: country.name,
            capital: country.capitalCity,
            region: country.region.value,
            incomeLevel: country.incomeLevel.value,
            longitude: country.longitude,
            latitude: country.latitude,
            iso2Code: country.iso2Code
          }));
        })
      );
  }
  
  getCountryById(id: string): Observable<Country> {
    return this.http.get<any>(`${this.apiUrl}/${id}?format=json`)
      .pipe(
        map(response => {
          const country = response[1][0];
          return {
            id: country.id,
            name: country.name,
            capital: country.capitalCity,
            region: country.region.value,
            incomeLevel: country.incomeLevel.value,
            longitude: country.longitude,
            latitude: country.latitude,
            iso2Code: country.iso2Code
          };
        })
      );
  }
}