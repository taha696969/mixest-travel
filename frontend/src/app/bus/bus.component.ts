import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bus',
  templateUrl: './bus.component.html',
  styleUrls: ['./bus.component.scss']
})
export class BusComponent implements OnInit {
  buses: any[] = [];
  searchData = { destination: '', month: '', people: 1 };
  searchType: 'hotel' | 'voyage' | 'bus' = 'bus';

  constructor(private http: HttpClient, private router: Router) {}

  setSearchType(type: 'hotel' | 'voyage' | 'bus') {
    this.searchType = type;
    if (type === 'hotel') this.router.navigate(['/hotels']);
    if (type === 'voyage') this.router.navigate(['/voyages']);
    if (type === 'bus') this.router.navigate(['/bus']);
  }

  onSearch() {
    // Basic redirect for bus search
    let route = '/bus';
    if (this.searchType === 'voyage') route = '/voyages';
    if (this.searchType === 'hotel') route = '/hotels';
    this.router.navigate([route], { 
      queryParams: { 
        city: this.searchData.destination,
        month: this.searchData.month,
        people: this.searchData.people
      } 
    });
  }

  ngOnInit(): void {
    this.fetchBuses();
  }

  fetchBuses() {
    this.http.get<any[]>('/api/bus').subscribe({
      next: (data) => this.buses = data,
      error: (err) => console.error('Error fetching buses:', err)
    });
  }
}
