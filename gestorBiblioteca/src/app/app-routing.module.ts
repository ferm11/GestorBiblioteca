import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InicioComponent } from './componentes/inicio/inicio.component';
import { AltaLibroComponent } from './componentes/alta-libro/alta-libro.component';
import { ActualizarLibroComponent } from './componentes/actualizar-libro/actualizar-libro.component';
import { AltaPrestamoComponent } from './componentes/alta-prestamo/alta-prestamo.component';
import { ActualizarPrestamoComponent } from './componentes/actualizar-prestamo/actualizar-prestamo.component';
import { TerminarPrestamoComponent } from './componentes/terminar-prestamo/terminar-prestamo.component';
import { GestionEjemplaresComponent } from './componentes/gestion-ejemplares/gestion-ejemplares.component';
import { ErrorComponent } from './componentes/error/error.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { LoginComponent } from './componentes/login/login.component';
import { RestablecerComponent } from './componentes/restablecer/restablecer.component';
import { AuthGuard } from './guards/auth.guard';
import { NoAuthGuard } from './guards/noauth.guard';
import { UsuariosComponent } from './componentes/usuarios/usuarios.component';

const routes: Routes = [
  {path: '', redirectTo:'/inicio', pathMatch: 'full'},
  {path: 'login', component: LoginComponent, canActivate:[AuthGuard]},
  {path: 'registrate', component: RegistroComponent, canActivate:[AuthGuard]},
  {path: 'restablecer', component: RestablecerComponent, canActivate:[AuthGuard]},
  {path: 'inicio', component: InicioComponent, canActivate:[AuthGuard]},
  {path: 'alta',component: AltaLibroComponent, canActivate:[NoAuthGuard]},
  {path: 'actualizar',component: ActualizarLibroComponent,canActivate:[NoAuthGuard]},
  {path: 'prestamo', component: AltaPrestamoComponent, canActivate:[NoAuthGuard]},
  {path: 'editar', component: ActualizarPrestamoComponent, canActivate:[NoAuthGuard]},
  {path: 'terminar', component: TerminarPrestamoComponent, canActivate:[NoAuthGuard]},
  {path: 'gestionEjemplares', component: GestionEjemplaresComponent, canActivate:[NoAuthGuard]},
  {path: 'usuarios', component: UsuariosComponent, canActivate:[NoAuthGuard]},
  {path: '**', component: ErrorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }