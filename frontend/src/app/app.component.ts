import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';
  isMenuOpen: boolean = false;
  navData: any = {
    hotelsByRegion: {},
    voyageCountries: []
  };

  constructor(private http: HttpClient) {
    this.fetchNavigation();
  }

  fetchNavigation() {
    this.http.get<any>('/api/navigation').subscribe({
      next: (data) => this.navData = data,
      error: (err) => console.error('Error fetching navigation:', err)
    });
  }
}
