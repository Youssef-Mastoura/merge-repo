import { Component, OnInit } from '@angular/core';
import { Reclamation } from 'src/app/back-office/models/reclamation';
import { ReclamationService } from 'src/app/services/reclamation-b.service';

@Component({
  selector: 'app-claim',
  templateUrl: './claim.component.html',
  styleUrls: ['./claim.component.css']
})
export class ClaimComponent implements OnInit {

  allReclamations: Reclamation[] = [];
  filteredReclamations: Reclamation[] = [];
  searchValue: string = ''; 
  updateReclamation(_t28: Reclamation) {
    throw new Error('Method not implemented.');
    }
    
      reclamations: Reclamation[] = [];
    
      constructor(private reclamationService: ReclamationService) {}
    
      ngOnInit(): void {
        // Récupérer toutes les réclamations
        this.reclamationService.getAllReclamations().subscribe(data => {
          this.reclamations = data;
        });
}



// Méthode pour supprimer une réclamation
deleteReclamation(reclamation: Reclamation): void {
  if (confirm(`Do you really want to delete the claim? #${reclamation.idReclamation}?`)) {
    this.reclamationService.deleteReclamation(reclamation.idReclamation!).subscribe(
      (response) => {
        // Supprimer la réclamation du tableau local après la suppression réussie
        this.reclamations = this.reclamations.filter(r => r.idReclamation !== reclamation.idReclamation);
        alert('Claim successfully deleted');
      },
      (error) => {
        console.error('Error while deleting:', error); // Affichage de l'erreur dans la console pour le débogage
        alert(`An error occurred while deleting: ${error.message}`);
      }
    );
  }
}


searchStatus: string = '';


    searchByStatus() {
      if (!this.searchStatus.trim()) {
        this.reclamations = [];
        return;
      }
    
      this.reclamationService.getByStatus(this.searchStatus.trim().toUpperCase())
        .subscribe({
          next: (data) => {
            this.reclamations = data;
          },
          error: (err) => {
            console.error('Erreur lors de la récupération des réclamations par statut', err);
            this.reclamations = [];
          }
        });
    }
  
  

   


}



