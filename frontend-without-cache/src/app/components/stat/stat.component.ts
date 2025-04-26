import { Component, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { ReclamationService } from 'src/app/services/reclamation-b.service';

@Component({
  selector: 'app-stat',
  templateUrl: './stat.component.html',
  styleUrls: ['./stat.component.css']
})
export class StatComponent implements OnInit {
  pieChartLabels: string[] = [];
  pieChartData: number[] = [];

  chartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
  };

  constructor(private reclamationService: ReclamationService) {}

  ngOnInit(): void {
    this.reclamationService.getStatsByType().subscribe(stats => {
      this.pieChartLabels = Object.keys(stats);
      this.pieChartData = Object.values(stats);
    });
  }
}
  
