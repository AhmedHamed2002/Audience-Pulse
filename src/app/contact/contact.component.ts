import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FooterComponent } from "../footer/footer.component";
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { initFlowbite } from 'flowbite';
import { DataService } from '../data.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
declare const Chart: any;
declare let ScrollReveal: any;

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FooterComponent,CommonModule ,ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})

export class ContactComponent implements  OnInit, AfterViewInit {

  requestForm = new FormGroup({
      request_name: new FormControl(null , [Validators.required , Validators.minLength(2) , Validators.maxLength(30) ,Validators.pattern(/^[\u0600-\u06FFa-zA-Z]{1,}(?: [\u0600-\u06FFa-zA-Z]{1,})?$/)]) ,
      request_description: new FormControl(null , [Validators.required , Validators.minLength(20) , Validators.maxLength(250)]) ,
      start_date :new FormControl(null , [Validators.required , Validators.pattern(/^\d{2}\/\d{2}\/\d{4}$/)]) ,
      end_date :new FormControl(null , [ Validators.pattern(/^\d{2}\/\d{2}\/\d{4}$/)]) ,
      number_of_tweets:new FormControl(null , [Validators.max(500) , Validators.pattern(/^\d+$/)]) ,
      number_of_posts:new FormControl(null ,[Validators.max(100) ,  Validators.pattern(/^\d+$/)]) ,
      platforms: new FormGroup({
        x_twitter: new FormControl(true),
        facebook: new FormControl(false)
      })
    }) ;
    isPlatformSelected(): boolean {
      const platforms = this.requestForm.get('platforms') as FormGroup;
      return platforms.get('x_twitter')?.value  || platforms.get('facebook')?.value;
    }

    constructor(private _DataService:DataService , private _Router:Router){}

    request(input:any){
    this._DataService.requestUser(input.value).subscribe({
      next: (data) => {
        if (data.message === "request sent successfully!") {
          this._Router.navigate(['./profile']);
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
            title: "request sent successfully",
            background:'#2d2b2b' ,
            color:'#82dc72' ,
          });
        }
      },
      error: (err) => {
        Swal.fire({
          icon: "error",
          title: "Sorry",
          text: err.error.error?err.error.error:"There is a techical fault , Try again later",
          background:'#2d2b2b' ,
          iconColor:'#ef4444',
          color:'#ffffff' ,
          customClass: {
            confirmButton: "btn btn-warning",
          },
        });
      }
    });
    }

    ngOnInit(): void {
      initFlowbite();
    }

  ngAfterViewInit() {
    new Chart('myChart', {
      type: 'doughnut',
      data: {
        datasets: [{
          label: 'Welcome to Audience Pulse',
          data: [100, 60, 30 ,40],
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
    }) ;

    ScrollReveal().reveal('.reveal-from-bottom', {
      reset: true,
      delay: 100,
      distance: '70px',
      duration: 1500,
      origin: 'bottom',
      easing: 'ease-in-out'
    });
    ScrollReveal().reveal('.reveal-from-left', {
      reset: true,
      delay: 100,
      distance: '70px',
      duration: 1500,
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
