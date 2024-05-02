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
import { RoleGuard } from './guards/role.guard';
import { InicioUsuarioComponent } from './componentes/inicio-usuario/inicio-usuario.component';
<<<<<<< HEAD
import { ApartadosComponent } from './componentes/apartados/apartados.component';
import { CategoriasComponent } from './componentes/categorias/categorias.component';
import { DisponibilidadComponent } from './componentes/disponibilidad/disponibilidad.component';
import { NuestrosEjemplaresComponent } from './componentes/nuestros-ejemplares/nuestros-ejemplares.component';
import { ServiciosComponent } from './componentes/servicios/servicios.component';
=======
import { CaducaComponent } from './componentes/caduca/caduca.component';
import { ActualizarComponent } from './componentes/actualizar/actualizar.component';
import { NuestrosEjemplaresComponent } from './componentes/nuestros-ejemplares/nuestros-ejemplares.component';
import { CategoriasComponent } from './componentes/categorias/categorias.component';
import { DisponibilidadComponent } from './componentes/disponibilidad/disponibilidad.component';
import { ApartadosComponent } from './componentes/apartados/apartados.component';
>>>>>>> fe808bdc601821cb6bf69d2f374fae3bb6fdf345
import { SolicitudesComponent } from './componentes/solicitudes/solicitudes.component';
import { ListaComponent } from './componentes/lista/lista.component';

const routes: Routes = [
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  { path: 'registrate', component: RegistroComponent, canActivate: [AuthGuard] },
  { path: 'restablecer', component: RestablecerComponent, canActivate: [AuthGuard] },
  { path: 'inicio', component: InicioComponent, canActivate: [AuthGuard]},
<<<<<<< HEAD
  { path: 'apartados', component: ApartadosComponent, canActivate: [AuthGuard]},
  { path: 'categorias', component: CategoriasComponent, canActivate:[AuthGuard]},
  { path: 'disponibilidad', component: DisponibilidadComponent, canActivate:[AuthGuard]},
  { path: 'nuestros-ejemplares', component: NuestrosEjemplaresComponent, canActivate:[AuthGuard]},
  { path: 'servicios', component: ServiciosComponent, canActivate:[AuthGuard]},
  { path: 'solicitudes', component: SolicitudesComponent, canActivate:[AuthGuard]},
=======
  { path: 'nuestrosEjemplares', component: NuestrosEjemplaresComponent, canActivate: [AuthGuard]},
  { path: 'categorias', component: CategoriasComponent, canActivate: [AuthGuard]},
  { path: 'disponibilidad', component: DisponibilidadComponent, canActivate: [AuthGuard]},
  { path: 'apartados', component: ApartadosComponent, canActivate: [AuthGuard]},
  { path: 'solicitudes', component: SolicitudesComponent, canActivate: [AuthGuard]},
<<<<<<< HEAD
>>>>>>> fe808bdc601821cb6bf69d2f374fae3bb6fdf345
=======
  { path: 'lista', component: ListaComponent, canActivate: [RoleGuard], data: { expectedRole: ['administrador', 'bibliotecario'] } },
>>>>>>> b76f24a7942d5bacfe5ebb38e00bc4f6c72bc8c1
  { path: 'alta', component: AltaLibroComponent, canActivate: [RoleGuard], data: { expectedRole: ['administrador', 'bibliotecario'] } },
  { path: 'actualizar', component: ActualizarLibroComponent, canActivate: [RoleGuard], data: { expectedRole: ['administrador', 'bibliotecario'] } },
  { path: 'prestamo', component: AltaPrestamoComponent, canActivate: [RoleGuard], data: { expectedRole: ['administrador','estudiante', 'profesor', 'bibliotecario'] } },
  { path: 'editar', component: ActualizarPrestamoComponent, canActivate: [RoleGuard], data: { expectedRole: ['administrador', 'bibliotecario'] } },
  { path: 'terminar', component: TerminarPrestamoComponent, canActivate: [RoleGuard], data: { expectedRole: ['administrador', 'bibliotecario'] } },
  { path: 'gestionEjemplares', component: GestionEjemplaresComponent, canActivate: [RoleGuard], data: { expectedRole: ['administrador', 'bibliotecario'] } },
  { path: 'usuarios', component: UsuariosComponent, canActivate: [RoleGuard], data: { expectedRole: ['administrador'] } },
<<<<<<< HEAD
  { path: 'caduca',component:CaducaComponent, canActivate: [RoleGuard], data: { expectedRole: ['administrador','estudiante', 'profesor', 'bibliotecario'] }},
  { path: 'inicio-usuario', component: InicioUsuarioComponent, canActivate: [RoleGuard], data: { expectedRole: ['administrador','estudiante', 'profesor', 'bibliotecario'] }},
  { path: '**', component: ErrorComponent, canActivate: [RoleGuard], data: { expectedRole: ['administrador','estudiante', 'profesor', 'bibliotecario'] } }
=======
  { path: 'inicio-usuario', component: InicioUsuarioComponent, canActivate: [RoleGuard], data: { expectedRole: ['administrador','estudiante', 'profesor', 'bibliotecario'] } },
  { path: 'caduca', component:CaducaComponent, canActivate: [RoleGuard], data: { expectedRole: ['administrador','estudiante', 'profesor', 'bibliotecario'] }},
  { path: 'actualizarUsuarios', component:ActualizarComponent, canActivate: [RoleGuard], data: { expectedRole: ['administrador','estudiante', 'profesor', 'bibliotecario'] }},
  {path: 'lista', component: ListaComponent, canActivate: [RoleGuard], data: { expectedRole: ['estudiante','administrador', 'profesor', 'bibliotecario'] } },
  { path: '**', component: ErrorComponent }
>>>>>>> fe808bdc601821cb6bf69d2f374fae3bb6fdf345
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }