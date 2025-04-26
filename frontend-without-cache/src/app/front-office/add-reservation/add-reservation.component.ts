import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { CompteBancaire } from 'src/app/back-office/models/CompteBancaire';
import { Course } from 'src/app/back-office/models/course.model';
import { Reservation } from 'src/app/back-office/models/Reservation';
import { User } from 'src/app/back-office/models/user';
import { ComptebancaireService } from 'src/app/services/comptebancaire.service';
import { ReservationService } from 'src/app/services/reservation.service';

import Swal from 'sweetalert2';
@Component({
  selector: 'app-add-reservation',
  templateUrl: './add-reservation.component.html',
  styleUrls: ['./add-reservation.component.css']
})
export class AddReservationComponent {

  reservationForm!: FormGroup;
  course!: Course;
  panierx!: number;
  user!: User;
  comptebancaire!: CompteBancaire;
  reservationUser!: Reservation[];
  idC!:number

  constructor(
    private reservationService: ReservationService, 
    private router: Router,
    private comptebancaireService: ComptebancaireService,
    private route:ActivatedRoute
  ) { }


  verifCourse(reservations: Reservation[]) {
      for (let i = 0; i < reservations.length; i++) {
        if (reservations[i].course.id_Course === this.course.id_Course) {
          return true;
        }
      }
      return false;
    }


  ngOnInit(): void {
    this.idC=this.route.snapshot.params['id'];
    console.log(this.idC)

    this.reservationService.getUserById(118).subscribe(user => {
      this.user = user;
      console.log(user);

      this.reservationService.getReservationsByUserId(118).subscribe(res => {
        this.reservationUser = res;
        console.log(this.reservationUser);    
      },
      err => {
        console.log(err);
      }
    )
     
      this.comptebancaireService.getCompteByUser(118).subscribe(compte => {
        this.comptebancaire = compte;
        console.log(this.comptebancaire);
      });

      this.reservationService.getCourseById(this.idC).subscribe(course => {
        this.course = course;
        console.log(this.course);
        this.reservationForm = new FormGroup({
          comments: new FormControl('', [Validators.required]),
          course: new FormControl(this.course, [Validators.required]),
          user: new FormControl(this.user, [Validators.required]),
        });
      });
    });
  }

  onSubmit() {
    if (this.reservationForm.valid) {
      const reservation: Reservation = this.reservationForm.value;


      if(this.verifCourse(this.reservationUser)){
        alert("Vous avez deja une reservation pour ce cours");
      }
      else 
      {

        if(this.comptebancaire.montant < this.course.price_Course){
          Swal.fire({
                    icon: 'error',
                    title: 'Solde insuffisant',
                    text: 'Votre solde est insuffisant pour effectuer ce paiement.',
                    confirmButtonColor: '#d33',
                  });
                  return;
        }
        else
        {
      this.reservationService.addReservation(reservation).subscribe(
        (res) => {
          this.reservationService.panier = this.reservationService.panier + this.course.price_Course;
          this.panierx = this.reservationService.panier;

          console.log('Reservation created successfully', res);
            this.router.navigate(['student/addpaiement',res.idReservation]);
        },
        (error) => {
          console.error('Erreur lors de la création de la reservation', error);
        }
      );
    }
  }
  }
  }

}
