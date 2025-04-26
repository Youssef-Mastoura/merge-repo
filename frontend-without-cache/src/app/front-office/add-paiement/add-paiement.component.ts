import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';
import { CompteBancaire } from 'src/app/back-office/models/CompteBancaire';
import { Course } from 'src/app/back-office/models/course.model';
import { Paiement } from 'src/app/back-office/models/Paiement';
import { Reservation } from 'src/app/back-office/models/Reservation';
import { User } from 'src/app/back-office/models/user';
import { ComptebancaireService } from 'src/app/services/comptebancaire.service';
import { PaiementService } from 'src/app/services/paiement.service';
import { ReservationService } from 'src/app/services/reservation.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-paiement',
  templateUrl: './add-paiement.component.html',
  styleUrls: ['./add-paiement.component.css']
})
export class AddPaiementComponent {
  paiementForm!:FormGroup
  id!:number
  course!:Course
  user!:User
  compte!:CompteBancaire
  paiement!:Paiement
  reservation!:Reservation
  showCardInput: boolean = false;

  
  clientSecret!: string;
  public payPalConfig?: IPayPalConfig

  

  constructor(private paiementService:PaiementService,private router:Router,private route:ActivatedRoute,
    private compteBancaireService:ComptebancaireService,
    private reservationService:ReservationService
  ){}

  ngOnInit()
  {
     this.initConfig();
    this.id=this.route.snapshot.params['id']  
    this.reservationService.getReservationById(this.id).subscribe(
      data => {
        this.reservation = data;
        console.log(data)
        this.paiementForm = new FormGroup({
          montant: new FormControl(this.reservation.course.price_Course),
          mode: new FormControl('',Validators.required),
        })
      },
      error => {
        console.error("Erreur lors de la récupération des cours :", error);
      }
    )
    this.paiementService.getUserById(118).subscribe(
      data => {
        console.log(data)
        this.user = data;
      },
      error => {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
      }
    )

    this.compteBancaireService.getCompteByUser(118).subscribe(
      data => {
        this.compte=data
        console.log(data)
      },
      err=>{
        console.log(err)
      }
    )
  }


  onSubmit() {
    if (this.paiementForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Formulaire invalide',
        text: 'Veuillez remplir tous les champs requis.',
        confirmButtonColor: '#3085d6',
      });
      return;
    }
  
    this.paiement = this.paiementForm.value;
    this.paiement.user = this.user;
    this.paiement.reservation = this.reservation;
  
    // Vérification du compte bancaire AVANT paiement
    if (this.paiementForm.value.mode === "Solde") {
      if (!this.compte) {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Compte bancaire introuvable.',
        });
        return;
      }
  
      if (this.compte.montant < this.paiement.montant) {
        Swal.fire({
          icon: 'error',
          title: 'Solde insuffisant',
          text: 'Votre solde est insuffisant pour effectuer ce paiement.',
          confirmButtonColor: '#d33',
        });
        return;
      }
    }
  
    // Si la vérification est réussie, on effectue le paiement
    this.paiementService.addPaiement(this.paiement).subscribe(
      data => {
        this.paiement = data;
        console.log("Paiement ajouté avec succès :", data);
        
        this.paiementService.downloadFacture(this.paiement.idPaiement!).subscribe(
          blob => {
            const fileURL = URL.createObjectURL(blob);
            window.open(fileURL);
            console.log("Facture downloaded successfully");
          },
          error => {
            console.error("Erreur lors de la récupération de la facture :", error);
          }
        );
  
        if (this.paiementForm.value.mode === "Solde") {
          this.compte.user = this.user;
          this.compte.montant -= this.paiement.montant;
  
          this.reservationService.updateReservation(this.reservation).subscribe(
            updateData => {
              console.log("Reservation mise à jour :", updateData);
            },
            updateError => {
              console.error("Erreur mise à jour reservation :", updateError);
            }
          );
  
          this.compteBancaireService.updateCompteBancaire(this.compte).subscribe(
            updateData => {
              console.log("Compte mis à jour :", updateData);
              Swal.fire({
                icon: 'success',
                title: 'Paiement effectué avec succès.',
                text: 'Votre solde a été mis à jour.',
                confirmButtonColor: '#28a745',
              });
              this.router.navigate(['student/listreservation']);
            },
            updateError => {
              console.error("Erreur mise à jour compte :", updateError);
              Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Une erreur est survenue lors de la mise à jour du compte.',
              });
            }
          );
        } else {
          // Si ce n'est pas un paiement par Solde (ex: carte), simple succès
          Swal.fire({
            icon: 'success',
            title: 'Paiement effectué avec succès.',
            confirmButtonColor: '#28a745',
          });
          this.router.navigate(['student/listreservation']);
        }
      },
      error => {
        console.error("Erreur lors du paiement :", error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Une erreur est survenue lors de l\'ajout du paiement.',
        });
      }
    );
  }

  private initConfig(): void {
    this.payPalConfig = {
      currency: 'EUR',
      clientId: 'sb', // Remplace par ton Client ID PayPal
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'EUR',
            value: '10.00',
            breakdown: {
              item_total: {
                currency_code: 'EUR',
                value: '10.00'
              }
            }
          },
          items: [{
            name: 'Produit Exemple',
            quantity: '1',
            category: 'DIGITAL_GOODS',
            unit_amount: {
              currency_code: 'EUR',
              value: '10.00',
            },
          }]
        }]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        console.log('Transaction approuvée', data);
        actions.order.capture().then((details: any) => {
          console.log('Détails de la transaction :', details);
        });
      },
      onClientAuthorization: (data: any) => { 
        console.log('Transaction réussie !', data);
      },
      onCancel: (data, actions) => {
        console.log('Paiement annulé', data);
      },
      onError: (err) => {
        console.log('Erreur de paiement', err);
      }
    };
  }



}
