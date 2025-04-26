import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';
import { Category } from '../../models/category.model';
@Component({
  selector: 'app-admin-category',
  templateUrl: './admin-category.component.html',
  styleUrls: ['./admin-category.component.css']
})
export class AdminCategoryComponent {
// Données
categories: Category[] = [];
filteredCategories: Category[] = [];
newCategory: Category = { name_Category: '' };

// États
isLoading = true;
errorMessage = '';
showDeleteModal = false;
categoryToDelete: number | null = null;

// Édition
editingCategoryId: number | null = null;
editingCategoryName = '';

// Tri et recherche
sortBy = 'name_asc';
searchTerm = '';

constructor(private categoryService: CategoryService) {}

ngOnInit(): void {
  this.loadCategories();
}

// Chargement des données
loadCategories(): void {
  this.isLoading = true;
  this.categoryService.getAllCategories().subscribe({
    next: (data) => {
      this.categories = data;
      this.filteredCategories = [...data];
      this.sortCategories();
      this.isLoading = false;
    },
    error: (err) => {
      this.errorMessage = 'Erreur lors du chargement des catégories';
      this.isLoading = false;
      console.error(err);
    }
  });
}

// Ajout d'une catégorie
addCategory(): void {
  if (!this.newCategory.name_Category.trim()) {
    this.errorMessage = 'Le nom de la catégorie ne peut pas être vide';
    return;
  }

  this.categoryService.addCategory(this.newCategory).subscribe({
    next: () => {
      this.loadCategories();
      this.newCategory = { name_Category: '' };
      this.errorMessage = '';
    },
    error: (err) => {
      this.errorMessage = err.error?.message || 'Erreur lors de l\'ajout';
    }
  });
}

// Édition
startEdit(category: Category): void {
  this.editingCategoryId = category.id_Category || null;
  this.editingCategoryName = category.name_Category;
}

saveEdit(): void {
  if (!this.editingCategoryId || !this.editingCategoryName.trim()) return;

  const updatedCategory = {
    id_Category: this.editingCategoryId,
    name_Category: this.editingCategoryName
  };

  this.categoryService.updateCategory(updatedCategory).subscribe({
    next: () => {
      this.loadCategories();
      this.cancelEdit();
    },
    error: (err) => {
      this.errorMessage = err.error?.message || 'Erreur lors de la modification';
    }
  });
}

cancelEdit(): void {
  this.editingCategoryId = null;
  this.editingCategoryName = '';
}

// Suppression
confirmDelete(id: number): void {
  this.categoryToDelete = id;
  this.showDeleteModal = true;
}

deleteCategory(): void {
  if (!this.categoryToDelete) return;

  this.categoryService.deleteCategory(this.categoryToDelete).subscribe({
    next: () => {
      this.loadCategories();
      this.showDeleteModal = false;
    },
    error: (err) => {
      this.errorMessage = err.error?.message || 'Erreur lors de la suppression';
      this.showDeleteModal = false;
    }
  });
}

// Recherche et filtrage
filterCategories(): void {
  if (!this.searchTerm) {
    this.filteredCategories = [...this.categories];
  } else {
    const term = this.searchTerm.toLowerCase();
    this.filteredCategories = this.categories.filter(category =>
      category.name_Category.toLowerCase().includes(term)
    );
  }
  this.sortCategories();
}

// Tri
sortCategories(): void {
  switch (this.sortBy) {
    case 'name_asc':
      this.filteredCategories.sort((a, b) => 
        a.name_Category.localeCompare(b.name_Category)
      );
      break;
    case 'name_desc':
      this.filteredCategories.sort((a, b) => 
        b.name_Category.localeCompare(a.name_Category)
      );
      break;
    case 'date_asc':
      case 'date_desc':
      // Implémentez le tri par date si vos catégories ont une propriété createdAt
      break;
  }
}
}