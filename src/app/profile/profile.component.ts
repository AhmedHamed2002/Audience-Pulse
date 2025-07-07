import {AfterViewInit, Component, OnInit} from '@angular/core';
import { DataService } from '../data.service';
import { Router, RouterLink} from '@angular/router';
import { FooterComponent } from "../footer/footer.component";
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { initFlowbite } from 'flowbite';
declare let ScrollReveal: any;

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FooterComponent,ReactiveFormsModule,CommonModule ,RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit , AfterViewInit {
  requests_done:any[] = [] ;
  requests_in_queue:any[] = [] ;
  accordionStates: boolean[] = [];

  information:any;
  updataForm = new FormGroup({
      username: new FormControl(null , [Validators.required , Validators.minLength(3) , Validators.maxLength(20) ,Validators.pattern(/^[a-zA-Z0-9]/)] ) ,
      email: new FormControl(null , Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) ,
      phone_number:  new FormControl(null , Validators.pattern(/^(01[0-2,5])\d{8}$/))
    }) ;

  constructor(private _DataService: DataService ,private router:Router) {}

  ngOnInit(): void {
    initFlowbite();
    this.accordionStates = this.requests_in_queue.map(() => false);
    this.information = this._DataService.getUserData();
    this._DataService.profile().subscribe({
          next: (data) => {
            if (data.message === "request sent successfully!") {
                this.requests_done = data.requests_done ;
                this.requests_in_queue = data.requests_in_queue ;
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

  removeQuotes(name: string): string {
  return name.replace(/^"|"$/g, '');
}

  toggleAccordion(index: number): void {
  this.accordionStates[index] = !this.accordionStates[index];
}

  editUser(input: any) {
    this._DataService.editUser(input.value).subscribe({
      next: (data) => {
        if (data.message === "User updated successfully") {
          this._DataService.addUserData(data.user);
          this.updateData() ;
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
            title: "updated Successful",
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

  logout(){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "",
        cancelButton: ""
      },
      buttonsStyling: true
    });
    swalWithBootstrapButtons.fire({
      title: "Are you sure?",
      text: "Are you sure you want to logout !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "cancel",
      reverseButtons: true,
      background:'#171717' ,
      iconColor:'#7052c2',
      color:'#ffffff' ,
    }).then((result) => {
      if (result.isConfirmed) {
        this._DataService.logoutUser().subscribe({
          next: (data) => {
            if (data.message === "Logout successful") {
                this._DataService.isLogined.next(false);
                this._DataService.removeUserData();
                this._DataService.saveState() ;
                this.router.navigate(['/login']);
              }
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
                title: "Logout Successful",
                background:'#171717' ,
                color:'#82dc72' ,
              });
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
      } else if (result.dismiss === Swal.DismissReason.cancel)
      {
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
          title: "Good Decision",
          background:'#171717' ,
          color:'#82dc72' ,
        });
      }
    });
  }

  updateData() {
    this.information = this._DataService.getUserData();
  }

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
