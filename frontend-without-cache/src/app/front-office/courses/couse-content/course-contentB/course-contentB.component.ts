import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeHtml } from '@angular/platform-browser';
import { Content } from 'src/app/back-office/models/content.model';
import { Course } from 'src/app/back-office/models/course.model';
import { ContentService } from 'src/app/services/content.service';
import { CourseService } from 'src/app/services/course.service';

@Component({
  selector: 'app-course-content',
  templateUrl: './course-contentB.component.html',
  styleUrls: ['./course-contentB.component.css']
})


export class CourseContentBComponent implements OnInit {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  @ViewChild('pdfFileInput') pdfFileInput!: ElementRef;

  course!: Course;
  contents: Content[] = [];
  contentForm!: FormGroup;
  courseId!: number;
  editingContentId: number | null = null;
  contentTypes = ['VIDEO', 'PDF', 'QUIZ', 'TEXT'];
  selectedFileError: string | null = null;
  selectedFile: File | null = null;

  selectedContent: Content | null = null;
  contentType: string = '';
  safeVideoUrl: SafeResourceUrl | null = null;
  pdfUrl: string = '';
  quizData: any;
  textContent: string = '';
  isContentModalOpen: boolean = false;
  isSubmitting = false;

  isOwner: boolean = false;



  staticTeacherId = 1;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private contentService: ContentService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.courseId = +params['id'];
      this.loadCourseAndContents();
      this.initForm();
    });
  }

  initForm(): void {
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
  }

  get questions(): FormArray {
    return this.contentForm.get('questions') as FormArray;
  }

  getQuestionOptions(questionIndex: number): FormArray {
    return this.questions.at(questionIndex).get('options') as FormArray;
  }

  loadCourseAndContents(): void {
    this.courseService.getCourseById(this.courseId).subscribe(
      (course) => {
        this.course = course;
        this.isOwner = course.teacherId === this.staticTeacherId; // Vérifie si c'est le propriétaire
        this.loadContents();
      },
      (error) => console.error('Error loading course:', error)
    );
  }
  

  loadContents(): void {
    this.contentService.getContentsByCourseId(this.courseId).subscribe(
      (contents) => {
        this.contents = contents.sort((a, b) => 
          (a.orderIndex_Content || 0) - (b.orderIndex_Content || 0)
        );
      },
      (error) => console.error('Error loading contents:', error)
    );
  }

  onTypeChange(): void {
    const type = this.contentForm.get('type')?.value;
    
    // Reset relevant fields when type changes
    if (type !== 'QUIZ') {
      this.contentForm.setControl('questions', this.fb.array([]));
    }
    if (type !== 'PDF') {
      this.selectedFile = null;
      this.selectedFileError = null;
      if (this.pdfFileInput) {
        this.pdfFileInput.nativeElement.value = '';
      }
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
    if (file) {
      // Validate file type
      if (file.type !== 'application/pdf') {
        this.selectedFileError = 'Please select a valid PDF file';
        this.pdfFileInput.nativeElement.value = '';
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        this.selectedFileError = 'File size exceeds 5MB limit';
        this.pdfFileInput.nativeElement.value = '';
        return;
      }

      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.pdfUrl = e.target.result;
        this.contentForm.patchValue({
          url: e.target.result
        });
      };
      reader.readAsDataURL(file);
      this.selectedFileError = null;
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
    this.selectedContent = content;
    this.contentType = content.type_Content;
    this.isContentModalOpen = true;

    switch(content.type_Content) {
      case 'VIDEO':
        this.handleVideoContent(content.url_Content);
        break;
      case 'PDF':
        this.pdfUrl = content.url_Content || '';
        break;
      case 'QUIZ':
        try {
          this.quizData = JSON.parse(content.description_Content || '{}');
        } catch {
          this.quizData = { title: 'Quiz', questions: [] };
        }
        break;
      case 'TEXT':
        this.textContent = content.description_Content || '';
        break;
    }
  }

  private handleVideoContent(url: string = ''): void {
    if (this.isYouTubeUrl(url)) {
      const videoId = this.getYouTubeId(url);
      const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
      this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    } else {
      this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
  }

  public isYouTubeUrl(url: string): boolean {
    return url?.includes('youtube.com') || url?.includes('youtu.be');
  }

  private getYouTubeId(url: string): string {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  }

  public getSafePdfUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  public getSafeHtml(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  public getCharFromCode(code: number): string {
    return String.fromCharCode(code);
  }

  closeContentModal(): void {
    this.isContentModalOpen = false;
    this.selectedContent = null;
    this.safeVideoUrl = null;
  }

  onSubmit(): void {
    // Check form validity and show validation messages if invalid
    if (this.contentForm.invalid) {
      this.contentForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formValue = this.contentForm.value;
    
    // Prepare content data
    const contentData: any = {
      title_Content: formValue.title,
      type_Content: formValue.type,
      orderIndex_Content: formValue.orderIndex,
      duration_Content: formValue.duration || 0,
      course: { id_Course: this.courseId }
    };

    // Handle different content types
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

    // Determine if we're updating or creating new content
    const save$ = this.editingContentId
      ? this.contentService.updateContent({
          ...contentData,
          id_Content: this.editingContentId
        })
      : this.contentService.addContent(contentData,this.courseId);

    save$.subscribe({
      next: () => {
        this.isSubmitting = false;
        this.resetForm();
        this.loadContents();
        alert('Content saved successfully!');
      },
      error: (err) => {
        console.error('Error saving content:', err);
        this.isSubmitting = false;
        alert(`Error: ${err.error?.message || err.message || 'Failed to save content'}`);
      }
    });
  }

  onEditContent(content: Content, event: Event): void {
    event.stopPropagation();
    this.editingContentId = content.id_Content || null;
    
    // Handle quiz content
    if (content.type_Content === 'QUIZ') {
      try {
        const quizData = JSON.parse(content.description_Content || '{}');
        this.contentForm.patchValue({
          quizTitle: quizData.title
        });
        
        // Rebuild questions form array
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
    
    // Patch form values
    this.contentForm.patchValue({
      title: content.title_Content,
      type: content.type_Content,
      url: content.url_Content || '',
      description: content.description_Content || '',
      orderIndex: content.orderIndex_Content || 0,
      duration: content.duration_Content || 0
    });
  }

  onDeleteContent(id: number, event: Event): void {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this content?')) {
      this.contentService.deleteContent(id).subscribe({
        next: () => {
          this.loadContents();
          alert('Content deleted successfully');
        },
        error: (err) => {
          console.error('Delete error:', err);
          alert('Failed to delete content');
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
    this.selectedFileError = null;
    this.editingContentId = null;
    if (this.pdfFileInput) {
      this.pdfFileInput.nativeElement.value = '';
    }
  }

  onCancel(): void {
    this.resetForm();
  }
}