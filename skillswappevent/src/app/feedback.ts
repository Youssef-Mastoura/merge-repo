import { myevent } from "./event";


export interface feedback {
  feedbackId?: number;
  eventRating: number;
  comment: string;
  event?: myevent;
}
