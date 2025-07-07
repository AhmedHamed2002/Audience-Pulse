import { AfterViewInit, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
declare let ScrollReveal: any;

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements AfterViewInit {
  ngAfterViewInit() {

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
