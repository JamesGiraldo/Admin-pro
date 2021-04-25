import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { SidebarService } from '../../services/sidebar.service';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit {

  public menuItems: any[];
  public usuario: Usuario;

  constructor( private sidebarService: SidebarService, private usuarioService: UsuarioService ) {
    this.menuItems = sidebarService.menu;    
    this.usuario = usuarioService.usuario;
  }


  logout(){
    this.usuarioService.logout();
  }

  ngOnInit(): void {
  }

}
