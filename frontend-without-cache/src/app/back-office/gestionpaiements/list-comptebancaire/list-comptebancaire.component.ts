import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ComptebancaireService } from 'src/app/services/comptebancaire.service';
import { CompteBancaire } from '../../models/CompteBancaire';

@Component({
  selector: 'app-list-comptebancaire',
  templateUrl: './list-comptebancaire.component.html',
  styleUrls: ['./list-comptebancaire.component.css']
})
export class ListComptebancaireComponent {

  comptes!:CompteBancaire[];
  i:number=0
   constructor(private comptebancaireService: ComptebancaireService,private router:Router) 
   { }


  ngOnInit()
  {
    this.comptebancaireService.getAllCompteBancaire().subscribe(
      data => {
        this.comptes = data;
        console.log(this.comptes)
      },
      error => {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
      }
    )
  }

  voirDetails(id:any)
  {
    id=Number(id)
    this.router.navigate(['admin/detailscomptebancaire',id])
  }

  supprimerCompte(id:any)
  {
    id=Number(id)
    this.comptebancaireService.deleteCompteBancaire(id).subscribe(
      data =>{
        console.log(data)
        console.log("deleted")
        this.comptes = this.comptes.filter(compte => compte.idCompteBancaire !== id);

      },
      error=>{
        console.log(error)
      }
    )
  }

  ajouter()
  {
    this.router.navigate(['admin/addcomptebancaire'])
  }

  modifierCompte(id:any)
  {
    id=Number(id)
    this.router.navigate(['admin/updatecomptebancaire',id])
  }


}
