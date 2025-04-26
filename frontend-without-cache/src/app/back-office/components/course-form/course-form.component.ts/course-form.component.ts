import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Course, CourseType } from '../../../models/course.model';
import { Category } from '../../../models/category.model';
import { CourseService } from 'src/app/services/course.service';
import { CategoryService } from 'src/app/services/category.service';
import { AuthService } from 'src/app/services/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.css']
})
export class CourseFormComponent implements OnInit {
  courseForm!: FormGroup;
  categories: Category[] = [];
  isEditMode = false;
  courseId: number | null = null;
  courseTypes = CourseType;

  constructor(
    private formBuilder: FormBuilder,
    private courseService: CourseService,
    private categoryService: CategoryService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }
  allCourses: Course[] = [];
  filteredCourses: Course[] = [];
  ngOnInit(): void {
    this.initForm();
    this.loadCategories();
    

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.courseId = +params['id'];
        this.isEditMode = true;
        this.loadCourse(this.courseId);
      }
    });
    this.courseService.getAllCourses().subscribe(courses => {
      this.allCourses = courses;
      this.filteredCourses = courses;
    });
  
    this.categoryService.getAllCategories().subscribe(categories => {
      this.categories = categories;
    });
  }
  
  filterByCategory(categoryName: string) {
    this.filteredCourses = this.allCourses.filter(course => course.name_Category === categoryName);
  }

  initForm(): void {
    this.courseForm = this.formBuilder.group({
      title_Course: ['', Validators.required],
      description_Course: ['', Validators.required],
      language_Course: ['', Validators.required],
      price_Course: [0, [Validators.required, Validators.min(0)]],
      duration_Course: [0, [Validators.required, Validators.min(0)]],
      courseType: [CourseType.ONLINE, Validators.required],
      sessionDate: [null],
      name_Category: ['', Validators.required]
    });
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe(
      (categories) => this.categories = categories,
      (error) => console.error('Erreur lors du chargement des catégories', error)
    );
  }

  loadCourse(id: number): void {
    this.courseService.getCourseById(id).subscribe(
      (course) => {
        // Extraire les IDs des catégories si présentes
        const categoryIds = course.categories ? course.categories.map(cat => cat.id_Category) : [];
        
        this.courseForm.patchValue({
          title_Course: course.title_Course,
          description_Course: course.description_Course,
          language_Course: course.language_Course,
          price_Course: course.price_Course,
          duration_Course: course.duration_Course,
          courseType: course.courseType,
          sessionDate: course.sessionDate,
          name_Category:course.name_Category,
        });
      },
      (error) => console.error('Erreur lors du chargement du cours', error)
    );
  }

  onSubmit(): void {
   /* if (this.courseForm.valid) {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        alert('Vous devez être connecté pour créer un cours.');
        return;
      }*/

      // Créer des objets Category à partir des IDs sélectionnés
     
      // Préparer les données du cours
      const courseData: Course = {
        title_Course: this.courseForm.value.title_Course,
        description_Course: this.courseForm.value.description_Course,
        language_Course: this.courseForm.value.language_Course,
        price_Course: this.courseForm.value.price_Course,
        duration_Course: this.courseForm.value.duration_Course,
        courseType: this.courseForm.value.courseType,
        sessionDate: this.courseForm.value.sessionDate,
        name_Category: this.courseForm.value.name_Category, // 👈 c'est ce que tu veux
        createdAt_Course: new Date()        /*user:  {
          id: currentUser.id,
          username: currentUser.username,
          role: "PROFESSOR"
         }*/
      };

      if (this.isEditMode && this.courseId) {
        courseData.id_Course = this.courseId;
        this.courseService.updateCourse(courseData).subscribe(
          () => {
            alert('Cours mis à jour avec succès!');
            this.router.navigate(['/professor/courses']);
          },
          (error) => console.error('Erreur lors de la mise à jour du cours', error)
        );
      } else {
        // Ajouter la date de création pour un nouveau cours
        courseData.createdAt_Course = new Date();
        this.courseService.addCourse(courseData).subscribe(
          () => {
            alert('Cours créé avec succès!');
            this.router.navigate(['/professor/courses']);
          },
          (error) => console.error('Erreur lors de la création du cours', error)
        );
      }
    }

  }

