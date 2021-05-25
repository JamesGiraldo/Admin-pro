import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Medico } from '../models/medico.model';

import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  public medico: Medico;

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

  /** Cargar los Medicos, LISTARLOS */
  cargarMedicos(): Observable<Medico[]> {
    const url = `${base_url}/medicos`;
    return this.http.get<{ ok: boolean, medicos: Medico[] }>(url, this.headers)
      .pipe(
        map((resp: { ok: boolean, medicos: Medico[] }) => resp.medicos)
      );
  }

  /** Obtener un medico en especifico por id  */
  obtenerMedicoPorId( uid: string ){
    const url = `${ base_url }/medicos/${ uid }`;
    return this.http.get<{ ok: boolean, medico: Medico }>(url, this.headers)
                .pipe(
                  map((resp: { ok: boolean, medico: Medico }) => resp.medico )
                );
  }

  /** Crear Medico */
  crearMedico( medico: { nombre: string, hospital: string } ) {

    const url = `${ base_url }/medicos`;
    return this.http.post( url, medico, this.headers );
  }

  /** Actualizar un  Medico */
  actualizarMedico( medico: Medico ) {

    const url = `${base_url }/medicos/${ medico.uid }`;
    return this.http.put(url, medico, this.headers);
  }

  /** Borrar un  Medico */
  borrarMedico( uid?: string ) {
    
    const url = `${base_url }/medicos/${ uid }`;
    return this.http.delete( url, this.headers );
  }
}
