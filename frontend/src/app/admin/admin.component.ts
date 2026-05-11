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
  currentTab: 'hotels' | 'voyages' | 'bus' | 'vols' | 'reservations' = 'hotels';
  
  hotels: any[] = [];
  voyages: any[] = [];
  buses: any[] = [];
  vols: any[] = [];
  reservations: any[] = [];

  hotelForm: any = this.initHotelForm();
  voyageForm: any = this.initVoyageForm();
  busForm: any = this.initBusForm();
  volForm: any = this.initVolForm();

  isEditing = false;

  hotelDestinations = [
    'sousse', 'monastir', 'mahdia', 'port-el-kantaoui', 'hammamet', 'nabeul', 
    'kelibia', 'djerba', 'zarzis', 'tozeur', 'douz', 'tunis', 'gammarth', 
    'tabarka', 'ain-drahem', 'bizerte'
  ];

  voyageDestinations = [
    'istanbul', 'dubai', 'sharm-el-sheikh', 'cairo', 'paris', 'rome', 
    'barcelona', 'madrid', 'phuket', 'bali', 'maldives'
  ];

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.fetchData('hotels');
  }

  initHotelForm() {
    return { 
      disponible: true,
      summer_prices: {
        june: { adult: null, kid: null },
        july: { adult: null, kid: null },
        august: { adult: null, kid: null },
        september: { adult: null, kid: null }
      }
    };
  }

  initVoyageForm() {
    return { disponible: true, stopPointsInput: '', stopPoints: [] };
  }

  initBusForm() {
    return { disponible: true };
  }

  initVolForm() {
    return { destination: '', pays: '', description: '', image: '', disponible: true, compagnies: [] };
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  switchTab(tab: 'hotels' | 'voyages' | 'bus' | 'vols' | 'reservations') {
    this.currentTab = tab;
    this.resetForm();
    this.fetchData(tab);
  }

  fetchData(type: string) {
    const allParam = type === 'reservations' ? '' : '?all=true';
    this.http.get<any[]>(`http://localhost:3000/api/${type}${allParam}`).subscribe({
      next: (data) => {
        if (type === 'hotels') this.hotels = data;
        if (type === 'voyages') this.voyages = data;
        if (type === 'bus') this.buses = data;
        if (type === 'vols') this.vols = data;
        if (type === 'reservations') this.reservations = data;
      },
      error: (err) => console.error(err)
    });
  }

  editItem(item: any) {
    this.isEditing = true;
    if (this.currentTab === 'hotels') {
      this.hotelForm = JSON.parse(JSON.stringify(item));
      if (!this.hotelForm.summer_prices) {
        this.hotelForm.summer_prices = this.initHotelForm().summer_prices;
      }
    } else if (this.currentTab === 'voyages') {
      this.voyageForm = { ...item, stopPointsInput: item.stopPoints ? item.stopPoints.join(', ') : '' };
    } else if (this.currentTab === 'bus') {
      this.busForm = { ...item };
    } else if (this.currentTab === 'vols') {
      this.volForm = JSON.parse(JSON.stringify(item));
    }
  }

  deleteItem(id: string) {
    if(confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
      this.http.delete(`http://localhost:3000/api/${this.currentTab}/${id}`).subscribe({
        next: () => this.fetchData(this.currentTab),
        error: (err) => console.error(err)
      });
    }
  }

  saveHotel() {
    const action = this.isEditing 
      ? this.http.put(`http://localhost:3000/api/hotels/${this.hotelForm._id}`, this.hotelForm)
      : this.http.post('http://localhost:3000/api/hotels', this.hotelForm);

    action.subscribe({
      next: () => { this.fetchData('hotels'); this.resetForm(); },
      error: (err) => console.error(err)
    });
  }

  saveVoyage() {
    this.voyageForm.stopPoints = this.voyageForm.stopPointsInput
      ? this.voyageForm.stopPointsInput.split(',').map((s: string) => s.trim())
      : [];
    const action = this.isEditing
      ? this.http.put(`http://localhost:3000/api/voyages/${this.voyageForm._id}`, this.voyageForm)
      : this.http.post('http://localhost:3000/api/voyages', this.voyageForm);

    action.subscribe({
      next: () => { this.fetchData('voyages'); this.resetForm(); },
      error: (err) => console.error(err)
    });
  }

  saveBus() {
    const action = this.isEditing
      ? this.http.put(`http://localhost:3000/api/bus/${this.busForm._id}`, this.busForm)
      : this.http.post('http://localhost:3000/api/bus', this.busForm);

    action.subscribe({
      next: () => { this.fetchData('bus'); this.resetForm(); },
      error: (err) => console.error(err)
    });
  }

  saveVol() {
    const action = this.isEditing
      ? this.http.put(`http://localhost:3000/api/vols/${this.volForm._id}`, this.volForm)
      : this.http.post('http://localhost:3000/api/vols', this.volForm);

    action.subscribe({
      next: () => { this.fetchData('vols'); this.resetForm(); },
      error: (err) => console.error(err)
    });
  }

  addCompagnie() {
    this.volForm.compagnies.push({ 
      nom: '', 
      logo: '', 
      date_depart: '', 
      date_arrivee: '', 
      duree_texte: '', 
      prix_adulte: 0, 
      prix_enfant: 0, 
      classe: 'Économique', 
      disponible: true 
    });
  }

  removeCompagnie(index: number) {
    this.volForm.compagnies.splice(index, 1);
  }

  updateReservationStatus(res: any, status: string) {
    this.http.put(`http://localhost:3000/api/reservations/${res._id}`, { statut: status }).subscribe({
      next: () => this.fetchData('reservations'),
      error: (err) => console.error(err)
    });
  }

  resetForm() {
    this.isEditing = false;
    if (this.currentTab === 'hotels') this.hotelForm = this.initHotelForm();
    if (this.currentTab === 'voyages') this.voyageForm = this.initVoyageForm();
    if (this.currentTab === 'bus') this.busForm = this.initBusForm();
    if (this.currentTab === 'vols') this.volForm = this.initVolForm();
  }
}
