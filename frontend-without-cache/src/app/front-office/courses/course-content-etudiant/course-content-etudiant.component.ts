import { Content } from 'src/app/back-office/models/content.model';
import { Course } from 'src/app/back-office/models/course.model';
import { ContentService } from 'src/app/services/content.service';
import { CourseService } from 'src/app/services/course.service';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeHtml } from '@angular/platform-browser';
import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-course-content-etudiant',
  templateUrl: './course-content-etudiant.component.html',
  styleUrls: ['./course-content-etudiant.component.css']
})
export class CourseContentEtudiantComponent implements OnInit {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  @ViewChild('pdfFileInput') pdfFileInput!: ElementRef;

  // Données du cours
  course: Course | null = null;
  contents: Content[] = [];
  courseId!: number;
  
  // Gestion du formulaire
  contentForm!: FormGroup;
  editingContentId: number | null = null;
  contentTypes = ['VIDEO', 'PDF', 'QUIZ', 'TEXT'];
  isSubmitting = false;
  
  // Gestion des fichiers
  selectedFile: File | null = null;
  selectedFileError: string | null = null;
  
  // Affichage du contenu
  selectedContent: Content | null = null;
  contentType: string = '';
  safeVideoUrl: SafeResourceUrl | null = null;
  pdfUrl: string = '';
  quizData: any;
  textContent: string = '';
  isContentModalOpen = false;
  
