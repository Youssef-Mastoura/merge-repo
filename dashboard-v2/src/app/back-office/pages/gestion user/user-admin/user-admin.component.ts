import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/back-office/models/user'; 
import { UserService } from 'src/app/services/user.service'; 
type SearchCriteriaKeys = 'firstName' | 'lastName' | 'email' | 'role';

@Component({
  selector: 'app-user-admin',
  templateUrl: './user-admin.component.html',
  styleUrls: ['./user-admin.component.css']
})

export class UserAdminComponent implements OnInit {
  users: User[] = [];
  searchTerm: string = '';
  filteredUsers: any[] = []; // Liste filtrée pour l'affichage
  isLoading = true;
  errorMessage = '';


  searchCriteria = {
    firstName: true,
    lastName: true,
    email: true,
    role: true
    
  };
  paginatedUsers: User[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(private userService: UserService) {}
  filterOptions = [
    { key: 'firstName', label: 'Prénom' },
    { key: 'lastName', label: 'Nom' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Rôle' }
  ];

  ngOnInit(): void {
    this.loadUsers();
  }
  exportdata():void
  {
  
      this.userService.exportUsersToExcel();
    }
  

  loadUsers(): void {

    this.isLoading = true;
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.filteredUsers = [...users]; // Initialise filteredUsers
        this.updatePaginatedUsers();


        this.isLoading = false;
        console.log('Liste des utilisateurs chargée :', this.users);

      },
      
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des utilisateurs';
        this.isLoading = false;
        console.error(err);
      }
    });
    console.log('Liste des utilisateurs :', this.users);

  }
  updatePaginatedUsers(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedUsers = this.filteredUsers.slice(startIndex, startIndex + this.itemsPerPage);
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.updatePaginatedUsers();
  }
  getDisplayRange(): string {
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, this.filteredUsers.length);
    return `${start} à ${end}`;
  }
  get totalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
  }

  get pageNumbers(): number[] {
    return Array.from({length: this.totalPages}, (_, i) => i + 1);
  }
  filterUsers(): void {
    if (!this.searchTerm) {
      this.filteredUsers = [...this.users];
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(user => {
      let matches = false;
      
      if (this.searchCriteria.firstName && user?.first_Name?.toLowerCase().includes(term)) {
        matches = true;
      }
      
      if (!matches && this.searchCriteria.lastName && user?.last_Name?.toLowerCase().includes(term)) {
        matches = true;
      }
      
      if (!matches && this.searchCriteria.email && user?.email?.toLowerCase().includes(term)) {
        matches = true;
      }
      
      if (!matches && this.searchCriteria.role && user?.role?.toLowerCase().includes(term)) {
        matches = true;
      }
      
      return matches;
    });
    this.currentPage = 1; // Réinitialiser à la première page après filtrage
    this.updatePaginatedUsers();
  }
  toggleSearchCriteria(criteria: SearchCriteriaKeys): void {
    this.searchCriteria[criteria] = !this.searchCriteria[criteria];
    this.filterUsers();
  }

  deleteUser(userId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
         this.users = this.users.filter(user => user.id_User !== userId);
        },
        error: (err) => {
          console.error('Erreur lors de la suppression', err);
        }
      });

    }
  }
// Dans votre composant
selectedUser: User | null = null;

openDetailsModal(user: User): void {
  this.selectedUser = user;
}

banUser(userId: number): void {
  // Implémentez la logique de bannissement ici
}
  
}