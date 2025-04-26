import { Component } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ReponseReclamationService } from 'src/app/services/reponse-reclamation.service';
import { Reponse } from 'src/app/back-office/models/reponse';

@Component({
  selector: 'app-add-reponse',
  templateUrl: './add-reponse.component.html',
  styleUrls: ['./add-reponse.component.css']
})
export class AddReponseComponent {
  reponse: Reponse = {
    contenu: '',
    id: 1,
    dateReponse: new Date()
  };
  reclamationId: number =1; // à récupérer dynamiquement plus tard (ex: via route)

  constructor(private reponseService: ReponseReclamationService) {}

  onSubmit() {
    

    this.reponseService.addReponse(this.reponse, this.reclamationId).subscribe({
      next: (res) => {
        console.log('Réponse ajoutée avec succès', res);
        alert('Recorded response ✅');
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout', err);
        alert('Error ❌');
      }
    });
  }


}
