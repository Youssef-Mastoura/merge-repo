import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Ajoutez cette ligne
import { SocialLoginModule, SocialAuthServiceConfig, GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


//front

//import { MatIconModule } from '@angular/material/icon';
import { FooterComponent } from './front-office/footer/footer.component';
import { HeaderComponent } from './front-office/header/header.component';
import { HomefComponent } from './front-office/homef/homef.component'; 
import { UserLoginComponent } from './front-office/user-components/user-login/user-login.component';

// dashboard components
import { LayoutComponent } from './back-office/dashboard/layout/layout.component'; 
import { TopBarComponent } from './back-office/dashboard/top-bar/top-bar.component'; 
import { OverlayComponent } from './back-office/dashboard/overlay/overlay.component'; 
import { SidebarComponent } from './back-office/dashboard/sidebar/sidebar/sidebar.component'; 
import { SidebarItemComponent } from './back-office/dashboard/sidebar/sidebar-item/sidebar-item.component'; 
import { SidebarItemsComponent } from './back-office/dashboard/sidebar/sidebar-items/sidebar-items.component'; 
import { SidebarHeaderComponent } from './back-office/dashboard/sidebar/sidebar-header/sidebar-header.component'; 
import { SidebarItemSectionComponent } from './back-office/dashboard/sidebar/sidebar-item-section/sidebar-item-section.component'; 

// pages
import { HomeComponent } from './back-office/pages/home/home.component';

// icons
import { ArIconComponent } from './back-office/dashboard/icons/ar-icon/ar-icon.component'; 
import { UxIconComponent } from './back-office/dashboard/icons/ux-icon/ux-icon.component'; 
import { DocIconComponent } from './back-office/dashboard/icons/doc-icon/doc-icon.component'; 
import { AppsIconComponent } from './back-office/dashboard/icons/apps-icon/apps-icon.component'; 
import { VideoIconComponent } from './back-office/dashboard/icons/video-icon/video-icon.component'; 
import { UpdatesIconComponent } from './back-office/dashboard/icons/updates-icon/updates-icon.component'; 
import { PhotographyIconComponent } from './back-office/dashboard/icons/photography-icon/photography-icon.component'; 
import { IllustrationIconComponent } from './back-office/dashboard/icons/illustration-icon/illustration-icon.component'; 
import { GraphicDesignIconComponent } from './back-office/dashboard/icons/graphic-design-icon/graphic-design-icon.component'; 

// others
import { ContentComponent } from './back-office/components/content/content.component'; 
import { FolderIconComponent } from './back-office/components/docs/icons/folder-icon/folder-icon.component'; 
import { AngularIconComponent } from './back-office/components/docs/icons/angular-icon/angular-icon.component'; 
import { UserRegisterComponent } from './back-office/pages/gestion user/user-register/user-register.component'; 
import { UserService } from './services/user.service'; 
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { UserAdminComponent } from './back-office/pages/gestion user/user-admin/user-admin.component'; 
import { LoginAdminComponent } from './back-office/pages/gestion user/login-admin/login-admin.component'; 
import { SimpleuserRegisterComponent } from './back-office/pages/gestion user/simpleuser-register/simpleuser-register.component'; 
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';

//imports yasmine
import { CourseFormComponent } from './back-office/components/course-form/course-form.component.ts/course-form.component';
import { CourseListComponent } from './back-office/components/course-list/course-list.component.ts/course-list.component';
import { CourseContentComponent } from './back-office/components/couse-content/course-content/course-content.component';
import { CategoryManagementComponent } from './front-office/courses/professor/category-management/category-management.component';

import { CourseListBComponent } from './front-office/courses/course-list/course-listB.component.ts/course-listB.component';
import { CourseFormBComponent } from './front-office/courses/course-formB/course-form.component.ts/course-formB.component';
import { CourseContentBComponent } from './front-office/courses/couse-content/course-contentB/course-contentB.component';

import { RouterModule } from '@angular/router';
import { CouseListEtudiantComponent } from './front-office/courses/couse-list-etudiant/couse-list-etudiant.component';
import { CourseContentEtudiantComponent } from './front-office/courses/course-content-etudiant/course-content-etudiant.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { AdminCategoryComponent } from './back-office/components/admin-category/admin-category.component';
import { EventfComponent } from './eventfrontoffice/eventf/eventf.component';
import { FeedbackeventfComponent } from './eventfrontoffice/feedbackeventf/feedbackeventf.component';
import { TopfiveeventfComponent } from './eventfrontoffice/topfiveeventf/topfiveeventf.component';
import { EventdetailsfComponent } from './eventfrontoffice/eventdetailsf/eventdetailsf.component';
import { EventsuserfComponent } from './eventfrontoffice/eventsuserf/eventsuserf.component';
import { EventchatbotComponent } from './eventfrontoffice/eventchatbot/eventchatbot.component';
import { EventComponent } from './eventbackoffice/event/event.component';
import { AddeventComponent } from './eventbackoffice/addevent/addevent.component';
import { ModifyeventComponent } from './eventbackoffice/modifyevent/modifyevent.component';
import { FeedbackeventbComponent } from './eventbackoffice/feedbackeventb/feedbackeventb.component';
import { TopfiveeventbComponent } from './eventbackoffice/topfiveeventb/topfiveeventb.component';
import { ParticipantsComponent } from './eventbackoffice/participants/participants.component';
import { EventfeedbaksComponent } from './eventbackoffice/eventfeedbaks/eventfeedbaks.component';
import { EventregistrationsComponent } from './eventbackoffice/eventregistrations/eventregistrations.component';

//front office


@NgModule({
  declarations: [
    
    AppComponent,
    

    // dashboard
    LayoutComponent,
    TopBarComponent,
    OverlayComponent,
    SidebarComponent,
    SidebarItemComponent,
    SidebarItemsComponent,
    SidebarHeaderComponent,
    SidebarItemSectionComponent,

    // pages
    
    HomeComponent,
  

    // icons
    ArIconComponent,
    UxIconComponent,
    DocIconComponent,
    AppsIconComponent,
    VideoIconComponent,
    UpdatesIconComponent,
    PhotographyIconComponent,
    IllustrationIconComponent,
    GraphicDesignIconComponent,

    // others
    ContentComponent,
    FolderIconComponent,
    AngularIconComponent,
    UserRegisterComponent,
    UserAdminComponent,
    LoginAdminComponent,
    SimpleuserRegisterComponent,

    //front
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomefComponent,
    UserLoginComponent,
    CourseFormComponent,
    CourseListComponent,
    CourseContentComponent,
   CategoryManagementComponent,
   CourseContentBComponent,

    CourseFormBComponent,
    CourseListBComponent, CouseListEtudiantComponent,
    CourseContentEtudiantComponent,
    AdminCategoryComponent,

    //youssef

    EventComponent,
    AddeventComponent,
    ModifyeventComponent,
    FeedbackeventbComponent,
    TopfiveeventbComponent,
    ParticipantsComponent,
    EventfeedbaksComponent,
    EventregistrationsComponent,
   
    EventfComponent,
    FeedbackeventfComponent,
    TopfiveeventfComponent,
    EventdetailsfComponent,
    EventsuserfComponent,
    EventchatbotComponent,


  ],
  imports: [BrowserModule, AppRoutingModule ,HttpClientModule,ReactiveFormsModule,FormsModule,SocialLoginModule,RecaptchaModule,
    RecaptchaFormsModule,    FullCalendarModule,

  ],
  providers: [UserService, UserService,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '1044730149759-hbbgv79d9gn7dlstgqj0crrc585v6l4l.apps.googleusercontent.com',
              {
                oneTapEnabled: false,
                prompt: 'select_account'
              }
            )
          }
        ]
      } as SocialAuthServiceConfig,
    }],
  bootstrap: [AppComponent],
})
export class AppModule {}
