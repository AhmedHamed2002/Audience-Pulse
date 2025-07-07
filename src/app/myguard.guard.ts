import { CanActivateFn, Router } from '@angular/router';
import { DataService } from './data.service';
import { inject } from '@angular/core';
import Swal from 'sweetalert2';

export const myguardGuard: CanActivateFn = (route, state) => {
  let dataService = inject(DataService) ;
  let router = inject(Router) ;
  if(dataService.isLogined.getValue()==true){
    return true ;
  }
  else{
    router.navigate(['/login']) ;
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3500,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    Toast.fire({
      icon: "error",
      title: "Good try , don't repeat it.",
      background:'#171717' ,
      color:'#f27474' ,
    });
  }
    return false ;
}
