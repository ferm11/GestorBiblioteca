import { Component, OnDestroy} from '@angular/core';
import { MenuService } from 'src/app/servicios/menu.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/servicios/sesion.service';

declare var $: any;

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnDestroy{

  modalOpen: boolean = false;

  showNavbar : boolean = true;
  subscription : Subscription;

  constructor(private menuService : MenuService, public authService: AuthService){
    this.subscription = this.menuService.showNavbar.subscribe((value)=>{
      this.showNavbar = value;
    });
  }

ngOnDestroy(): void {
  this.subscription.unsubscribe();
}

toggleDropdown() {
  var dropdownContent = document.getElementById("dropdownContent");
  if (dropdownContent.style.display === "block") {
    dropdownContent.style.display = "none";
  } else {
    dropdownContent.style.display = "block";
  }
}

}
