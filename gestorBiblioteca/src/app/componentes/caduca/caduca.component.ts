<<<<<<< HEAD
import { Component } from '@angular/core';
import { AuthService } from 'src/app/servicios/auth.service';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
=======
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/servicios/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';
>>>>>>> fe808bdc601821cb6bf69d2f374fae3bb6fdf345

@Component({
  selector: 'app-caduca',
  templateUrl: './caduca.component.html',
  styleUrls: ['./caduca.component.css']
})
<<<<<<< HEAD
export class CaducaComponent {

  constructor(private authService:AuthService){}

  logout(){
    this.authService.logout();
  }

  
  
  
  

=======
export class CaducaComponent implements OnInit {

  sessionExpiration: Subject<void> = new Subject<void>();
  sessionTimer: any;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {

  }

  extendSession(): void {
    // Redirigir al usuario a la página de inicio-usuario
    this.router.navigate(['/inicio-usuario']);
    Swal.fire({
      icon: 'success',
      title: '¡Sesión extendida!',
      text: 'Tu sesión ha sido extendida correctamente.',
      confirmButtonText: 'Aceptar'
    });
    // Después de 2 minutos, mostrar el mensaje de sesión extendida exitosa
    setTimeout(() => {
      this.router.navigate(['/caduca']);
    }, 5 * 60 * 1000);
  }

  logout(): void {
    this.authService.logout();
  }
>>>>>>> fe808bdc601821cb6bf69d2f374fae3bb6fdf345
}
