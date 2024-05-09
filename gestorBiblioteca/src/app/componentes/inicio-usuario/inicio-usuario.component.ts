<<<<<<< HEAD
import { Component } from '@angular/core';

@Component({
  selector: 'app-inicio-usuario',
  standalone: true,
  imports: [],
  templateUrl: './inicio-usuario.component.html',
  styleUrl: './inicio-usuario.component.css'
})
export class InicioUsuarioComponent {

=======
// inicio-usuario.component.ts

import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/servicios/auth.service';

@Component({
  selector: 'app-inicio-usuario',
  templateUrl: './inicio-usuario.component.html',
  styleUrls: ['./inicio-usuario.component.css']
})
export class InicioUsuarioComponent implements OnInit {

  userData: any;

  constructor(private authService:AuthService) {}

  ngOnInit(): void {
    this.userData = JSON.parse(localStorage.getItem('userData'));
    console.log('Datos del usuario obtenidos del localStorage en el componente:', this.userData);
  }
  
>>>>>>> fe808bdc601821cb6bf69d2f374fae3bb6fdf345
}
