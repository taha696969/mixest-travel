import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-hotels',
  templateUrl: './hotels.component.html',
  styleUrls: ['./hotels.component.scss']
})
export class HotelsComponent implements OnInit {
  hotels: any[] = [];
  cityFilter: string | null = null;
  selectedMonth: string | null = null;
  sortOption: string = 'recommandation';
  searchData = {
    destination: '',
    month: '',
    people: 1
  };
  searchType: 'hotel' | 'voyage' | 'bus' = 'hotel';

  setSearchType(type: 'hotel' | 'voyage' | 'bus') {
    this.searchType = type;
    if (type === 'hotel') this.router.navigate(['/hotels']);
    if (type === 'voyage') this.router.navigate(['/voyages']);
    if (type === 'bus') this.router.navigate(['/bus']);
  }

  // Modal
  selectedHotel: any = null;
  modalStep: 'details' | 'booking' | 'contact' | 'success' = 'details';

  // Booking form
  booking = { date_debut: '', date_fin: '', adultes: 1, enfants: 0 };
  totalPrice = 0;

  // Contact form
  contact = { nom: '', prenom: '', portable: '', email: '' };
  submitting = false;
  today: string = new Date().toISOString().split('T')[0];

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.cityFilter = params['destination'] || params['city'] || null;
      this.selectedMonth = params['month'] || null;
      this.searchData.destination = this.cityFilter || '';
      this.searchData.month = this.selectedMonth || '';
      this.searchData.people = params['people'] ? parseInt(params['people']) : 1;
      this.fetchHotels();
    });
  }

  onSearch() {
    this.cityFilter = this.searchData.destination;
    this.selectedMonth = this.searchData.month;
    this.fetchHotels();
  }

  fetchHotels() {
    let url = '/api/hotels';
    const params: string[] = [];
    if (this.cityFilter) params.push(`destination=${this.cityFilter}`);
    if (params.length > 0) url += `?${params.join('&')}`;
    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        this.hotels = data;
        this.applySort();
      },
      error: (err) => console.error('Error fetching hotels:', err)
    });
  }

  onSortChange() {
    this.applySort();
  }

  applySort() {
    if (this.sortOption === 'price_asc') {
      this.hotels.sort((a, b) => this.getDisplayPrice(a, 'adult') - this.getDisplayPrice(b, 'adult'));
    } else if (this.sortOption === 'price_desc') {
      this.hotels.sort((a, b) => this.getDisplayPrice(b, 'adult') - this.getDisplayPrice(a, 'adult'));
    } else if (this.sortOption === 'stars') {
      this.hotels.sort((a, b) => (b.etoiles || 0) - (a.etoiles || 0));
    }
  }

  openModal(hotel: any) {
    this.selectedHotel = hotel;
    this.modalStep = 'details';
    this.booking = { date_debut: '', date_fin: '', adultes: 1, enfants: 0 };
    this.contact = { nom: '', prenom: '', portable: '', email: '' };
    this.totalPrice = 0;
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.selectedHotel = null;
    document.body.style.overflow = '';
  }

  goToBooking() {
    this.modalStep = 'booking';
  }

  getNights(): number {
    if (!this.booking.date_debut || !this.booking.date_fin) return 0;
    const d1 = new Date(this.booking.date_debut);
    const d2 = new Date(this.booking.date_fin);
    const diff = Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  }

  calculateTotal() {
    // Calculation disabled as requested by user
    this.totalPrice = 0;
  }

  canProceedToContact(): boolean {
    return this.getNights() > 0 && this.booking.adultes >= 1;
  }

  goToContact() {
    this.modalStep = 'contact';
  }

  submitReservation() {
    this.submitting = true;
    const payload = {
      type: 'hotel',
      reference_id: this.selectedHotel._id,
      reference_nom: this.selectedHotel.nom,
      nom: this.contact.nom,
      prenom: this.contact.prenom,
      portable: this.contact.portable,
      email: this.contact.email,
      date_debut: this.booking.date_debut,
      date_fin: this.booking.date_fin,
      adultes: this.booking.adultes,
      enfants: this.booking.enfants,
      prix_total: this.totalPrice
    };
    this.http.post('/api/reservations', payload).subscribe({
      next: () => { this.modalStep = 'success'; this.submitting = false; },
      error: (err) => { console.error(err); this.submitting = false; }
    });
  }

  getDisplayPrice(hotel: any, type: 'adult' | 'kid'): number {
    const summerPrice = this.getSummerPrice(hotel, type);
    if (summerPrice !== null) return summerPrice;
    if (type === 'adult') return hotel.discountPrice_adult || hotel.price_adult;
    return hotel.discountPrice_kid || hotel.price_kid;
  }

  getSummerPrice(hotel: any, type: 'adult' | 'kid'): number | null {
    const month = this.selectedMonth?.toLowerCase();
    if (month && hotel.summer_prices) {
      let prices: any = null;
      if (month.includes('juin')) prices = hotel.summer_prices.june;
      else if (month.includes('juillet')) prices = hotel.summer_prices.july;
      else if (month.includes('août') || month.includes('aout')) prices = hotel.summer_prices.august;
      else if (month.includes('septembre')) prices = hotel.summer_prices.september;
      if (prices && prices[type]) return prices[type];
    }
    return null;
  }

  isSummerPriceActive(hotel: any): boolean {
    return this.getSummerPrice(hotel, 'adult') !== null;
  }

  getStars(n: number): number[] {
    return Array(n).fill(0);
  }
}
