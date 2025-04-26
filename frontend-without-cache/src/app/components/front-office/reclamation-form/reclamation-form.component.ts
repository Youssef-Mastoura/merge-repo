import { Component } from '@angular/core';
import { Reponse } from 'src/app/back-office/models/reponse';
import { User } from 'src/app/back-office/models/user';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Reclamation } from 'src/app/back-office/models/reclamation';
import { ReclamtionService } from 'src/app/services/reclamtion.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-reclamation-form',
  templateUrl: './reclamation-form.component.html',
  styleUrls: ['./reclamation-form.component.css']
})
export class ReclamationFormComponent {
  reclamation: Reclamation = {
    type: '',
    description: '',
    solution: '',
    priorite: 'LOW',
    status: 'PENDING',
    dateSubmitted: new Date(),
    reponse: { id: 1 } as Reponse,
    user: { id_User: 115 } as User
  };

  message = '';
  error = '';

 
  constructor(
    private reclamationService: ReclamtionService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.message = '';
    this.error = '';

    // Validation supplémentaire
    if (!this.reclamation.description || this.reclamation.description.length < 10) {
      this.error = 'The description must contain at least 10 characters';
      return;
    }

    this.reclamationService.addReclamation(this.reclamation).subscribe({
      next: () => {
        this.message = 'Claim added successfully!';
        setTimeout(() => this.router.navigate(['/reclamations']), 1500);
      },
      error: (err) => {
        this.error = err.message || 'An error has occurred';
      }
    });
  }}