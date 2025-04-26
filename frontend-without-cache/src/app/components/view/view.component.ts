import { Component, OnInit } from '@angular/core';
import { Review } from 'src/app/back-office/models/review';
import { ReviewService } from 'src/app/services/review-b.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  reviews: Review[] = [];

  constructor(private reviewService: ReviewService) {}

  ngOnInit(): void {
    this.reviewService.getAllReviews().subscribe(data => {
      this.reviews = data;
    });
  }

  getStars(rating: number): string[] {
    return Array(rating).fill('⭐');
  }

  averageRating: number | null = null;
showAverage = false;

getAverageRating(): void {
  this.reviewService.getAverageRating().subscribe(data => {
    this.averageRating = data;
    this.showAverage = true;
  });
}


getFullStars(rating: number | null): any[] {
  const fullStars = Math.floor(rating || 0);
  return Array(fullStars);
}

hasHalfStar(rating: number | null): boolean {
  return rating !== null && rating % 1 >= 0.5;
}

getEmptyStars(rating: number | null): any[] {
  const full = Math.floor(rating || 0);
  const half = this.hasHalfStar(rating) ? 1 : 0;
  return Array(5 - full - half);
}


}
