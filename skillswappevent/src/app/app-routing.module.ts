import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventComponent } from './event/event.component';
import { AddeventComponent } from './addevent/addevent.component';
import { ModifyeventComponent } from './modifyevent/modifyevent.component';
import { FeedbackComponent } from './feedback/feedback.component';

const routes: Routes = [
  { path: '', component: EventComponent },
  { path: 'addevent', component: AddeventComponent }, 
  { path: 'modifyevent/:id', component: ModifyeventComponent },
  { path: 'feedback/:id', component: FeedbackComponent },

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
