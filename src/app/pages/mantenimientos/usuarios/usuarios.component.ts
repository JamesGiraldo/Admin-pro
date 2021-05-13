import { Component, OnDestroy, OnInit } from '@angular/core';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { Usuario } from 'src/app/models/usuario.model';

import { BusquedasService } from 'src/app/services/busquedas.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { UsuarioService } from 'src/app/services/usuario.service';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];

  public imgSubs: Subscription;
  public desde: number = 0;
  public cargando: boolean = true;

  constructor(private usuarioService: UsuarioService, private busquedasService: BusquedasService, private modalImagenService: ModalImagenService) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe()
  }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.imgSubs = this.modalImagenService.nuevaImagen
        .pipe(
          delay(100)
        )
        .subscribe( ( img: any ) => {
          this.cargarUsuarios()
        });
  }

  cargarUsuarios() {
    this.cargando = true;
    this.usuarioService.cargarUsuarios(this.desde)
      .subscribe(({ total, usuarios }) => {
        this.totalUsuarios = total;
        this.usuarios = usuarios;
        this.usuariosTemp = usuarios;
        this.cargando = false;
      })
  }

  /** cambiar pagina */
  cambiarPagina(valor: number) {
    this.desde += valor;
    if (this.desde < 0) {
      this.desde = 0
    } else if (this.desde >= this.totalUsuarios) {
      this.desde -= valor;
    }
    this.cargarUsuarios()
  }

  buscar( termino: string ): any {

    if ( termino.length === 0 ) {
      return this.usuarios = this.usuariosTemp;
    }

    this.busquedasService.buscar( 'usuarios', termino )
        .subscribe( (resp: any) => {
          this.usuarios = resp;
        });
  }

  eliminarUsuario( usuario: Usuario ): any{

    /** validar para no borrar asi mismo */
    if ( usuario.uid === this.usuarioService.uid ) {
      return  Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'No puede borrarse a si mismo!'
      })
    }

    Swal.fire({
      title: 'Borrar usuario?',
      text: `Estas apunto de borrar a ${ usuario.nombre }!`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#FF311E',
      confirmButtonText: 'Si, borrarlo!'
    }).then((result) => {
      if ( result.value ) {
        this.usuarioService.eleminarUsuarios( usuario )
          .subscribe( resp => {
            this.cargarUsuarios();
            Swal.fire(
              'Usuario borrado!',
              `El usuario ${ usuario.nombre } ha sido eliminado.`,
              'success'
            )
          })
      }
    })
  }

  cambiarRole( usuario: Usuario ){    
    this.usuarioService.guardarUsuario( usuario )
        .subscribe( resp => {
          console.log( resp )
        })
  }

  abrirModal( usuario: Usuario){
    this.modalImagenService.abrirModal( 'usuarios', usuario.uid, usuario.img )
  }

}
