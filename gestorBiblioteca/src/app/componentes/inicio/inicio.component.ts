import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuService } from 'src/app/servicios/menu.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit, OnDestroy{

constructor (private menuService: MenuService){}

ngOnInit(): void {
  this.menuService.hide();
}

ngOnDestroy(): void {
  this,this.menuService.display();
}

}
