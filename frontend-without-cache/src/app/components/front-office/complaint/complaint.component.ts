import { Component, OnInit } from '@angular/core';
import { Reponse } from 'src/app/back-office/models/reponse';
import { ReponseService } from 'src/app/services/reponse.service';
@Component({
  selector: 'app-complaint',
  templateUrl: './complaint.component.html',
  styleUrls: ['./complaint.component.css']
})
export class ComplaintComponent implements OnInit {
  reponses: Reponse[] = [];
  isLoading = true;
  errorMessage = '';
  userId = 115; // Valeur statique pour démo

  constructor(private reponseService: ReponseService) {}

  ngOnInit(): void {
    this.loadUserResponses();
  }

  loadUserResponses(): void {
    this.reponseService.getReponsesByUserId(this.userId).subscribe({
      next: (data) => {
        this.reponses = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.errorMessage = 'Erreur lors du chargement des réponses';
        this.isLoading = false;
      }
    });
  }

 
  deleteReponse(id: number): void {
    if (!id) {
      console.error('ID invalide pour la suppression');
      return;
    }
  
    if (confirm('Êtes-vous sûr de vouloir supprimer cette réponse ?')) {
      this.reponseService.deleteReponse(id).subscribe({
        next: () => {
          console.log('Suppression réussie pour ID:', id);
          this.reponses = this.reponses.filter(r => r.id !== id);
        },
        error: (err) => {
          console.error('Erreur de suppression - Détails:', {
            id: id,
            error: err,
            url: `http://localhost:8089/pi_cloud/reponses/delete/${id}`
          });
          this.errorMessage = 'Échec de la suppression. Veuillez réessayer.';
        }
      });
    }
  }
 
}