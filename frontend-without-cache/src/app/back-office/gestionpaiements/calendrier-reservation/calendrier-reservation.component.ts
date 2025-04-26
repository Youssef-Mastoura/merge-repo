import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { ReservationService } from 'src/app/services/reservation.service';
import { Reservation } from '../../models/Reservation';

@Component({
  selector: 'app-calendrier-reservation',
  templateUrl: './calendrier-reservation.component.html',
  styleUrls: ['./calendrier-reservation.component.css']
})
export class CalendrierReservationComponent {

  currentYear!: number;
  currentMonth!: number;
  daysInMonth: any[] = [];
  reservations: Reservation[] = [];



  constructor(private reservationService: ReservationService,private router:Router)
  {
    const today = new Date();
    this.currentYear = today.getFullYear();
    this.currentMonth = today.getMonth();
  }

  ngOnInit(): void {
    this.generateCalendar();
    this.loadReservations();
  }

    generateCalendar() {
      this.daysInMonth = [];
      const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
      const totalDays = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
  
      for (let i = 0; i < firstDay; i++) {
        this.daysInMonth.push(null); 
      }
  
      for (let day = 1; day <= totalDays; day++) {
        this.daysInMonth.push({ day, reservations: [] });
      }
    }
  
    loadReservations() {
      this.reservationService.getAllReservations().subscribe((reservations: Reservation[]) => {
        this.reservations = reservations;
  
        this.reservations.forEach(reservation => {
          const resDate = new Date(reservation.date);
          if (resDate.getMonth() === this.currentMonth && resDate.getFullYear() === this.currentYear) {
            const dayIndex = resDate.getDate() - 1 + new Date(this.currentYear, this.currentMonth, 1).getDay();
            if (this.daysInMonth[dayIndex]) {
              this.daysInMonth[dayIndex].reservations.push(reservation);
            }
          }
        });
      });
    }
  
    // Changer de mois
    changeMonth(offset: number) {
      this.currentMonth += offset;
      if (this.currentMonth < 0) {
        this.currentMonth = 11;
        this.currentYear--;
      } else if (this.currentMonth > 11) {
        this.currentMonth = 0;
        this.currentYear++;
      }
      this.generateCalendar();
      this.loadReservations();
    }

    showStatistics()
    {
      this.router.navigate(['admin/statistiquepaiement']);

    }

}
