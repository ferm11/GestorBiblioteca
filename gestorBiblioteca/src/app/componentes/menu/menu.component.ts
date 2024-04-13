import { Component, OnDestroy} from '@angular/core';
import { MenuService } from 'src/app/servicios/menu.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/servicios/auth.service';

declare var $: any;

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnDestroy{

  showNavbar : boolean = true;
  isLoggedIn: boolean = false;
  subscription : Subscription;
  userData: any ={} ;

  constructor(private menuService : MenuService, private authService:AuthService){
    this.subscription = this.menuService.showNavbar.subscribe((value)=>{
      this.showNavbar = value;
    });
    this.authService.getLoggedIn().subscribe((value: boolean) => {
      this.isLoggedIn = value;
      console.log('Estado de autenticacion actualizado', this.isLoggedIn);
    });
    this.authService.getUserData().subscribe((userData: any)=>{
      this.userData = userData;
    })
    this.authService.getUserData().subscribe((userData: any) => {
      console.log('Datos del usuario recibidos en MenuComponent:', userData);
      this.userData = userData;
    });
    
  }

  logout() {
    // Lógica para cerrar sesión, por ejemplo, al enviar una solicitud al servidor
    // Después de cerrar sesión, notifica al servicio de autenticación
    this.authService.setLoggedIn(false);
  }

ngOnDestroy(): void {
  this.subscription.unsubscribe();
}

}