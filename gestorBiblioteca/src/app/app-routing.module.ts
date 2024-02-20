import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './componentes/inicio/inicio.component';
import { AltaLibroComponent } from './componentes/alta-libro/alta-libro.component';
import { ActualizarLibroComponent } from './componentes/actualizar-libro/actualizar-libro.component';
import { AltaPrestamoComponent } from './componentes/alta-prestamo/alta-prestamo.component';
import { ActualizarPrestamoComponent } from './componentes/actualizar-prestamo/actualizar-prestamo.component';
import { TerminarPrestamoComponent } from './componentes/terminar-prestamo/terminar-prestamo.component';
import { GestionEjemplaresComponent } from './componentes/gestion-ejemplares/gestion-ejemplares.component';
import { ErrorComponent } from './componentes/error/error.component';

const routes: Routes = [
  {path: '', redirectTo:'/inicio', pathMatch: 'full'},
  {path: 'inicio', component: InicioComponent},
  {path: 'alta',component: AltaLibroComponent},
  {path: 'actualizar',component: ActualizarLibroComponent},
  {path: 'prestamo', component: AltaPrestamoComponent},
  {path: 'editar', component: ActualizarPrestamoComponent},
  {path: 'terminar', component: TerminarPrestamoComponent},
  {path: 'gestionEjemplares', component: GestionEjemplaresComponent},
  {path: '**', component: ErrorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
