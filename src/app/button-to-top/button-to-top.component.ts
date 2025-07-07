import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

  @Component({
    selector: 'app-button-to-top',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './button-to-top.component.html',
    styleUrl: './button-to-top.component.css',
  })
  export class ButtonToTopComponent {

    isVisible = false;

    @HostListener('window:scroll', [])
    onWindowScroll() {

      if (window.pageYOffset) {
        this.isVisible = true;
      } else {
        this.isVisible = false;
      }
    }

    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }
