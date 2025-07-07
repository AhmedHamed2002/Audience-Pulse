import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../data.service';
import { ActivatedRoute } from '@angular/router';
import * as data from '../../../public/assets/data.json';
import { CommonModule } from '@angular/common';
import { Dropdown } from 'flowbite';
import { Modal } from 'flowbite';
import { initFlowbite } from 'flowbite';
declare const Chart: any
declare const ChartDataLabels: any ;

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit {
    @ViewChild('myChartCanvas') chartRef!: ElementRef<HTMLCanvasElement>;
    @ViewChild('modalRef') modalRef!: ElementRef;

  details:any[] = [];
  view:any = {} ;
  tweets:any[] = [] ;
  posts:any[] = [] ;
  information:any;
  chartInstance: any;
  modalInstance: any;
  view_now:number = 0 ;
  showDropdown: boolean = true;
  private modalReady = false;
  Dropdown: boolean = true;
  showModal = false;
  commentType:any= "positive" ;
  id!:number;

  constructor(private _DataService: DataService , private route: ActivatedRoute ,private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
  initFlowbite();
    this.information = this._DataService.getUserData();
    this.details = (data.result as any).default;
    this.id =  this.route.snapshot.params['id'];
    for (let i = 0; i < data.result.length; i++) {
      if (data.result[i].id == this.id) {
        this.view = data.result[i];
        this.tweets = this.view.dashboard.positive.posts;
        this.posts = this.view.dashboard.positive.posts_from_facebook;
        this.cdRef.detectChanges();
            this.initChart() ;
        this.view_now = i ;
        break;
      }
    }
  }
  initChart() {
    if (!this.chartRef) return;

    const ctx = this.chartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    if (this.chartInstance) {
    this.chartInstance.destroy();
  }
  Chart.register(ChartDataLabels);

  this.chartInstance = new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: ['Pos', 'Neutral', 'Neg'],
    datasets: [{
      label: this.view.request.query.replace(/^"|"$/g, ''),
      data: [
          (this.view.dashboard.positive.count+this.view.dashboard.positive.count_facebook) / (this.view.dashboard.positive.count+this.view.dashboard.neutral.count+this.view.dashboard.negative.count+this.view.dashboard.positive.count_facebook+this.view.dashboard.neutral.count_facebook+this.view.dashboard.negative.count_facebook)* 100,
          (this.view.dashboard.neutral.count+this.view.dashboard.neutral.count_facebook) / (this.view.dashboard.positive.count+this.view.dashboard.neutral.count+this.view.dashboard.negative.count+this.view.dashboard.positive.count_facebook+this.view.dashboard.neutral.count_facebook+this.view.dashboard.negative.count_facebook)* 100,
          (this.view.dashboard.negative.count+this.view.dashboard.negative.count_facebook) / (this.view.dashboard.positive.count+this.view.dashboard.neutral.count+this.view.dashboard.negative.count+this.view.dashboard.positive.count_facebook+this.view.dashboard.neutral.count_facebook+this.view.dashboard.negative.count_facebook)* 100
      ],
      backgroundColor: [
        'rgb(34, 197, 94)',
        'rgb(234, 179, 8)',
        'rgb(202, 46, 45)'
      ],
      hoverOffset: 4
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      datalabels: {
        color: '#fff',
        font: {
          weight: 'bold' as const
        },
        formatter: (value: number) => `${value.toFixed(1)}%`
      }
    }
  },
  plugins: [ChartDataLabels]
});
}

ngAfterViewChecked() {
    if (this.modalReady && this.modalRef) {
      this.modalInstance = new Modal(this.modalRef.nativeElement);
      this.modalInstance.show();
      this.modalReady = false;
    }

    if (this.showDropdown) {
      const toggleButton = document.getElementById('dropdownBtn');
      const dropdownMenu = document.getElementById('dropdownMenu');
      if (toggleButton && dropdownMenu && !dropdownMenu.getAttribute('data-initialized')) {
        new Dropdown(dropdownMenu, toggleButton, {
          placement: 'bottom',
          triggerType: 'click',
        });
        dropdownMenu.setAttribute('data-initialized', 'true');
      }
    }
  }

  openModal() {
    this.showModal = true;
    this.modalReady = true;
  }
  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
      this.showModal = false;
    }
  }

  sentiment(data:string) {
    this.tweets = this.view.dashboard[data].posts;
    this.posts = this.view.dashboard[data].posts_from_facebook;
    this.commentType  = data ;
    const dropdown = document.getElementById('dropdownMenu');
    if (dropdown) {
      dropdown.classList.add('hidden');
    }
}

  removeQuotes(name: string): string {
    return name.replace(/^"|"$/g, '');
  }
}
