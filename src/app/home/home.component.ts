import { AfterViewInit, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { initFlowbite } from 'flowbite';
declare const Chart: any;
declare let ScrollReveal: any;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink,FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit , AfterViewInit{

  ngOnInit(): void {
    initFlowbite();
  }
  ngAfterViewInit() {
    new Chart('myChart', {
      type: 'doughnut',
      data: {
        datasets: [{
          label: 'Welcome to Audience Pulse',
          data: [100, 50, 10 ,40],
          backgroundColor: [
            'rgb(111, 85, 182)',
            'rgb(204, 173, 240)',
            'rgb(116, 11, 139)' ,
            'rgb(90, 41, 224)'
          ],
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
      },
    });

    ScrollReveal().reveal('.reveal-from-top', {
      reset: true,
      delay: 100,
      distance: '70px',
      duration: 1000,
      origin: 'top',
      easing: 'ease-in-out'
    });
    ScrollReveal().reveal('.reveal-from-bottom', {
      reset: true,
      delay: 100,
      distance: '70px',
      duration: 1000,
      origin: 'bottom',
      easing: 'ease-in-out'
    });
    ScrollReveal().reveal('.reveal-from-left', {
      reset: true,
      delay: 100,
      distance: '100px',
      duration: 1000,
      origin: 'left',
      easing: 'ease-in-out'
    });
    ScrollReveal().reveal('.reveal-from-right', {
      reset: true,
      delay: 100,
      distance: '100px',
      duration: 1000,
      origin: 'right',
      easing: 'ease-in-out'
    });
  }
}
