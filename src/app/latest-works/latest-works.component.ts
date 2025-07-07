import { AfterViewInit, Component } from '@angular/core';
import { FooterComponent } from "../footer/footer.component";
import { RouterLink } from '@angular/router';
declare let ScrollReveal: any;

@Component({
  selector: 'app-latest-works',
  standalone: true,
  imports: [RouterLink,FooterComponent],
  templateUrl: './latest-works.component.html',
  styleUrl: './latest-works.component.css'
})
export class LatestWorksComponent implements AfterViewInit{
  ngAfterViewInit() {
    ScrollReveal().reveal('.reveal-from-left', {
      reset: true,
      delay: 100,
      distance: '70px',
      duration: 1000,
      origin: 'left',
      easing: 'ease-in-out'
    });
  }
}
