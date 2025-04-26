import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Course ,CourseType } from 'src/app/back-office/models/course.model';
import { Category } from 'src/app/back-office/models/category.model';
import { CourseService } from 'src/app/services/course.service';
import { CategoryService } from 'src/app/services/category.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-formB.component.html',
  styleUrls: ['./course-formB.component.css']
})
export class CourseFormBComponent implements OnInit {
  courseForm: FormGroup;
  categories: Category[] = [];
  isEditMode = false;
  courseId: number | null = null;
  courseTypes = CourseType;
  selectedFile: File | null = null;
  imageUrl: string = '';
  loading = false;
  submitAttempted = false;
  minDate: string;
showSuccessAnimation = false;
TeacherId? :number // ID statique pour le professeur
currentUser!: any;


  constructor(
    private formBuilder: FormBuilder,
    private courseService: CourseService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private authService:AuthService,

  ) {
    this.courseForm = this.initForm();
    // Set minimum date for session (today)
    const today = new Date();
    this.minDate = today.toISOString().slice(0, 16);
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUserInfo();
    console.log('User info:', this.currentUser);  
  if (this.currentUser) {
    this.TeacherId = this.currentUser.id;
    console.log('TeacherId:', this.TeacherId);
  } else {
    console.warn('Aucun utilisateur connecté ou token invalide');
  }

  
    /*this.loadCategories();
  
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.courseId = +params['id'];
        this.isEditMode = true;
        this.loadCourse(this.courseId);
      }
    });*/
  
    // Watch for course type changes to toggle session date field
    this.courseForm.get('courseType')?.valueChanges.subscribe(value => {
      const sessionDateControl = this.courseForm.get('sessionDate');
      if (value === CourseType.LIVE) {
        sessionDateControl?.setValidators([Validators.required]);
      } else {
        sessionDateControl?.clearValidators();
        sessionDateControl?.setValue(null);
      }
      sessionDateControl?.updateValueAndValidity();
    });
  }

