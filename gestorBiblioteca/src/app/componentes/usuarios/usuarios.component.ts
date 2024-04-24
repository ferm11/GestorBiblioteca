import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/servicios/usuarios.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  usuarios: any[] = []; // Usamos un tipo genérico 'any' para los usuarios

  constructor(private usuariosService: UsuariosService) { }

  ngOnInit(): void {
    this.usuariosService.obtenerUsuarios().subscribe((resp: any[]) => {
      this.usuarios = resp;
    }, err => {
      console.error(err);
      // Manejo de errores
    });
  }
}