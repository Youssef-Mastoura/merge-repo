import { Component } from '@angular/core';
import { ReviewService } from 'src/app/services/review-b.service';
import { Review } from 'src/app/back-office/models/review';
import { User } from 'src/app/back-office/models/user';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent {
hoveredRating: any;
hoverRating(arg0: number) {
throw new Error('Method not implemented.');
}

  review: Review = {
    user: { id_User: 115 } as User, // tu peux remplacer 1 par l’ID réel du user connecté
    content: '',
    rating: 0
  };

  stars = [1, 2, 3, 4, 5];
  submitted = false;

  constructor(private reviewService: ReviewService) {}

  setRating(rating: number) {
    this.review.rating = rating;
  }

  submitReview() {
    this.reviewService.createReview(this.review).subscribe(() => {
      this.submitted = true;
      // 🔁 Reset propre avec tous les champs nécessaires
      this.review = {
        user: { id_User: 1 } as User,
        content: '',
        rating: 0
      };
    });
  }
}
