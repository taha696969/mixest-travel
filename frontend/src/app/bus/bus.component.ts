import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-bus',
  templateUrl: './bus.component.html',
  styleUrls: ['./bus.component.scss']
})
export class BusComponent implements OnInit {
  buses: any[] = [];

  constructor(private http: HttpClient) {}

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
