import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';

import { LoginForm } from '../interfaces/login-form.interface';
import { RegisterForm } from '../interfaces/register-form.interface';

const base_url = environment.base_url

declare const gapi:any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  /** propiedad corespondiente a google que contiene todo el estado de la autentificación */
  public auth2: any;

  constructor( private http: HttpClient, private router: Router, private ngZone: NgZone) { 
    this.googleinit();
  }

  googleinit() {
    return new Promise( resolve => {
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
    var token = localStorage.getItem('token') || '';
    return this.http.get(`${ base_url }/login/renew`, {
      headers: {
        'x-token': token
      }
    }).pipe(
      tap( (resp: any ) => {
        localStorage.setItem('token', resp.token )
      }),
      map( resp => true ),
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
