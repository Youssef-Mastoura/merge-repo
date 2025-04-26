import { Component, ElementRef, ViewChild } from '@angular/core';
import { EventserviceService } from 'src/app/eventbackoffice/serviceseventback/eventservice.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { myevent } from '../../event';

@Component({
  selector: 'app-modifyevent',
  templateUrl: './modifyevent.component.html',
  styleUrls: ['./modifyevent.component.css']
})
export class ModifyeventComponent {
  eventId!: number;
  event: myevent = {} as myevent;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  isUploading = false;

  @ViewChild('search') searchElementRef!: ElementRef;
  map!: google.maps.Map;
  marker!: google.maps.Marker;

  constructor(private route: ActivatedRoute, private eventService: EventserviceService, private router: Router) {}

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
    this.eventService.getEvent(this.eventId).subscribe(data => {
      this.event = data;
      if (this.event.posterURL) {
        this.imagePreview = this.event.posterURL;
      }
    });
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

    if (this.selectedFile.size > 5 * 1024 * 1024) {
      alert('Image must not exceed 5MB');
      this.clearImageSelection();
      return;
    }

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
    this.isUploading = true;

    if (this.selectedFile && this.imagePreview) {
      this.event.posterURL = this.imagePreview as string;
    }

    this.eventService.updateEvent(this.eventId, this.event).subscribe(
      () => {
        this.isUploading = false;
        alert('Event updated successfully!');
        this.router.navigate(['/admin/event']);
      },
      error => {
        this.isUploading = false;
        console.error('Error updating event:', error);
        alert('Error updating event. Please try again.');
      }
    );
  }

  initMap() {
    const defaultLocation = { lat: 36.8065, lng: 10.1815 };
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