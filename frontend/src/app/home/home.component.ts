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
    // Fetch all voyages for home page slider
    this.http.get<any[]>('http://localhost:3000/api/voyages').subscribe({
      next: (data) => this.voyages = data,
      error: (err) => console.error('Error fetching voyages:', err)
    });

    // Fetch all hotels for home page slider
    this.http.get<any[]>('http://localhost:3000/api/hotels').subscribe({
      next: (data) => this.hotels = data,
      error: (err) => console.error('Error fetching hotels:', err)
    });
  }

  setSearchType(type: 'hotel' | 'voyage' | 'bus') {
    this.searchType = type;
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
}
