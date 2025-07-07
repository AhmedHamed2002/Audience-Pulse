import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Router, RouterLink } from '@angular/router';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
declare let ScrollReveal: any;

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent  implements OnInit{
  logined:boolean = false ;

  registerForm = new FormGroup({
    username: new FormControl(null , [Validators.required , Validators.minLength(3) , Validators.maxLength(20) ,Validators.pattern(/^[a-zA-Z][a-zA-Z0-9 ]*$/)] ) ,
    password: new FormControl(null , [Validators.required , Validators.minLength(8) , Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]/)]) ,
    password2: new FormControl(null , [Validators.required , Validators.minLength(8) , Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]/)]) ,
    email: new FormControl(null , Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) ,
    phone_number:  new FormControl(null , [Validators.required ,Validators.pattern(/^(01[0-2,5])\d{8}$/)])
  }, { validators: this.passwordMatchValidator }) ;

  constructor(private _DataService:DataService ,private _Router:Router){

  }
  ngOnInit(): void {
    this._DataService.isLogined.subscribe(data =>{
      this.logined = data ;
      if(this.logined){
        this._Router.navigate(['./home']);
      }
    })
  }

  passwordMatchValidator(formGroup: AbstractControl):any{
    const password = formGroup.get('password')?.value;
    const password2 = formGroup.get('password2')?.value;
    return password && password2 && password !== password2 ? { 'mismatch': true } : null;
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

  register(input: any) {

    this._DataService.registerUser(input.value).subscribe({
      next: (data) => {
        if (data.message === "User registered successfully!") {
          this._Router.navigate(['./login']);
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            }
          });
          Toast.fire({
            icon: "success",
            title: "Registration Successful . . . please enter your credentials",
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

