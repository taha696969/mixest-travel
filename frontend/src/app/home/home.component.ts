import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  voyages: any[] = [];
  hotels: any[] = [];
  searchType: 'hotel' | 'voyage' | 'bus' = 'hotel';
  searchData = {
    destination: '',
    month: '',
    people: 1
  };

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    // Fetch and filter voyages for home page slider (only show promos)
    this.http.get<any[]>('/api/voyages').subscribe({
      next: (data) => this.voyages = data.filter(v => this.hasPromo(v, 'voyage')),
      error: (err) => console.error('Error fetching voyages:', err)
    });

    // Fetch and filter hotels for home page slider (only show promos)
    this.http.get<any[]>('/api/hotels').subscribe({
      next: (data) => this.hotels = data.filter(h => this.hasPromo(h, 'hotel')),
      error: (err) => console.error('Error fetching hotels:', err)
    });
  }

  setSearchType(type: 'hotel' | 'voyage' | 'bus') {
    this.searchType = type;
    if (type === 'hotel') this.router.navigate(['/hotels']);
    if (type === 'voyage') this.router.navigate(['/voyages']);
    if (type === 'bus') this.router.navigate(['/bus']);
  }

  scroll(elementId: string, direction: number) {
    const el = document.getElementById(elementId);
    if (el) {
      const scrollAmount = direction * 400;
      el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }

  onSearch() {
    let route = '/hotels';
    if (this.searchType === 'voyage') route = '/voyages';
    if (this.searchType === 'bus') route = '/bus';

    this.router.navigate([route], { 
      queryParams: { 
        city: this.searchData.destination,
        month: this.searchData.month,
        people: this.searchData.people
      } 
    });
  }

  goToVoyage(dest: string) {
    this.router.navigate(['/voyages'], { queryParams: { city: dest } });
  }

  goToHotel(dest: string) {
    this.router.navigate(['/hotels'], { queryParams: { city: dest } });
  }

  hasPromo(item: any, type: 'hotel' | 'voyage'): boolean {
    if (type === 'voyage') return !!item.discountPrice_adult;
    return !!(item.discountPrice_adult || this.hasSummerPrice(item));
  }

  hasSummerPrice(hotel: any): boolean {
    if (!hotel.summer_prices) return false;
    const s = hotel.summer_prices;
    return !!(s.june?.adult || s.july?.adult || s.august?.adult || s.september?.adult);
  }
}