  initForm(): FormGroup {
    return this.formBuilder.group({
      title_Course: ['', [Validators.required, Validators.minLength(5)]],
      description_Course: ['', [Validators.required, Validators.minLength(50)]],
      language_Course: ['', Validators.required],
      price_Course: [0, [Validators.required, Validators.min(0)]],
      duration_Course: [1, [Validators.required, Validators.min(1)]],
      courseType: [CourseType.ONLINE, Validators.required],
      sessionDate: [null],
      name_Category: ['', Validators.required],
      level_Course: ['', Validators.required],
      prerequisites_Course: [''],
      image_Course: ['', Validators.required],

    });
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => this.categories = categories,
      error: (error) => {
        console.error('Erreur lors du chargement des catégories', error);
        console.log('Erreur lors du chargement des catégories');
      }
    });
  }

  loadCourse(id: number): void {
    this.loading = true;
    this.courseService.getCourseById(id).subscribe({
      next: (course) => {
        this.imageUrl = course.image_Course || '';
        
        this.courseForm.patchValue({
          title_Course: course.title_Course,
          description_Course: course.description_Course,
          language_Course: course.language_Course,
          price_Course: course.price_Course,
          duration_Course: course.duration_Course,
          courseType: course.courseType,
          sessionDate: course.sessionDate ,
          name_Category: course.name_Category,
          level_Course: course.level_Course,
          prerequisites_Course: course.prerequisites_Course,
          image_Course: course.image_Course,
          teacher_id: course.teacherId || this.TeacherId
  
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement du cours', error);
        console.log('Erreur lors du chargement du cours');
        this.loading = false;
      }
    });
  }

  private formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    
    if (!input.files || input.files.length === 0) return;
  
    this.selectedFile = input.files[0];
    this.imageUrl = '';
  
    // Validate file type
    if (!this.selectedFile.type.match(/image\/*/)) {
      console.log('Veuillez sélectionner un fichier image valide');
      this.selectedFile = null;
      return;
    }

    // Validate file size (max 5MB)
    if (this.selectedFile.size > 5 * 1024 * 1024) {
      console.log('L\'image ne doit pas dépasser 5MB');
      this.selectedFile = null;
      return;
    }

    const reader = new FileReader();
    
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result as string;
  
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        const maxWidth = 800;
        const maxHeight = 600;
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions
        if (width > maxWidth || height > maxHeight) {
          const ratio = width / height;
          if (width > height) {
            width = maxWidth;
            height = Math.round(width / ratio);
          } else {
            height = maxHeight;
            width = Math.round(height * ratio);
          }
        }
  
        // Resize image
        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);
  
        // Convert to compressed base64
        const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
  
        // Update form
        this.imageUrl = resizedDataUrl;
        this.courseForm.get('image_Course')?.setValue(this.imageUrl);
        this.courseForm.get('image_Course')?.markAsDirty();
      };
    };
    
    reader.readAsDataURL(this.selectedFile);
  }
  
  onImageUrlInput(event: any): void {
    this.imageUrl = event.target.value;
    this.selectedFile = null;
    
    if (this.imageUrl) {
      // Basic URL validation
      try {
        new URL(this.imageUrl);
        this.courseForm.get('image_Course')?.setValue(this.imageUrl);
        this.courseForm.get('image_Course')?.markAsDirty();
        this.courseForm.get('image_Course')?.updateValueAndValidity();
      } catch (e) {
        this.courseForm.get('image_Course')?.setValue('');
        console.log('Veuillez entrer une URL valide');
      }
    }
  }

  clearImageSelection(): void {
    this.selectedFile = null;
    this.imageUrl = '';
    this.courseForm.get('image_Course')?.setValue('');
    this.courseForm.get('image_Course')?.markAsDirty();
  }

  showError(controlName: string): boolean {
    const control = this.courseForm.get(controlName);
    return !!control && control.invalid && (control.touched || this.submitAttempted);
  }

  onSubmit(): void {
  this.submitAttempted = true;
  
  Object.keys(this.courseForm.controls).forEach(key => {
    this.courseForm.get(key)?.markAsTouched();
  });
  
  if (this.courseForm.invalid) {
    this.scrollToFirstError();
    console.log('Veuillez corriger les erreurs dans le formulaire');
    return;
  }

  // Affiche l'animation si le formulaire est valide
  if (this.courseForm.valid) {
    this.showSuccessAnimation = true;
    
    // Cache l'animation après 3 secondes et soumet le formulaire
    setTimeout(() => {
      this.showSuccessAnimation = false;
      this.proceedWithFormSubmission();
    }, 2000);
  }
}

private proceedWithFormSubmission(): void {
  this.loading = true;

  const courseData: Course = {
    title_Course: this.courseForm.value.title_Course,
    description_Course: this.courseForm.value.description_Course,
    language_Course: this.courseForm.value.language_Course,
    price_Course: this.courseForm.value.price_Course,
    duration_Course: this.courseForm.value.duration_Course,
    courseType: this.courseForm.value.courseType,
    sessionDate: this.courseForm.value.sessionDate,
    name_Category: this.courseForm.value.name_Category,
    level_Course: this.courseForm.value.level_Course,
    prerequisites_Course: this.courseForm.value.prerequisites_Course,
    createdAt_Course: new Date(),
    image_Course: this.courseForm.value.image_Course,
    teacherId: this.TeacherId, 
  };

  if (this.isEditMode && this.courseId) {
    courseData.id_Course = this.courseId;
    this.updateCourse(courseData);
  } else {
    this.createCourse(courseData);
  }
}
private createCourse(courseData: Course): void {
  this.courseService.createCourse(courseData, this.TeacherId!).subscribe({
    next: () => {
      console.log('Cours créé avec succès!');
      this.router.navigate(['/professor/courses']);
    },
    error: (error) => {
      console.error('Erreur lors de la création du cours', error);
      console.log('Erreur lors de la création du cours');
      this.loading = false;
    }
  });
}
  private updateCourse(courseData: Course): void {
    this.courseService.updateCourse(courseData).subscribe({
      next: () => {
        console.log('Cours mis à jour avec succès!');
        this.router.navigate(['/Student/courses']);
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour du cours', error);
        console.log('Erreur lors de la mise à jour du cours');
        this.loading = false;
      }
    });
  }

  private scrollToFirstError(): void {
    const firstErrorElement = document.querySelector('.ng-invalid');
    if (firstErrorElement) {
      firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }


isPieceValid(fieldName: string): boolean {
  const control = this.courseForm.get(fieldName);
  return control ? control.valid && control.touched : false;
}


}