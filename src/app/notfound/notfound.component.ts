import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
declare let ScrollReveal: any;

@Component({
  selector: 'app-notfound',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './notfound.component.html',
  styleUrl: './notfound.component.css'
})
export class NotfoundComponent {
  ngAfterViewInit() {
    ScrollReveal().reveal('.reveal-from-bottom', {
      reset: true,
      delay: 1200,
      distance: '100px',
      duration: 1500,
      origin: 'bottom',
      easing: 'ease-in-out'
    });
    ScrollReveal().reveal('.reveal-from-left', {
      reset: true,
      delay: 300,
      distance: '100px',
      duration: 1500,
      origin: 'left',
      easing: 'ease-in-out'
    });
    ScrollReveal().reveal('.reveal-from-right', {
      reset: true,
      delay: 300,
      distance: '100px',
      duration: 1500,
      origin: 'right',
      easing: 'ease-in-out'
    });
  }
}
