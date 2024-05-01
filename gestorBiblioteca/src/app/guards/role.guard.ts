import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../servicios/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Obtener los datos del usuario desde el servicio AuthService
    const userData = this.authService.getUserDataFromLocalStorage();

    // Si no hay datos de usuario, bloquear el acceso a la página de alta
    if (!userData) {
      console.log('No hay datos de usuario. Bloqueando el acceso a la página de alta.');
      // Redirigir a una página diferente (por ejemplo, la página de inicio)
      this.router.navigate(['/inicio']);
      return false; // Devolver false para bloquear la navegación
    }

    // Obtiene el rol esperado de la ruta desde la propiedad data
    const expectedRole = route.data['expectedRole'];

    // Obtiene el rol actual del usuario desde los datos del usuario
    const currentUserRole = userData.rol;

    // Verifica si el usuario tiene permiso para acceder a la ruta
    if (expectedRole.includes(currentUserRole)) {
      // El usuario tiene el rol esperado, por lo tanto, tiene acceso a la ruta
      return true;
    } else {
      // El usuario no tiene el rol esperado, por lo tanto, redirige a una página de acceso denegado
      console.log('Usuario no autorizado para acceder a esta ruta. Rol actual:', currentUserRole);
<<<<<<< HEAD
      this.router.navigate(['/prestamos']); // Puedes cambiar '/access-denied' por la ruta que desees para el acceso denegado
=======
      this.router.navigate(['/inicio-usuario']); // Puedes cambiar '/access-denied' por la ruta que desees para el acceso denegado
>>>>>>> fe808bdc601821cb6bf69d2f374fae3bb6fdf345
      return false;
    }
  }
}