import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuService } from 'src/app/servicios/menu.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/servicios/auth.service';
import { Router } from '@angular/router'; // Importar Router en lugar de ActivatedRoute
import Swal from 'sweetalert2';

declare var $: any;

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnDestroy, OnInit {

  isButtonEnabled: boolean = true;
  showButton: boolean = true; // Inicialmente, mostrar el botón

  showNavbar: boolean = true;
  isLoggedIn: boolean = true;
  subscription: Subscription;
  userData: any = {};
  jwtToken: string;
  expirationTime: Date;

  constructor(private menuService: MenuService, private authService: AuthService, private router: Router) {
    this.subscription = this.menuService.showNavbar.subscribe((value) => {
      this.showNavbar = value;
    });
    this.authService.getLoggedIn().subscribe((value: boolean) => {
      this.isLoggedIn = value;
      console.log('Estado de autenticacion actualizado', this.isLoggedIn);
    });
    this.authService.getUserData().subscribe((userData: any) => {
      this.userData = userData;
    });
    this.userData = JSON.parse(localStorage.getItem('userData'));
    console.log('Datos del usuario obtenidos del localStorage en el componente:', this.userData);

    // Obtener el token JWT del localStorage
    this.jwtToken = localStorage.getItem('token');
    console.log('Token JWT obtenido del localStorage en el componente:', this.jwtToken);

    // Suscribirse al cambio de datos del usuario
    this.subscription = this.authService.getUserData().subscribe((userData: any) => {
      console.log('Datos del usuario recibidos en el componente:', userData);
      this.userData = userData;
    });

    // Verificar la ruta actual y deshabilitar el botón si es necesario
    const currentRoute = this.router.url;
    if (currentRoute === '/inicio' || currentRoute === '/registrate' || currentRoute === '/restablecer') {
      this.isButtonEnabled = false;
    }
  }

  ngOnInit() {
    this.router.events.subscribe(() => { // Usar router.events en lugar de route.url
      const currentRoute = this.router.url;
      // Ocultar el botón en ciertas rutas
      if (currentRoute === '/login' || currentRoute === '/restablecer') {
        this.showButton = false;
      } else {
        // Verificar si userData es null
        if (this.userData === null) {
          this.showButton = false;
        } else {
          this.showButton = true;
        }
      }
    });
    // Suscríbete a los cambios en la información de expiración del token
    this.subscription = this.authService.getExpirationTime().subscribe((expirationTime: Date) => {
      // Asigna la fecha de expiración del token
      this.expirationTime = expirationTime;
      // Muestra la fecha de expiración en la consola o en otro lugar
      console.log('Tiempo de expiración del token:', this.expirationTime);
    });
  }

  // Método para cerrar sesión
  logout() {
    console.log('Cerrando sesión');
    
    // Llamar al método logout del AuthService
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}