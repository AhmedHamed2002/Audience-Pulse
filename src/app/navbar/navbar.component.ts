import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { DataService } from '../data.service';
import { CommonModule } from '@angular/common';
import { initFlowbite } from 'flowbite';
declare let ScrollReveal: any;

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink , RouterLinkActive ,CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit , AfterViewInit {
  isMenuOpen: boolean = false;
  logined:boolean = false ;

  constructor(private _DataService:DataService , private  _Router:Router){
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  ngOnInit(): void {
    initFlowbite();
    this._DataService.isLogined.subscribe(data =>{
      this.logined =  data ;
    })
  }
    ngAfterViewInit() {
      ScrollReveal().reveal('.reveal-from-bottom', {
        reset: true,
        delay: 300,
        distance: '70px',
        duration: 1000,
        origin: 'bottom',
        easing: 'ease-in-out'
      });
    }
  }
