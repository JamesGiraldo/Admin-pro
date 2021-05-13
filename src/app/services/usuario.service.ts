import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, tap, catchError, delay } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { environment } from '../../environments/environment';

import { LoginForm } from '../interfaces/login-form.interface';
import { RegisterForm } from '../interfaces/register-form.interface';
import { CargarUsuarios } from '../interfaces/cargar-usuarios.interface';


import { Usuario } from '../models/usuario.model';

const base_url = environment.base_url

declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  /** propiedad corespondiente a google que contiene todo el estado de la autentificación */
  public auth2: any;
  public usuario: Usuario;

  constructor(private http: HttpClient, private router: Router, private ngZone: NgZone) {
    this.googleinit();
  }

  /** token del localStorage */
  get token(): string {
    return localStorage.getItem('token') || '';
  }

  /** identificador  */
  get uid(): string {
    return this.usuario.uid || '';
  }

  /** headers que se requieren en la peticiones */
  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  /**  inicialización de google login credenciales */
  googleinit() {
    return new Promise<void>(resolve => {
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
    this.auth2.signOut().then(() => {
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      })
    });
  }

  /** Validar el token de la paltaforma por medio de backend */
  validarToken(): Observable<boolean> {

    return this.http.get(`${base_url}/login/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map((resp: any) => {
        /** desestructurar la información de la respuesta */
        const { email, google, nombre, role, img, uid } = resp.usuario;
        /** Creando la instancia del objeto usuario  */
        this.usuario = new Usuario(nombre, email, '', img, google, role, uid);
        localStorage.setItem('token', resp.token);
        return true;
      }),
      /** esto en caso de que suseda error  en todo el metodo, captura el error */
      catchError(error => of(false))
    );
  }

  /** metodo de registro para el backend */
  crearUsuario(formData: RegisterForm) {
    return this.http.post(`${base_url}/usuarios`, formData)
      .pipe(
        tap((resp: any) => {
          localStorage.setItem('token', resp.token)
        })
      )
  }

  /** metodo de actualización para el usuaro del backend XD  */
  actualizarPerfil(data: { email: string, nombre: string, role?: string }) {
    data = {
      ...data,
      role: this.usuario.role
    };

    return this.http.put(`${base_url}/usuarios/${this.uid}`, data, this.headers);
  }

  /** metodo de login para el backend */
  login(formData: LoginForm) {
    return this.http.post(`${base_url}/login`, formData)
      .pipe(
        tap((resp: any) => {
          localStorage.setItem('token', resp.token)
        })
      )
  }

  /** metodo de loginGoole para el backend */
  loginGoogle(token: string) {
    return this.http.post(`${base_url}/login/google`, { token })
      .pipe(
        tap((resp: any) => {
          localStorage.setItem('token', resp.token)
        })
      )
  }

  /** Cargar los usuarios, LISTARLOS */
  cargarUsuarios(desde: number = 0) {
    /** /usuarios?desde=0 */
    const url = ` ${base_url}/usuarios?desde=${desde} `;
    return this.http.get<CargarUsuarios>(url, this.headers)
      .pipe(
        delay(5),
        map(resp => {

          const usuarios = resp.usuarios.map(
            user => new Usuario(user.nombre, user.email, '', user.img, user.google, user.role, user.uid)
          );
          return {
            total: resp.total,
            usuarios
          };
        })
      )
  }

  /** Eliminar usuario */
  eleminarUsuarios(usuario: Usuario) {
    /** /usuarios/60177e4c5832766de1deaa52 */
    const url = ` ${base_url}/usuarios/${usuario.uid} `;
    return this.http.delete(url, this.headers)
  }

  /** metodo de actualización de roles  para los ususaios del backend XD  */
  guardarUsuario(usuario: Usuario) {

    return this.http.put(`${base_url}/usuarios/${usuario.uid}`, usuario, this.headers);
  }

}
