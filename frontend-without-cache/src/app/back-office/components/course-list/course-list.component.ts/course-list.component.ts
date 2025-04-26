import { Component, OnInit } from '@angular/core';
import { Course,  } from '../../../models/course.model';
import { CourseService } from 'src/app/services/course.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category.service';
import { Category } from '../../../models/category.model';
import { ActivatedRoute } from '@angular/router';
import { CourseType } from '../../../models/course.model';

@Component({
  selector: 'app-professor-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit {
  courses: Course[] = [];
  categories: Category[] = [];
  loading = true;
  error = '';
  allCourses: Course[] = [];
  filteredCourses: Course[] = [];
  searchQuery = ''; 
  sortOption: string = '';
  currentPage = 1;
  itemsPerPage = 6;
  popularCourses: Course[] = [];

  staticStudentId = 2; // ID statique pour l'étudiant
  staticTeacherId = 1; // ID statique pour le professeur


  hoveredRating: number = 0;
  selectedRating: { [courseId: number]: number } = {};

  constructor(
    private courseService: CourseService,
    private authService: AuthService,
    private router: Router,
    private categoryService: CategoryService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadCourses();
    const courseId = this.route.snapshot.paramMap.get('id');
    const rating = this.route.snapshot.paramMap.get('rating');
    this.loadPopularCourses(); // Ajoutez cet appel

  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe(
      (categories) => {
        this.categories = categories;
      },
      (error) => {
        console.error('Erreur lors du chargement des catégories', error);
      }
    );
  }

  loadCourses(): void {
    /*const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }*/

    this.loading = true;
    this.courseService.getAllCourses().subscribe(
      (courses) => {
        this.allCourses = courses;
        this.filteredCourses = courses;
        this.loading = false;
      },
      (error) => {
        console.error('Erreur lors du chargement des cours', error);
        this.error = 'Impossible de charger les cours. Veuillez réessayer plus tard.';
        this.loading = false;
      }
    );
  }

  onSearch() {
    if (this.searchQuery.trim() === '') {
      this.filteredCourses = this.allCourses;
    } else {
      this.filteredCourses = this.allCourses.filter(course => 
        course.title_Course.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
        course.description_Course.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }

  onSortChange(): void {
    if (this.sortOption === 'price') {
      this.filteredCourses.sort((a, b) => a.price_Course - b.price_Course);
    } else if (this.sortOption === 'duration') {
      this.filteredCourses.sort((a, b) => a.duration_Course - b.duration_Course);
    } else if (this.sortOption === 'rating') {
      this.filteredCourses.sort((a, b) => (b.rating_Course ?? 0) - (a.rating_Course ?? 0));
    }
  }

  filterByCategory(categoryName: string) {
    this.filteredCourses = this.allCourses.filter(course => course.name_Category === categoryName);
  }

  onDeleteCourse(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
      this.courseService.deleteCourse(id).subscribe(
        () => {
          alert('Cours supprimé avec succès');
          this.loadCourses();
        },
        (error) => {
          console.error('Erreur lors de la suppression du cours', error);
          alert('Erreur lors de la suppression du cours');
        }
      );
    }
  }



  onManageContents(id: number): void {
    const course = this.allCourses.find(c => c.id_Course === id);
    



    this.courseService.incrementViewCount(id).subscribe({
      next: () => {
      
          
       
      
      
            this.router.navigate(['/admin/courses', id, 'contents']);
          },
          error: (err) => {
            console.error('Failed to fetch contents', err);
            this.router.navigate(['/admin/courses', id, 'contents']);
          }
        });
      }
  
  onManageCategories(): void {
    this.router.navigate(['/admin/categories']);
  }

  // Génère la liste des pages pour la pagination
  get pages(): number[] {
    const totalPages = Math.ceil(this.filteredCourses.length / this.itemsPerPage);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredCourses.length / this.itemsPerPage);
  }

  get paginatedCourses() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredCourses.slice(start, start + this.itemsPerPage);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  onHoverStar(courseId: number, rating: number) {
    this.hoveredRating = rating;
  }

  onLeaveStar() {
    this.hoveredRating = 0;
  }

  onRate(course: Course, rating: number) {
    course.rating_Course = rating;

    this.courseService.rateCourse(course.id_Course!, rating).subscribe({
      next: () => {
        console.log('Note enregistrée avec succès !');
        this.loadCourses(); // tu peux aussi faire une redirection si besoin
      },
      error: err => {
        console.error('Erreur lors de la notation :', err);
      }
    });
  }
  trackByCategory(index: number, category: any): string {
    return category.id_Category;
  }
  
  trackByCourse(index: number, course: any): string {
    return course.id_Course;
  }
 
  toggleFaq(faq: any): void {
    faq.isOpen = !faq.isOpen;
  }
  filterOnline = false;
filterLive = false;
applyAdvancedFilters(): void {
  this.filteredCourses = this.allCourses.filter(course => {
    const matchesOnline = this.filterOnline ? course.courseType === CourseType.ONLINE : true;
    const matchesLive = this.filterLive ? course.courseType === CourseType.LIVE : true;
    return matchesOnline && matchesLive;
  });
}
getSortLabel(): string {
  switch(this.sortOption) {
    case 'price': return 'Prix';
    case 'duration': return 'Durée';
    case 'rating': return 'Note';
    default: return '';
  }
}

setSortOption(option: string): void {
  this.sortOption = option;
  this.onSortChange();
}
loadPopularCourses(limit: number = 3): void {
  this.courseService.getPopularCourses(limit).subscribe({
    next: (courses) => {
      this.popularCourses = courses;
    },
    error: (err) => {
      console.error('Error loading popular courses', err);
    }
  });
}
resetFilters(): void {
  this.searchQuery = '';
  this.filteredCourses = [...this.allCourses];
  this.currentPage = 1;
}
min(a: number, b: number): number {
  return Math.min(a, b);
}
getPagesArray(): number[] {
  const pages = [];
  for (let i = 1; i <= this.totalPages; i++) {
    pages.push(i);
  }
  return pages;
}
}