  // États de chargement
  isLoading = true;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private contentService: ContentService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCourseData();
  }

  private initForm(): void {
    this.contentForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      type: ['', Validators.required],
      url: [''],
      description: [''],
      orderIndex: [0, [Validators.required, Validators.min(0)]],
      duration: [0, [Validators.min(0)]],
      quizTitle: [''],
      questions: this.fb.array([])
    });

    this.contentForm.get('type')?.valueChanges.subscribe(() => this.onTypeChange());
  }

  private loadCourseData(): void {
    this.route.params.pipe(
      switchMap(params => {
        this.courseId = +params['id'];
        this.isLoading = true;
        this.errorMessage = null;
        return this.courseService.getCourseById(this.courseId);
      }),
      switchMap(course => {
        if (!course) {
          throw new Error('Course not found');
        }
        this.course = course;
        return this.contentService.getContentsByCourseId(this.courseId);
      })
    ).subscribe({
      next: (contents) => {
        this.contents = this.sortContents(contents);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading course data:', err);
        this.errorMessage = 'Failed to load course data. Please try again later.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private sortContents(contents: Content[]): Content[] {
    return [...contents].sort((a, b) => 
      (a.orderIndex_Content || 0) - (b.orderIndex_Content || 0)
    );
  }

  get questions(): FormArray {
    return this.contentForm.get('questions') as FormArray;
  }

  getQuestionOptions(questionIndex: number): FormArray {
    return this.questions.at(questionIndex).get('options') as FormArray;
  }

  onTypeChange(): void {
    const type = this.contentForm.get('type')?.value;
    
    if (type !== 'QUIZ') {
      this.contentForm.setControl('questions', this.fb.array([]));
    }
    if (type !== 'PDF') {
      this.selectedFile = null;
      this.selectedFileError = null;
    }
    if (type !== 'VIDEO') {
      this.contentForm.get('url')?.reset();
    }
    if (type !== 'TEXT') {
      this.contentForm.get('description')?.reset();
    }
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    this.selectedFileError = null;

    if (!file) return;

    if (file.type !== 'application/pdf') {
      this.selectedFileError = 'Please select a valid PDF file';
      this.resetFileInput();
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.selectedFileError = 'File size exceeds 5MB limit';
      this.resetFileInput();
      return;
    }

    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.pdfUrl = e.target.result;
      this.contentForm.patchValue({ url: e.target.result });
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  private resetFileInput(): void {
    this.selectedFile = null;
    if (this.pdfFileInput?.nativeElement) {
      this.pdfFileInput.nativeElement.value = '';
    }
  }

  addQuestion(): void {
    this.questions.push(this.fb.group({
      text: ['', Validators.required],
      options: this.fb.array([this.fb.control('', Validators.required)]),
      correctAnswer: [0, Validators.required]
    }));
  }

  removeQuestion(index: number): void {
    this.questions.removeAt(index);
  }

  addOption(questionIndex: number): void {
    this.getQuestionOptions(questionIndex).push(this.fb.control('', Validators.required));
  }

  removeOption(questionIndex: number, optionIndex: number): void {
    this.getQuestionOptions(questionIndex).removeAt(optionIndex);
  }

  showContent(content: Content): void {
    if (!content) return;

    this.selectedContent = content;
    this.contentType = content.type_Content;
    this.isContentModalOpen = true;

    switch(content.type_Content) {
      case 'VIDEO':
        this.handleVideoContent(content.url_Content || '');
        break;
      case 'PDF':
        this.pdfUrl = content.url_Content || '';
        break;
      case 'QUIZ':
        this.parseQuizContent(content.description_Content);
        break;
      case 'TEXT':
        this.textContent = content.description_Content || '';
        break;
    }
    this.cdr.detectChanges();
  }

  private handleVideoContent(url: string): void {
    if (!url) {
      this.safeVideoUrl = null;
      return;
    }

    if (this.isYouTubeUrl(url)) {
      const videoId = this.getYouTubeId(url);
      const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
      this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    } else {
      this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
  }

  private parseQuizContent(description: string | undefined): void {
    try {
      this.quizData = description ? JSON.parse(description) : { title: 'Quiz', questions: [] };
    } catch {
      this.quizData = { title: 'Quiz', questions: [] };
    }
  }

  isYouTubeUrl(url: string): boolean {
    return url?.includes('youtube.com') || url?.includes('youtu.be');
  }

  private getYouTubeId(url: string): string {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  }

  getSafePdfUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  getSafeHtml(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  getCharFromCode(code: number): string {
    return String.fromCharCode(code);
  }

  closeContentModal(): void {
    this.isContentModalOpen = false;
    this.selectedContent = null;
    this.safeVideoUrl = null;
    this.pdfUrl = '';
    this.quizData = null;
    this.textContent = '';
  }

  onSubmit(): void {
    if (this.contentForm.invalid || this.isSubmitting) return;

    this.isSubmitting = true;
    const formValue = this.contentForm.value;
    const contentData: Partial<Content> = {
      title_Content: formValue.title,
      type_Content: formValue.type,
      orderIndex_Content: formValue.orderIndex,
      duration_Content: formValue.duration,
      courseId: this.courseId 
    };

    this.prepareContentData(contentData, formValue);

    const save$ = this.editingContentId
      ? this.contentService.updateContent({
          ...contentData,
          id_Content: this.editingContentId
        } as Content)
      : this.contentService.addContent(contentData as Content, this.courseId);

    save$.subscribe({
      next: () => {
        this.isSubmitting = false;
        this.resetForm();
        this.handleSaveSuccess();
      },
      error: (err) => {
        this.handleSaveError(err);
      }
    });
  }

  private prepareContentData(contentData: Partial<Content>, formValue: any): void {
    switch(formValue.type) {
      case 'QUIZ':
        contentData.description_Content = JSON.stringify({
          title: formValue.quizTitle,
          questions: formValue.questions
        });
        break;
      case 'TEXT':
        contentData.description_Content = formValue.description;
        break;
      case 'VIDEO':
        contentData.url_Content = formValue.url;
        break;
      case 'PDF':
        contentData.url_Content = formValue.url;
        break;
    }
  }

  private handleSaveSuccess(): void {
    this.isSubmitting = false;
    this.resetForm();
    this.loadCourseData();
  }

  private handleSaveError(error: any): void {
    console.error('Error saving content:', error);
    this.isSubmitting = false;
    this.errorMessage = 'Failed to save content. Please try again.';
    this.cdr.detectChanges();
  }

  onEditContent(content: Content, event: Event): void {
    event.stopPropagation();
    this.editingContentId = content.id_Content || null;
    
    this.contentForm.reset({
      orderIndex: 0,
      duration: 0
    });

    this.prepareEditForm(content);
  }

  private prepareEditForm(content: Content): void {
    const formData: any = {
      title: content.title_Content,
      type: content.type_Content,
      orderIndex: content.orderIndex_Content || 0,
      duration: content.duration_Content || 0
    };

    if (content.type_Content === 'QUIZ') {
      this.prepareQuizForm(content, formData);
    } else {
      formData.description = content.description_Content || '';
      formData.url = content.url_Content || '';
    }

    this.contentForm.patchValue(formData);
  }

  private prepareQuizForm(content: Content, formData: any): void {
    try {
      const quizData = content.description_Content ? JSON.parse(content.description_Content) : { title: '', questions: [] };
      formData.quizTitle = quizData.title;
      
      const questionsArray = this.fb.array(
        quizData.questions?.map((q: any) => 
          this.fb.group({
            text: [q.text, Validators.required],
            options: this.fb.array(
              q.options?.map((opt: string) => 
                this.fb.control(opt, Validators.required)
              ) || []
            ),
            correctAnswer: [q.correctAnswer ?? 0, Validators.required]
          })
        ) || []
      );
      
      this.contentForm.setControl('questions', questionsArray);
    } catch (e) {
      console.error('Error parsing quiz data:', e);
    }
  }

  onDeleteContent(id: number | undefined, event: Event): void {
    if (!id) return;

    event.stopPropagation();
    if (confirm('Are you sure you want to delete this content?')) {
      this.contentService.deleteContent(id).subscribe({
        next: () => {
          this.loadCourseData();
        },
        error: (err) => {
          console.error('Delete error:', err);
          this.errorMessage = 'Failed to delete content. Please try again.';
          this.cdr.detectChanges();
        }
      });
    }
  }

  resetForm(): void {
    this.contentForm.reset({
      orderIndex: 0,
      duration: 0
    });
    this.contentForm.setControl('questions', this.fb.array([]));
    this.selectedFile = null;
    this.editingContentId = null;
    this.selectedFileError = null;
    this.resetFileInput();
  }

  onCancel(): void {
    this.resetForm();
  }
}