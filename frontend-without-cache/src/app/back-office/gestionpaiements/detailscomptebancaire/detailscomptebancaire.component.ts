import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComptebancaireService } from 'src/app/services/comptebancaire.service';
import { CompteBancaire } from '../../models/CompteBancaire';

@Component({
  selector: 'app-detailscomptebancaire',
  templateUrl: './detailscomptebancaire.component.html',
  styleUrls: ['./detailscomptebancaire.component.css']
})
export class DetailscomptebancaireComponent {
  comptebancaire!:CompteBancaire
  id!:number



  constructor(private comptebancaireService: ComptebancaireService,private route:ActivatedRoute) { }



  ngOnInit(): void {

    this.id=this.route.snapshot.params['id']

    this.comptebancaireService.getCompteBancaireById(this.id).subscribe(
      data => {
        this.comptebancaire = data;
        console.log(this.comptebancaire)
      },
      error => {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
      }
    )
  }

  

  getQRCodeData(comptebancaire: CompteBancaire): string
  {
    return JSON.stringify(comptebancaire);
  }

}
