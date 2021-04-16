import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit {

  menuItems: any[];

  constructor( private sidebarService: SidebarService, private usuarioService: UsuarioService ) {
    this.menuItems = sidebarService.menu;    
  }


  logout(){
    this.usuarioService.logout();
  }

  ngOnInit(): void {
  }

}
