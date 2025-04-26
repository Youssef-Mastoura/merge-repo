import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Course } from 'src/app/back-office/models/course.model';
import { CourseService } from 'src/app/services/course.service';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category.service';
import { Category } from 'src/app/back-office/models/category.model';
import { ActivatedRoute } from '@angular/router';
import { CourseType } from 'src/app/back-office/models/course.model';
import { AuthService } from 'src/app/services/auth.service';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import { EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import googleCalendarPlugin from '@fullcalendar/google-calendar';


@Component({
  selector: 'app-couse-list-etudiant',
  templateUrl: './couse-list-etudiant.component.html',
  styleUrls: ['./couse-list-etudiant.component.css']
})
export class CouseListEtudiantComponent implements OnInit {
  // Données des cours
  courses: Course[] = [];
  allCourses: Course[] = [];
  filteredCourses: Course[] = [];
  popularCourses: Course[] = [];
  enrolledCourses: Course[] = [];
  categories: Category[] = [];

  // États et filtres
  loading = false;
  error: string | null = null;
  searchQuery = '';
  sortOption = '';
  currentPage = 1;
  itemsPerPage = 6;
  filterOnline = false;
  filterLive = false;
  showMyCourses = false;

  // Évaluation
  hoveredRating = 0;
  selectedRating: { [courseId: number]: number } = {};

  // IDs statiques (à remplacer par la logique réelle d'authentification)
  staticStudentId = 2;
  staticTeacherId = 1;

  constructor(
    private courseService: CourseService,
    private authService: AuthService,
    private router: Router,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, googleCalendarPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    weekends: true,
    editable: false,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    events: [],
    eventColor: '#378006',
    googleCalendarApiKey: 'YOUR_API_KEY',
    eventSources: [
      {
        googleCalendarId: 'primary' // Utilise le calendrier principal de l'utilisateur
      }
    ]
  };

  calendarEvents: EventInput[] = [];
  upcomingEvents: any[] = [];
  calendarVisible = true;

  ngOnInit(): void {
    this.loadInitialData();
    this.loadCourseEvents();

  }

  private loadInitialData(): void {
  /*  const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }*/

    this.loading = true;
    this.error = null;

    forkJoin([
      this.categoryService.getAllCategories(),
      this.courseService.getAllCourses(),
      this.courseService.getCoursesByStudent(this.staticStudentId),
      this.courseService.getPopularCourses(3)
    ]).pipe(
      finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: ([categories, allCourses, enrolledCourses, popularCourses]) => {
        this.categories = categories;
        this.allCourses = allCourses;
        this.filteredCourses = [...allCourses];
        this.enrolledCourses = enrolledCourses;
        this.popularCourses = popularCourses;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des données';
        console.error('Error loading data:', err);
      }
    });
  }

  onSearch(): void {
    if (!this.searchQuery.trim()) {
      this.filteredCourses = [...this.allCourses];
      return;
    }

    const query = this.searchQuery.toLowerCase();
    this.filteredCourses = this.allCourses.filter(course => 
      course.title_Course.toLowerCase().includes(query) || 
      course.description_Course.toLowerCase().includes(query)
    );
    this.currentPage = 1;
  }

  setSortOption(option: string): void {
    this.sortOption = option;
    this.applySorting();
  }

  private applySorting(): void {
    if (!this.sortOption) return;

    this.filteredCourses = [...this.filteredCourses].sort((a, b) => {
      switch (this.sortOption) {
        case 'price':
          return a.price_Course - b.price_Course;
        case 'duration':
          return a.duration_Course - b.duration_Course;
        case 'rating':
          return (b.rating_Course ?? 0) - (a.rating_Course ?? 0);
        default:
          return 0;
      }
    });
  }

  filterByCategory(categoryName: string): void {
    if (!categoryName) {
      this.filteredCourses = [...this.allCourses];
      return;
    }
    this.filteredCourses = this.allCourses.filter(course => 
      course.name_Category === categoryName
    );
    this.currentPage = 1;
  }

  applyAdvancedFilters(): void {
    this.filteredCourses = this.allCourses.filter(course => {
      const matchesOnline = this.filterOnline ? course.courseType === CourseType.ONLINE : true;
      const matchesLive = this.filterLive ? course.courseType === CourseType.LIVE : true;
      return matchesOnline && matchesLive;
    });
    this.currentPage = 1;
  }

  toggleMyCourses(): void {
    this.showMyCourses = !this.showMyCourses;
    this.filteredCourses = this.showMyCourses 
      ? this.allCourses.filter(c => 
          this.enrolledCourses.some(ec => ec.id_Course === c.id_Course))
      : [...this.allCourses];
    this.currentPage = 1;
  }

  onManageContents(id: number): void {
    if (!id) {
      console.error('Invalid course ID');
      return;
    }

    this.courseService.incrementViewCount(id).subscribe({
      next: () => {
        this.router.navigate(['/student/courses', id, 'contents']);
      },
      error: (err) => {
        console.error('Failed to increment view count:', err);
        this.router.navigate(['/student/courses', id, 'contents']);
      }
    });
  }

  onRate(course: Course, rating: number): void {
    if (!course.id_Course) return;

    this.courseService.rateCourse(course.id_Course, rating).subscribe({
      next: () => {
        course.rating_Course = rating;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error rating course:', err);
      }
    });
  }

  // Pagination
  get pages(): number[] {
    const totalPages = Math.ceil(this.filteredCourses.length / this.itemsPerPage);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredCourses.length / this.itemsPerPage);
  }

  get paginatedCourses(): Course[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredCourses.slice(start, start + this.itemsPerPage);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // TrackBy functions
  trackByCategory(index: number, category: Category): number {
    return category.id_Category!;
  }
  
  trackByCourse(index: number, course: Course): number {
    return course.id_Course || index;
  }

  // Utilitaires
  getSortLabel(): string {
    switch(this.sortOption) {
      case 'price': return 'Prix';
      case 'duration': return 'Durée';
      case 'rating': return 'Note';
      default: return 'Trier par';
    }
  }
  loadCourseEvents() {
    // Transformez vos cours en événements calendrier
    this.calendarEvents = this.enrolledCourses.map(course => ({
      title: course.title_Course,
      start: new Date(course.createdAt_Course!), // Supposons que vous ayez une date de début
      extendedProps: {
        type: 'course',
        courseId: course.id_Course
      },
      backgroundColor: '#4e73df'
    }));

    // Ajoutez les échéances (exemple)
    this.upcomingEvents = [
      ...this.calendarEvents,
      {
        title: 'Devoir final - Mathématiques',
        start: new Date(new Date().setDate(new Date().getDate() + 7)),
        extendedProps: {
          type: 'assignment'
        },
        backgroundColor: '#f6c23e'
      }
    ].sort((a, b) => {
      const startA = Number(a.start) || 0;
      const startB = Number(b.start) || 0;
      return startA - startB;
    });
  }    

  // Synchronisation avec Google Calendar
  syncWithGoogle() {
    // Implémentez la logique OAuth ici
    console.log('Synchronisation avec Google Calendar');
    // En production, utilisez Google API Client Library
  }

  handleEventClick(clickInfo: any) {
    console.log('Événement cliqué:', clickInfo.event.title);
    // Navigation vers le détail du cours ou autre action
  }

  handleDateClick(arg: any) {
    console.log('Date cliquée:', arg.dateStr);
    // Potentiellement créer un nouvel événement
  }
  scrollToCalendar() {
    const element = document.getElementById('calendar');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
}