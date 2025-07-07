import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
declare let ScrollReveal: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule , RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  logined:boolean = false ;

  loginForm = new FormGroup({
    email: new FormControl(null , Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) ,
    password: new FormControl(null)
  }) ;

  constructor(private _DataService:DataService ,private _Router:Router){
  }

  ngOnInit(): void {
    this._DataService.isLogined.subscribe(data =>{
      this.logined = data ;
      if(this.logined){
        this._DataService.check().subscribe((data) => {
          if (data.message === "logged in") {
            this._Router.navigate(['./home']);
          }
        });
      }
    })
  }
  disableAction(event: ClipboardEvent): void {
    event.preventDefault();
    Swal.fire({
      icon: "warning",
      title: "Sorry",
      text: "Copy-paste is disabled for security reasons.",
      background:'#171717' ,
      iconColor:'#ef4444',
      color:'#ffffff' ,
      customClass: {
        confirmButton: "btn btn-warning",
      },
    });
  }

  login(input: any) {

    this._DataService.loginUser(input.value).subscribe({
      next: (data) => {
        if (data.message === "Login successful") {
          this._DataService.isLogined.next(true);
          this._DataService.addUserData(data.user);
          this._DataService.saveState() ;
          this._Router.navigate(['./home']);
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
            title: "Login Successful.",
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
  ngAfterViewInit() {
    ScrollReveal().reveal('.reveal-from-top', {
      reset: true,
      delay: 100,
      distance: '50px',
      duration: 1000,
      origin: 'top',
      easing: 'ease-in-out'
    });
    ScrollReveal().reveal('.reveal-from-bottom', {
      reset: true,
      delay: 100,
      distance: '50px',
      duration: 1000,
      origin: 'bottom',
      easing: 'ease-in-out'
    });
  }

}
