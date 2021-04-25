import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';

import { LoginForm } from '../interfaces/login-form.interface';
import { RegisterForm } from '../interfaces/register-form.interface';

import { Usuario } from '../models/usuario.model';

const base_url = environment.base_url

declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  
  /** propiedad corespondiente a google que contiene todo el estado de la autentificación */
  public auth2: any;
  public usuario:  Usuario;

  constructor( private http: HttpClient, private router: Router, private ngZone: NgZone) { 
    this.googleinit();
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uid(): string {
    return this.usuario.uid || '';
  }

  googleinit() {
    return new Promise<void>( resolve => {
      gapi.load('auth2', () => {
        // Retrieve the singleton for the GoogleAuth library and set up the client.
        this.auth2 = gapi.auth2.init({
          client_id: '821715352751-lvfjie4td9pdq6t6oi9676jfmb5penjs.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });
        
        resolve();
      });
    })
  }

  /** Serrar sesión */
  logout() {
    localStorage.removeItem('token');
    this.auth2.signOut().then( () => {
      this.ngZone.run( () =>{
        this.router.navigateByUrl('/login');
      })
    });
  }

  /** Validar el token de la paltaforma por medio de backend */
  validarToken(): Observable<boolean> {
    
    return this.http.get(`${ base_url }/login/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map( (resp: any ) => {
        /** desestructurar la información de la respuesta */
        const { email, google, nombre, role, img , uid } = resp.usuario;
        /** Creando la instancia del objeto usuario  */
        this.usuario = new Usuario( nombre, email, '', img, google, role, uid );
        localStorage.setItem('token', resp.token );
        return true;
      }),
      /** esto en caso de que suseda error  en todo el metodo, captura el error */
      catchError( error => of(false) )
    );
  }

  /** metodo de registro para el backend */
  crearUsuario( formData: RegisterForm ){
    return this.http.post(`${ base_url }/usuarios`, formData )
                    .pipe(
                      tap( (resp: any ) => {
                        localStorage.setItem('token', resp.token )
                      })
                    )
  }

  /** metodo de actualización para el usuaro del backend XD  */
  actualizarPerfil( data: { email: string, nombre: string, role?: string } ){
    data = {
      ...data,
      role: this.usuario.role
    };
    
    return  this.http.put( `${ base_url }/usuarios/${ this.uid }`, data, {
      headers: {
        'x-token': this.token
      }
    });
  }

  /** metodo de login para el backend */
  login( formData: LoginForm ){
    return this.http.post(`${ base_url }/login`, formData )
                    .pipe(
                      tap( (resp: any ) => {
                        localStorage.setItem('token', resp.token )
                      })
                    )
  }

  /** metodo de loginGoole para el backend */
  loginGoogle( token: string ){
    return this.http.post(`${ base_url }/login/google`, { token } )
                    .pipe(
                      tap( (resp: any ) => {
                        localStorage.setItem('token', resp.token )
                      })
                    )
  }

}
