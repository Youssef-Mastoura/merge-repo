import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRegisterComponent } from './back-office/pages/gestion user/user-register/user-register.component'; 
import { UserAdminComponent } from './back-office/pages/gestion user/user-admin/user-admin.component'; 
import { LoginAdminComponent } from './back-office/pages/gestion user/login-admin/login-admin.component'; 
import { SimpleuserRegisterComponent } from './back-office/pages/gestion user/simpleuser-register/simpleuser-register.component'; 
import { HomefComponent } from './front-office/homef/homef.component';

// yassmine debut 
 import { CourseListComponent } from './back-office/components/course-list/course-list.component.ts/course-list.component';
import { CourseFormComponent } from './back-office/components/course-form/course-form.component.ts/course-form.component';
  import { CourseContentComponent } from './back-office/components/couse-content/course-content/course-content.component';

  //partie front a importer 
 import { CategoryManagementComponent } from './front-office/courses/professor/category-management/category-management.component'; 
import { CourseFormBComponent } from './front-office/courses/course-formB/course-form.component.ts/course-formB.component';
  import { CourseContentBComponent } from './front-office/courses/couse-content/course-contentB/course-contentB.component';
import { CouseListEtudiantComponent } from './front-office/courses/couse-list-etudiant/couse-list-etudiant.component';

