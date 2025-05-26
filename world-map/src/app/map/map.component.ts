import { ChangeDetectorRef, Component, OnInit, NgZone } from '@angular/core';
import { CountryService, Country } from '../services/country.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  countries: Country[] = [];
  selectedCountry: Country | null = null;
  loading = true;
  error: string | null = null;
  
  constructor(
    private countryService: CountryService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) { }
  
  ngOnInit() {
    this.loadCountries();
    //adding a delay 
    setTimeout(() => {
      this.setupMapInteraction();
    }, 1500);
    
  }
  
  loadCountries() {
    this.loading = true;
    this.countryService.getCountries().subscribe({
      next: (data) => {
        this.countries = data;
        this.loading = false;
        console.log('Countries loaded:', this.countries.length);
      },
      error: (err) => {
        this.error = 'Failed to load countries';
        this.loading = false;
        console.error('Error loading countries:', err);
      }
    });
  }
  
  setupMapInteraction() {
    const svgObject = document.querySelector('.svg-map') as HTMLObjectElement;
    
    if (svgObject && svgObject.contentDocument) {
      const svgDoc = svgObject.contentDocument;
      const countryPaths = svgDoc.querySelectorAll('path[id]');
      
      countryPaths.forEach(path => {
        path.addEventListener('click', (event) => {
          const target = event.target as SVGPathElement;
          const countryCode = target.id;
          this.selectCountryByCode(countryCode);
        });
        
        path.addEventListener('mouseover', (event) => {
          const target = event.target as SVGPathElement;
          target.style.fill = '#90caf9';
        });
        
        path.addEventListener('mouseout', (event) => {
          const target = event.target as SVGPathElement;
          target.style.fill = '';
        });
      });
    }
  }
  
  selectCountryByCode(code: string) {
    console.log('Country code clicked:', code);
    const country = this.countries.find(c => c.iso2Code?.toLowerCase() === code.toLowerCase());
    
    if (country) {
      console.log('Country found:', country);
      this.selectedCountry = country;
      this.cdr.detectChanges();
    }
    else {
      console.log('Country Code not matching!');
    }
  }
}