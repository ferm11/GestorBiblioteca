import { Component } from '@angular/core';
import { AuthService } from 'src/app/servicios/auth.service';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-caduca',
  templateUrl: './caduca.component.html',
  styleUrls: ['./caduca.component.css']
})
export class CaducaComponent {

  constructor(private authService:AuthService){}

  logout(){
    this.authService.logout();
  }

  
  
  
  

}