import { CourseListBComponent } from './front-office/courses/course-list/course-listB.component.ts/course-listB.component';
import { CourseContentEtudiantComponent } from './front-office/courses/course-content-etudiant/course-content-etudiant.component';
import { AdminCategoryComponent } from './back-office/components/admin-category/admin-category.component';
import { AuthGuard } from './auth-guard.service';
import { EventComponent } from './eventbackoffice/event/event.component';
import { AddeventComponent } from './eventbackoffice/addevent/addevent.component';
import { ModifyeventComponent } from './eventbackoffice/modifyevent/modifyevent.component';
import { FeedbackeventbComponent } from './eventbackoffice/feedbackeventb/feedbackeventb.component';
import { TopfiveeventbComponent } from './eventbackoffice/topfiveeventb/topfiveeventb.component';
import { ParticipantsComponent } from './eventbackoffice/participants/participants.component';
import { EventfeedbaksComponent } from './eventbackoffice/eventfeedbaks/eventfeedbaks.component';
import { EventregistrationsComponent } from './eventbackoffice/eventregistrations/eventregistrations.component';
import { EventfComponent } from './eventfrontoffice/eventf/eventf.component';
import { FeedbackeventfComponent } from './eventfrontoffice/feedbackeventf/feedbackeventf.component';
import { TopfiveeventfComponent } from './eventfrontoffice/topfiveeventf/topfiveeventf.component';
import { EventdetailsfComponent } from './eventfrontoffice/eventdetailsf/eventdetailsf.component';
import { EventsuserfComponent } from './eventfrontoffice/eventsuserf/eventsuserf.component';
import { EventchatbotComponent } from './eventfrontoffice/eventchatbot/eventchatbot.component';
import { ComplaintComponent } from './components/front-office/complaint/complaint.component';
import { ReclamationFormComponent } from './components/front-office/reclamation-form/reclamation-form.component';
import { ReviewComponent } from './components/front-office/review/review.component';
import { ClaimComponent } from './components/claim/claim.component';
import { ViewComponent } from './components/view/view.component';
import { StatComponent } from './components/stat/stat.component';
import { AddCompteBancaireComponent } from './back-office/gestionpaiements/add-compte-bancaire/add-compte-bancaire.component';
import { ListComptebancaireComponent } from './back-office/gestionpaiements/list-comptebancaire/list-comptebancaire.component';
import { DetailscomptebancaireComponent } from './back-office/gestionpaiements/detailscomptebancaire/detailscomptebancaire.component';
import { UpdatecomptebancaireComponent } from './back-office/gestionpaiements/updatecomptebancaire/updatecomptebancaire.component';
import { AddReservationComponent } from './front-office/add-reservation/add-reservation.component';
import { AddPaiementComponent } from './front-office/add-paiement/add-paiement.component';
import { ListReservationComponent } from './front-office/list-reservation/list-reservation.component';
import { StatistiquePaiementComponent } from './front-office/statistique-paiement/statistique-paiement.component';
import { CalendrierReservationComponent } from './back-office/gestionpaiements/calendrier-reservation/calendrier-reservation.component';
import { ChatbotPaiementComponent } from './front-office/chatbot-paiement/chatbot-paiement.component';
import { AddReponseComponent } from './components/add-reponse/add-reponse.component';
// yasmine fin
const routes: Routes = [
  { path: '', component: LoginAdminComponent },
  { path: 'admin/user-admin' , component : UserAdminComponent},
   {path:'admin/login-admin',component:LoginAdminComponent},
   {path:'admin/register-admin',component:UserRegisterComponent},
   {path :'user/register',component:SimpleuserRegisterComponent},
    
   { path:'user/home' , component:HomefComponent},


//debut mariem 
{path :'student/complaint', component:ComplaintComponent},
{ path: 'student/ajouter-reclamation', component:ReclamationFormComponent },
{ path: 'student/review', component:ReviewComponent },
{ path: 'admin/complaint', component:ClaimComponent },
{ path: 'admin/view', component:ViewComponent },
{ path: 'admin/stat',component:StatComponent },
{ path: 'admin/reponse_reclamation',component:AddReponseComponent},

//fin mariem






   /// yasmine
  { path: 'student/courses', component: CouseListEtudiantComponent},
  {path: 'student/courses/:id/contents', component:CourseContentEtudiantComponent},
{ path: 'student/courses/:id/:rating', component: CouseListEtudiantComponent},


//{ path: 'Student/courses/:id/contents', component: CourseContentBComponent },

 { path: 'admin/categories',component: AdminCategoryComponent},
 { path: 'admin/courses',component: CourseListComponent},
 { path: 'admin/courses/:id/contents',component: CourseContentComponent},



{ path: 'professor/courses', component: CourseListBComponent }, // liste des cours
{ path: 'professor/courses/create', component: CourseFormBComponent }, // créer un cours
{ path: 'professor/courses/edit/:id', component: CourseFormBComponent }, // modifier un cours
{ path: 'professor/courses/:id/contents', component: CourseContentBComponent },
 {path: 'professor/categories',component: CategoryManagementComponent},

 // fin yasmine

 ///debut youssef
 { path: 'admin/event', component: EventComponent },
  { path: 'admin/addevent', component: AddeventComponent }, 
  { path: 'admin/modifyevent/:id', component: ModifyeventComponent },
  { path: 'admin/feedback/:id', component: FeedbackeventbComponent },
  { path: 'admin/topfive', component: TopfiveeventbComponent },
  { path: 'admin/participants/:id', component: ParticipantsComponent },
  { path: 'admin/eventfeedback/:id', component: EventfeedbaksComponent },
  { path: 'admin/eventregistration/:id', component: EventregistrationsComponent },


  { path: 'student/eventf', component: EventfComponent},
  { path: 'student/feedbackeventf/:id', component: FeedbackeventfComponent },
  { path: 'student/topfiveeventf', component: TopfiveeventfComponent },
  { path: 'student/eventdetailsf/:id', component: EventdetailsfComponent },
  { path: 'student/eventregistrationsf', component: EventsuserfComponent },
  { path: 'student/eventchatbot', component: EventchatbotComponent },
  //fin youssef

  //début jawher

  { path: 'admin/addcomptebancaire', component: AddCompteBancaireComponent },


  {path:'admin/listcomptebancaire',component:ListComptebancaireComponent},
  {path:'admin/detailscomptebancaire/:id',component:DetailscomptebancaireComponent},
  {path: 'admin/updatecomptebancaire/:id', component: UpdatecomptebancaireComponent },

  {path:'student/addreservation/:id',component:AddReservationComponent},
  {path:'student/addpaiement/:id',component:AddPaiementComponent},
  {path:'student/listreservation',component:ListReservationComponent},
  {path:'admin/statistiquepaiement',component:StatistiquePaiementComponent},
  {path: 'admin/calendrierReservation', component: CalendrierReservationComponent },
  {path: 'student/chatbotpaiement', component: ChatbotPaiementComponent },







  //fin jawher




];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
