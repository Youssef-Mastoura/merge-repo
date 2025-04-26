import { myevent } from "./event";
import { User } from "./back-office/models/user";


export interface feedback {
  feedbackId?: number;
  eventRating: number;
  comment: string;
  event?: myevent;
  user?: User;
}
