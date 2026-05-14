import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-voyages',
  templateUrl: './voyages.component.html',
  styleUrls: ['./voyages.component.scss']
})
export class VoyagesComponent implements OnInit {
  voyages: any[] = [];
  allVoyages: any[] = [];
  uniqueDestinations: string[] = [];
  cityFilter: string | null = null;
  sortOption: string = 'recommandation';
  searchData = {
    destination: '',
    month: '',
    people: 1
  };
  searchType: 'hotel' | 'voyage' | 'bus' = 'voyage';

  setSearchType(type: 'hotel' | 'voyage' | 'bus') {
    this.searchType = type;
    if (type === 'hotel') this.router.navigate(['/hotels']);
    if (type === 'voyage') this.router.navigate(['/voyages']);
    if (type === 'bus') this.router.navigate(['/bus']);
  }

  // Modal logic
  selectedVoyage: any = null;
  modalStep: 'details' | 'vols' | 'contact' | 'success' = 'details';
  volsAvailable: any[] = [];
  selectedVol: any = null;
  selectedCompagnie: any = null;

  // Contact form
  contact = { nom: '', prenom: '', portable: '', email: '' };
  submitting = false;

  // Destination metadata (images for the destination selection view)
  destImages: { [key: string]: string } = {
    'istanbul': 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600',
    'dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600',
    'paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600',
    'sharm-el-sheikh': 'https://images.unsplash.com/photo-1510011560141-62c7e8fc7908?w=600',
    'cairo': 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=600',
    'rome': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600',
    'barcelona': 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600',
    'phuket': 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=600',
    'bali': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600'
  };

  uniqueCountries: any[] = [];
  countryFilter: string | null = null;

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.cityFilter = params['city'] || params['destination'] || null;
      this.countryFilter = params['pays'] || params['country'] || null;
      this.searchData.destination = this.cityFilter || this.countryFilter || '';
      this.searchData.month = params['month'] || '';
      this.searchData.people = params['people'] ? parseInt(params['people']) : 1;
      this.fetchVoyages();
    });
  }

  onSearch() {
    this.cityFilter = this.searchData.destination;
    this.countryFilter = null; // Search defaults to city/destination
    this.fetchVoyages();
  }

  fetchVoyages() {
    this.http.get<any[]>('/api/voyages?all=true').subscribe({
      next: (data) => {
        this.allVoyages = data;
        this.uniqueDestinations = [...new Set(data.filter(v => v.destination).map(v => v.destination.toLowerCase()))];
        
        // Group by country for the "Initial" view
        const countryMap = new Map();
        data.forEach(v => {
          if (v.pays) {
            const countryKey = v.pays.toLowerCase();
            if (!countryMap.has(countryKey)) {
              countryMap.set(countryKey, {
                name: v.pays,
                image: v.image // use first voyage image as country cover
              });
            }
          }
        });
        this.uniqueCountries = Array.from(countryMap.values());
        
        this.filterAndSort();
      },
      error: (err) => console.error('Error fetching voyages:', err)
    });
  }

  filterAndSort() {
    if (this.cityFilter) {
      this.voyages = this.allVoyages.filter(v => v.destination && v.destination.toLowerCase() === this.cityFilter?.toLowerCase());
    } else if (this.countryFilter) {
      this.voyages = this.allVoyages.filter(v => v.pays && v.pays.toLowerCase() === this.countryFilter?.toLowerCase());
    } else {
      this.voyages = []; 
    }
    this.applySort();
  }

  selectCountry(country: string) {
    this.router.navigate(['/voyages'], { queryParams: { pays: country } });
  }

  selectDestination(dest: string) {
    this.router.navigate(['/voyages'], { queryParams: { city: dest } });
  }

  onSortChange() {
    this.applySort();
  }

  applySort() {
    if (this.sortOption === 'price_asc') {
      this.voyages.sort((a, b) => (a.discountPrice_adult || a.price_adult) - (b.discountPrice_adult || b.price_adult));
    } else if (this.sortOption === 'price_desc') {
      this.voyages.sort((a, b) => (b.discountPrice_adult || b.price_adult) - (a.discountPrice_adult || a.price_adult));
    } else if (this.sortOption === 'duration') {
      this.voyages.sort((a, b) => b.duree - a.duree);
    }
  }

  openModal(voyage: any) {
    this.selectedVoyage = voyage;
    this.modalStep = 'details';
    this.volsAvailable = [];
    this.selectedVol = null;
    this.selectedCompagnie = null;
    this.contact = { nom: '', prenom: '', portable: '', email: '' };
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.selectedVoyage = null;
    document.body.style.overflow = '';
  }

  goToVols() {
    this.modalStep = 'vols';
    const dest = this.selectedVoyage.destination;
    this.http.get<any[]>(`/api/vols?destination=${dest}`).subscribe({
      next: (data) => this.volsAvailable = data,
      error: (err) => console.error(err)
    });
  }

  selectCompagnie(vol: any, compagnie: any) {
    this.selectedVol = vol;
    this.selectedCompagnie = compagnie;
  }

  goToContact() {
    this.modalStep = 'contact';
  }

  submitDevis() {
    this.submitting = true;
    const payload = {
      type: 'vol',
      reference_id: this.selectedVoyage._id,
      reference_nom: this.selectedVoyage.titre,
      nom: this.contact.nom,
      prenom: this.contact.prenom,
      portable: this.contact.portable,
      email: this.contact.email,
      compagnie: this.selectedCompagnie ? this.selectedCompagnie.nom : 'Non spécifié',
      classe: this.selectedCompagnie ? this.selectedCompagnie.classe : 'Non spécifié',
      prix_total: this.selectedCompagnie ? this.selectedCompagnie.prix_adulte : 0
    };
    this.http.post('/api/reservations', payload).subscribe({
      next: () => { this.modalStep = 'success'; this.submitting = false; },
      error: (err) => { console.error(err); this.submitting = false; }
    });
  }
}
