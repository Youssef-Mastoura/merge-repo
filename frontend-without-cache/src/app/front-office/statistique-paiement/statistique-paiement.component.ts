import { Component } from '@angular/core';
import { Paiement } from 'src/app/back-office/models/Paiement';
import { PaiementService } from 'src/app/services/paiement.service';


@Component({
  selector: 'app-statistique-paiement',
  templateUrl: './statistique-paiement.component.html',
  styleUrls: ['./statistique-paiement.component.css']
})
export class StatistiquePaiementComponent {

  paiements: Paiement[] = [];
  soldeCount = 0;
  carteCount = 0;
  totalPaiements = 0;
  soldePourcentage = 0;
  cartePourcentage = 0;

  constructor(private paiementService: PaiementService) {}

  ngOnInit() {
    this.paiementService.getAllPaiements().subscribe(
      data => {
        this.paiements = data;
        console.log(this.paiements);
        this.calculerStatistiques();
      },
      error => {
        console.error("Erreur lors de la récupération des paiements :", error);
      }
    );
  }

  calculerStatistiques(): void {
    this.soldeCount = this.paiements.filter(p => p.mode === 'Solde').length;
    this.carteCount = this.paiements.filter(p => p.mode === 'Carte Bancaire').length;
    this.totalPaiements = this.soldeCount + this.carteCount;

    if (this.totalPaiements > 0) {
      this.soldePourcentage = (this.soldeCount / this.totalPaiements) * 100;
      this.cartePourcentage = (this.carteCount / this.totalPaiements) * 100;
    }
  }

}
