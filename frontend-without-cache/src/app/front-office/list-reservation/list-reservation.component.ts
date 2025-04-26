import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Reservation } from 'src/app/back-office/models/Reservation';
import { ReservationService } from 'src/app/services/reservation.service';


@Component({
  selector: 'app-list-reservation',
  templateUrl: './list-reservation.component.html',
  styleUrls: ['./list-reservation.component.css']
})
export class ListReservationComponent {

  reservations!: Reservation[];

  constructor(private reservationService:ReservationService,private router:Router){}
  

  ngOnInit() {
    this.reservationService.getReservationsByUserId(118).subscribe(
      res => {
        this.reservations = res;
        console.log(this.reservations);
        console.log("res");
      },
      err => {
        console.log(err);
      }
    )
  }

  supprimerReservation(id:any)
  {
    id=Number(id)
    this.reservationService.deleteReservation(id).subscribe(
      res => {
        console.log(res);
        this.ngOnInit();
      },
      err => {
        console.log(err);
      }
    )
  }

  gotochatbot()
  {
    this.router.navigate(['student/chatbotpaiement']);
  }

}
