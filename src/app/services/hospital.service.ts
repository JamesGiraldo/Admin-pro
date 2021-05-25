import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { Hospital } from '../models/hospital.model';

import { environment } from '../../environments/environment';

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  public hospital: Hospital;

  constructor(private http: HttpClient) { }

  /** token del localStorage */
  get token(): string {
    return localStorage.getItem('token') || '';
  }

  /** headers que se requieren en la peticiones */
  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  /** Cargar los Hospitales, LISTARLOS */
  cargarHospitales(): Observable<Hospital[]> {
    const url = `${base_url}/hospitales`;
    return this.http.get<{ ok: boolean, hospitales: Hospital[] }>(url, this.headers)
      .pipe(
        map((resp: { ok: boolean, hospitales: Hospital[] }) => resp.hospitales)
      );
  }

  /** Crear los Hospital */
  crearHospital( nombre: string ) {
    const url = `${ base_url }/hospitales`;
    return this.http.post( url, { nombre }, this.headers );
  }

  /** Actualizar un  Hospital */
  actualizarHospital( nombre: string, uid?: string  ) {
    const url = `${base_url }/hospitales/${ uid}`;
    return this.http.put(url, { nombre }, this.headers);
  }

  /** Borrar un  Hospital */
  borrarHospital( uid?: string) {    
    const url = `${base_url }/hospitales/${ uid }`;
    return this.http.delete( url, this.headers );
  }

}
