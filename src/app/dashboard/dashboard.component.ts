import { Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef, AfterViewChecked, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService } from '../data.service';
import { CommonModule } from '@angular/common';
import { initFlowbite } from 'flowbite';
import Swal from 'sweetalert2';
import { Dropdown } from 'flowbite';
import { Modal } from 'flowbite';
import { LoadingComponent } from "../loading/loading.component";
import { RouterLink } from '@angular/router';
declare const Chart: any
declare const ChartDataLabels: any ;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoadingComponent ,RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit , AfterViewChecked {

  @ViewChild('myChartCanvas') chartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('modalRef') modalRef!: ElementRef;

  dashboards:any[] = [] ;
  view:any = {} ;
  tweets:any[] = [] ;
  posts:any[] = [] ;
  flag:boolean = false ;
  information:any;
  commentType:any= "positive" ;
  showDropdown: boolean = true;
  Dropdown: boolean = true;
  chartInstance: any;
  modalInstance: any;
  sortBy :string = "views count" ;
  isModalOpen = false;
  showModal = false;view_now:number = 0 ;
  private modalReady = false;

  filterForm = new FormGroup({
    favorite_count:new FormControl(null , Validators.pattern(/^\d+$/)) ,
    retweet_count:new FormControl(null , Validators.pattern(/^\d+$/)) ,
    source: new FormControl("", Validators.pattern(/^$|^[A-Za-z]+(?:\sfor\s[A-Za-z\s]+)?$/)) ,
    user_follower_count: new FormControl(null, Validators.pattern(/^\d+$/)),
    creation_date: new FormControl(null ,Validators.pattern(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/)),
    end_date: new FormControl(null , Validators.pattern(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/)),
    quote_count: new FormControl(null, Validators.pattern(/^\d+$/)),
    reply_count: new FormControl(null, Validators.pattern(/^\d+$/)),
    views_count: new FormControl(null, Validators.pattern(/^\d+$/)),
    language: new FormControl("", Validators.pattern(/^[a-z]{2}$/)),
    sort_by: new FormControl("views_count"),
    user_bot: new FormControl(false),
    user_blue_is_verified: new FormControl(false),
    user_location: new FormControl(null)
  })

  constructor(private _DataService: DataService ,private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    initFlowbite();
    this.information = this._DataService.getUserData();
    this._DataService.dashboard().subscribe({
      next: (data) => {
        this.flag = true ;
        if (data.message === "dashboard is done") {
            this.dashboards= data.result ;
            this.view = this.dashboards[this.view_now] ;
            this.tweets = this.view.dashboard.positive.posts;
            this.posts = this.view.dashboard.positive.posts_from_facebook;
            this.cdRef.detectChanges();
            this.initChart() ;
        }
      },
      error: () => {
        Swal.fire({
          icon: "error",
          title: "Sorry",
          text: "There is a techical fault , Try again later",
          background:'#171717' ,
          iconColor:'#ef4444',
          color:'#ffffff' ,
          customClass: {
            confirmButton: "btn btn-warning",
          },
        });
      }
    });
  }
  
  submitFilter(input: any) {
      this._DataService.filter(input.value).subscribe({
        next: (data) => {
          if (data.message === "dashboard is done") {
            this.sortBy = input.value.sort_by ;
            this.sortBy = this.sortBy.replace(/_/g, ' ');
            this.isModalOpen = false;
            this.dashboards= data.result ;
            this.view = this.dashboards[this.view_now] ;
            this.tweets = this.view.dashboard.positive.posts;
            this.posts = this.view.dashboard.positive.posts_from_facebook;
            this.commentType = "positive" ;
            this.cdRef.detectChanges();
            this.initChart() ;
            const Toast = Swal.mixin({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 1000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
              }
            });
            Toast.fire({
              icon: "success",
              title: "filtered successfully",
              background:'#171717' ,
              color:'#82dc72' ,
            });
          }
        },
        error: (err) => {
          Swal.fire({
            icon: "error",
            title: "Sorry",
            text: err.error.error?err.error.error:"There is a techical fault , Try again later",
            background:'#171717' ,
            iconColor:'#ef4444',
            color:'#ffffff' ,
            customClass: {
              confirmButton: "btn btn-warning",
            },
          });
        }
      });
    }

  removeQuotes(name: string): string {
    return name.replace(/^"|"$/g, '');
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

  viewDashboard(id:number) {
    for (let i = 0; i < this.dashboards.length; i++) {
      if (this.dashboards[i].id === id) {
        this.view = this.dashboards[i];
        this.tweets = this.view.dashboard.positive.posts;
        this.posts = this.view.dashboard.positive.posts_from_facebook;
        this.view_now = i ;
        break;
      }
    }
    this.initChart() ;
  const dropdown = document.getElementById('dropdownM');
  if (dropdown) {
    dropdown.classList.add('hidden');
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
    if (this.Dropdown) {
      const toggleButton = document.getElementById('dropdown');
      const dropdownMenu = document.getElementById('dropdownM');
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

  confirmDelete() {
    this.closeModal();
  }

}

