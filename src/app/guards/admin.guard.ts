import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor( private usuarioService: UsuarioService, private location: Location){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean  {
    
      if ( this.usuarioService.role === 'ADMIN_ROLE' ) {
        return true;
      } else {
        this.location.back();
        // this.router.navigateByUrl('/dashboard');
        return false;
      }
    
  }
  
}
