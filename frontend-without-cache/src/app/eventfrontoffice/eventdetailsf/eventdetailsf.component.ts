import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { myevent } from '../../event';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { registration } from '../../registration';
import { EventserviceServicef } from '../serviceseventf/eventservicef.service';

declare const google: any;

@Component({
  selector: 'app-eventdetailsf',
  templateUrl: './eventdetailsf.component.html',
  styleUrls: ['./eventdetailsf.component.css']
})
export class EventdetailsfComponent implements OnInit, AfterViewInit {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  map: any;
  marker: any;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventserviceServicef,
    private sanitizer: DomSanitizer
  ) {}

  eventId!: number;
  eventData!: myevent;
  videoUrl!: SafeResourceUrl;
  eventDuration: string = '';
  showSuccessModal: boolean = false;
  showAlreadyRegisteredModal: boolean = false;

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
    this.eventService.getEvent(this.eventId).subscribe(data => {
      this.eventData = data;
      if (this.eventData.videoURL) {
        const embedUrl = this.convertToEmbedUrl(this.eventData.videoURL);
        this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
      }
      this.calculateEventDuration();
    });
  }

  ngAfterViewInit(): void {
    if (typeof google === 'undefined') {
      this.loadGoogleMapsScript();
    } else {
      this.initMap();
    }
  }

  loadGoogleMapsScript() {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => this.initMap();
    document.head.appendChild(script);
  }

  initMap() {
    if (!this.eventData?.location) return;

    try {
      const coords = this.eventData.location.split(',');
      if (coords.length === 2 && !isNaN(parseFloat(coords[0])) && !isNaN(parseFloat(coords[1]))) {
        const latLng = new google.maps.LatLng(parseFloat(coords[0]), parseFloat(coords[1]));
        this.createMap(latLng);
      } else {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: this.eventData.location }, (results: any, status: any) => {
          if (status === 'OK' && results[0]) {
            const latLng = results[0].geometry.location;
            this.createMap(latLng);
          }
        });
      }
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }

  createMap(latLng: any) {
    const mapOptions = {
      center: latLng,
      zoom: 15,
      disableDefaultUI: true,
      zoomControl: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(this.mapContainer.nativeElement, mapOptions);

    this.marker = new google.maps.Marker({
      position: latLng,
      map: this.map,
      title: this.eventData.eventName
    });

    const infoWindow = new google.maps.InfoWindow({
      content: `<h5>${this.eventData.eventName}</h5><p>${this.eventData.location}</p>`
    });

    this.marker.addListener('click', () => {
      infoWindow.open(this.map, this.marker);
    });
  }

  convertToEmbedUrl(url: string): string {
    const shortMatch = url.match(/^https?:\/\/youtu\.be\/([a-zA-Z0-9_-]+)/);
    const fullMatch = url.match(/^https?:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);

    if (shortMatch && shortMatch[1]) {
      return `https://www.youtube.com/embed/${shortMatch[1]}`;
    }
    if (fullMatch && fullMatch[1]) {
      return `https://www.youtube.com/embed/${fullMatch[1]}`;
    }
    return url;
  }

  registration: registration = {
    isSelected: false,
    eventregis: {} as myevent,
    user: {} as any
  };
  
  register(eventId: number): void {
    const userId = 1; 
    this.registration.user = { userId };
    this.registration.eventregis.eventId = Number(this.route.snapshot.paramMap.get('id'));
    this.eventService.checkregistration(userId, eventId).subscribe((hasGivenRegistration: boolean) => {
      if (hasGivenRegistration) {
        this.showAlreadyRegisteredModal = true;
      } else {
        this.eventService.register(this.registration, userId, eventId).subscribe(
          response => {
            console.log('User registered successfully:', response);
            this.showSuccessModal = true;
          },
          error => {
            console.error('Error registering user:', error);
            this.showAlreadyRegisteredModal = true;
          }
        );
      }
    });
  }

  closeModal(): void {
    this.showSuccessModal = false;
    this.showAlreadyRegisteredModal = false;
  }

  calculateEventDuration(): void {
    const start = new Date(this.eventData.eventStartDate);
    const end = new Date(this.eventData.eventEndDate);

    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

    if (diffDays == 1) {
      this.eventDuration = `${diffDays} day `;
    } else {
      this.eventDuration = `${diffDays} days `;
    }
  }
  isEventNotStarted(event: myevent): boolean {
    const currentDate = new Date();
    return new Date(event.eventStartDate) > currentDate;
  }
  
  // Check if registration period has passed
  isRegistrationClosed(event: myevent): boolean {
    const currentDate = new Date();
    return new Date(event.registrationEndDate) < currentDate;
  }
  activeIndex: number | null = null;

toggleAccordion(index: number): void {
  this.activeIndex = this.activeIndex === index ? null : index;
}
}