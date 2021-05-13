import { Injectable } from '@angular/core';
import { EventEmitter } from 'events';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class ModalImagenService {

  private _ocultarModal: boolean = true;
  public tipo: 'usuarios'|'medicos'|'hospitales';
  public id: string;
  public img: string;

  public nuevaImagen: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  get ocultarModal(){
    return this._ocultarModal;
  }

  abrirModal(
    tipo: 'usuarios'|'medicos'|'hospitales',
    id: string,
    img: string = 'no-img'
  ){
    this._ocultarModal = false;
    this.tipo = tipo;
    this.id = id;
    // this.img = img;
    /** http://localhost:3000/api/upload/usuarios/xxx.jpg */
    if ( img.includes('https') ) {
      this.img = img;
    } else {
      this.img = `${ base_url }/upload/${ tipo }/${ img }`
    }
    console.log(this.img)
  }

  cerraModal(){
    this._ocultarModal = true;
  }

}
