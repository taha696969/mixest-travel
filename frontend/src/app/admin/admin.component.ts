import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  currentTab: 'dashboard' | 'hotels' | 'voyages' | 'bus' | 'vols' | 'reservations' | 'cities' = 'dashboard';

  hotels: any[] = [];
  voyages: any[] = [];
  buses: any[] = [];
  vols: any[] = [];
  reservations: any[] = [];
  hotelCities: any[] = [];
  voyageCities: any[] = [];

  stats: any = {};

  hotelForm: any = this.initHotelForm();
  voyageForm: any = this.initVoyageForm();
  busForm: any = this.initBusForm();
  volForm: any = this.initVolForm();
  cityForm: any = { name: '', type: 'hotel', description: '', image: '', pays: '' };

  isEditing = false;

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadCities();
  }

  // ─── Stats ───────────────────────────────────────────────────────────────────
  loadStats() {
    this.http.get<any>('/api/stats').subscribe({
      next: (data) => this.stats = data,
      error: (err) => console.error(err)
    });
  }

  // ─── Cities ──────────────────────────────────────────────────────────────────
  loadCities() {
    this.http.get<any[]>('/api/cities?type=hotel').subscribe({
      next: (d) => this.hotelCities = d,
      error: (err) => console.error(err)
    });
    this.http.get<any[]>('/api/cities?type=voyage').subscribe({
      next: (d) => this.voyageCities = d,
      error: (err) => console.error(err)
    });
  }

  saveCity() {
    this.http.post('/api/cities', this.cityForm).subscribe({
      next: () => {
        this.cityForm = { name: '', type: 'hotel', description: '', image: '', pays: '' };
        this.loadCities();
        this.loadStats();
      },
      error: (err) => alert('Erreur: ' + (err.error?.message || err.message))
    });
  }

  deleteCity(id: string) {
    if (confirm('Supprimer cette ville ?')) {
      this.http.delete(`/api/cities/${id}`).subscribe({
        next: () => { this.loadCities(); this.loadStats(); },
        error: (err) => console.error(err)
      });
    }
  }

  // ─── Tab logic ───────────────────────────────────────────────────────────────
  initHotelForm() {
    return {
      disponible: true,
      summer_prices: {
        june:      { adult: null, kid: null },
        july:      { adult: null, kid: null },
        august:    { adult: null, kid: null },
        september: { adult: null, kid: null }
      }
    };
  }

  initVoyageForm() {
    return { disponible: true, stopPointsInput: '', stopPoints: [], pays: '', date_debut: '', date_fin: '', isCombined: false, destination2: '', places_dispo: 0 };
  }

  initBusForm() {
    return { disponible: true, stopPointsInput: '', stopPoints: [] };
  }

  initVolForm() {
    return { disponible: true, compagnies: [], isCombined: false, destination2: '' };
  }

  initVolCompagnieForm() {
    return { disponible: true, prix_adulte: 0, prix_enfant: 0, places_dispo: 0 };
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  switchTab(tab: any) {
    this.currentTab = tab;
    this.resetForm();
    if (tab !== 'dashboard' && tab !== 'cities') {
      this.fetchData(tab);
    }
    if (tab === 'dashboard') {
      this.loadStats();
    }
  }

  fetchData(type: string) {
    const allParam = type === 'reservations' ? '' : '?all=true';
    this.http.get<any[]>(`/api/${type}${allParam}`).subscribe({
      next: (data) => {
        if (type === 'hotels')       this.hotels = data;
        if (type === 'voyages')      this.voyages = data;
        if (type === 'bus')          this.buses = data;
        if (type === 'vols')         this.vols = data;
        if (type === 'reservations') this.reservations = data;
      },
      error: (err) => console.error(err)
    });
  }

  editItem(item: any) {
    this.isEditing = true;
    if (this.currentTab === 'hotels') {
      this.hotelForm = JSON.parse(JSON.stringify(item));
      if (!this.hotelForm.summer_prices) this.hotelForm.summer_prices = this.initHotelForm().summer_prices;
    } else if (this.currentTab === 'voyages') {
      this.voyageForm = { ...item, stopPointsInput: item.stopPoints ? item.stopPoints.join(', ') : '' };
    } else if (this.currentTab === 'bus') {
      this.busForm = { ...item };
    } else if (this.currentTab === 'vols') {
      this.volForm = JSON.parse(JSON.stringify(item));
    }
  }

  deleteItem(id: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
      this.http.delete(`/api/${this.currentTab}/${id}`).subscribe({
        next: () => { this.fetchData(this.currentTab); this.loadStats(); },
        error: (err) => console.error(err)
      });
    }
  }

  saveHotel() {
    const action = this.isEditing
      ? this.http.put(`/api/hotels/${this.hotelForm._id}`, this.hotelForm)
      : this.http.post('/api/hotels', this.hotelForm);
    action.subscribe({
      next: () => { this.fetchData('hotels'); this.resetForm(); this.loadStats(); },
      error: (err) => console.error(err)
    });
  }

  saveVoyage() {
    this.voyageForm.stopPoints = this.voyageForm.stopPointsInput
      ? this.voyageForm.stopPointsInput.split(',').map((s: string) => s.trim())
      : [];
    const action = this.isEditing
      ? this.http.put(`/api/voyages/${this.voyageForm._id}`, this.voyageForm)
      : this.http.post('/api/voyages', this.voyageForm);
    action.subscribe({
      next: () => { this.fetchData('voyages'); this.resetForm(); this.loadStats(); },
      error: (err) => console.error(err)
    });
  }

  saveBus() {
    const action = this.isEditing
      ? this.http.put(`/api/bus/${this.busForm._id}`, this.busForm)
      : this.http.post('/api/bus', this.busForm);
    action.subscribe({
      next: () => { this.fetchData('bus'); this.resetForm(); this.loadStats(); },
      error: (err) => console.error(err)
    });
  }

  saveVol() {
    const action = this.isEditing
      ? this.http.put(`/api/vols/${this.volForm._id}`, this.volForm)
      : this.http.post('/api/vols', this.volForm);
    action.subscribe({
      next: () => { this.fetchData('vols'); this.resetForm(); this.loadStats(); },
      error: (err) => console.error(err)
    });
  }

  addCompagnie() {
    this.volForm.compagnies.push({
      nom: '', logo: '', date_depart: '', date_arrivee: '',
      duree_texte: '', prix_adulte: 0, prix_enfant: 0,
      classe: 'Économique', disponible: true
    });
  }

  removeCompagnie(index: number) {
    this.volForm.compagnies.splice(index, 1);
  }

  updateReservationStatus(res: any, status: string) {
    this.http.put(`/api/reservations/${res._id}`, { statut: status }).subscribe({
      next: () => this.fetchData('reservations'),
      error: (err) => console.error(err)
    });
  }

  resetForm() {
    this.isEditing = false;
    if (this.currentTab === 'hotels')  this.hotelForm  = this.initHotelForm();
    if (this.currentTab === 'voyages') this.voyageForm = this.initVoyageForm();
    if (this.currentTab === 'bus')     this.busForm    = this.initBusForm();
    if (this.currentTab === 'vols')    this.volForm    = this.initVolForm();
  }

  hasPromo(item: any): boolean {
    return !!(item.discountPrice_adult || item.discountPrice_kid ||
              item.summer_prices?.june?.adult || item.summer_prices?.july?.adult ||
              item.summer_prices?.august?.adult || item.summer_prices?.september?.adult);
  }
}
