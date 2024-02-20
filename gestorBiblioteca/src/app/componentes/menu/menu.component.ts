import { Component, OnDestroy } from '@angular/core';
import { MenuService } from 'src/app/servicios/menu.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnDestroy{

  showNavbar : boolean = true;
  subscription : Subscription;

  constructor(private menuService : MenuService){
    this.subscription = this.menuService.showNavbar.subscribe((value)=>{
      this.showNavbar = value;
    });
  }

ngOnDestroy(): void {
  this.subscription.unsubscribe();
}

}
