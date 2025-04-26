import { Component, ElementRef, ViewChild } from '@angular/core';
import { EventserviceService } from 'src/app/eventbackoffice/serviceseventback/eventservice.service';
import { Router } from '@angular/router';
import { myevent } from 'src/app/event';

@Component({
  selector: 'app-addevent',
  templateUrl: './addevent.component.html',
  styleUrls: ['./addevent.component.css']
})
export class AddeventComponent {
  event: myevent = {
    eventId: 0, 
    eventName: '',
    eventDescription: '',
    eventType: '',
    posterURL: '',
    videoURL: '',
    host:'',
    hostlinkedin: '',
    hostdescription: '',
    eventStartDate: new Date(),
    eventEndDate: new Date(),
    maxParticipants: 0,
    registrationEndDate: new Date(),
    location: ''
  };

  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  isUploading = false;

  @ViewChild('search') searchElementRef!: ElementRef;
  map!: google.maps.Map;
  marker!: google.maps.Marker;

  constructor(private eventService: EventserviceService, private router: Router) {}

  ngOnInit() {
    this.initMap();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    
    if (!input.files || input.files.length === 0) return;
  
    this.selectedFile = input.files[0];
    
    if (!this.selectedFile.type.match(/image\/*/)) {
      alert('Please select a valid image file (JPEG, PNG, etc.)');
      this.clearImageSelection();
      return;
    }

    // Validate file size (max 5MB)
    if (this.selectedFile.size > 5 * 1024 * 1024) {
      alert('Image must not exceed 5MB');
      this.clearImageSelection();
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(this.selectedFile);
  }

  clearImageSelection(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    this.event.posterURL = '';
    const fileInput = document.getElementById('posterUpload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  onSubmit(): void {
    if (!this.selectedFile) {
      alert('Please select an event poster image');
      return;
    }

    this.isUploading = true;

 
    setTimeout(() => {

      this.event.posterURL = this.imagePreview as string;
      
      this.eventService.createEvent(this.event).subscribe(
        response => {
          this.isUploading = false;
          console.log('Event created successfully:', response);
          this.router.navigate(['/admin/event']);
        },
        error => {
          this.isUploading = false;
          console.error('Error creating event:', error);
          alert('Error creating event. Please try again.');
        }
      );
    }, 1000);
  }

  initMap() {
    const defaultLocation = { lat: 36.8065, lng: 10.1815 }; // Tunisia coordinates
    this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
      center: defaultLocation,
      zoom: 12
    });
    this.map.addListener('click', (event: google.maps.MapMouseEvent) => {
      this.placeMarker(event.latLng!);
    });
    const searchBox = new google.maps.places.SearchBox(this.searchElementRef.nativeElement);
    this.map.addListener('bounds_changed', () => {
      searchBox.setBounds(this.map.getBounds()!);
    });
    searchBox.addListener('places_changed', () => {
      const places = searchBox.getPlaces();
      if (places?.length === 0) return;
      places?.forEach(place => {
        if (!place.geometry?.location) return;
        
        if (place.geometry.viewport) {
          this.map.fitBounds(place.geometry.viewport);
        } else {
          this.map.setCenter(place.geometry.location);
          this.map.setZoom(17);
        }
        this.placeMarker(place.geometry.location);
      });
    });
  }

  placeMarker(location: google.maps.LatLng) {
    if (this.marker) {
      this.marker.setMap(null);
    }
    this.marker = new google.maps.Marker({
      position: location,
      map: this.map,
      draggable: true
    });
    this.event.location = `${location.lat()},${location.lng()}`;
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location }, (results, status) => {
      if (status === 'OK' && results?.[0]) {
        this.event.location = results[0].formatted_address;
      }
    });
    this.marker.addListener('dragend', () => {
      const newLocation = this.marker.getPosition()!;
      this.event.location = `${newLocation.lat()},${newLocation.lng()}`;
    });
  }
}