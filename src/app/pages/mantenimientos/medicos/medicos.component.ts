import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';

import Swal from 'sweetalert2';

import { MedicoService } from '../../../services/medico.service';
import { BusquedasService } from '../../../services/busquedas.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';

import { Medico } from '../../../models/medico.model';


@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styleUrls: ['./medicos.component.css']
})
export class MedicosComponent implements OnInit, OnDestroy{

  public page: number = 1;
  public medicos: Medico[] = [];
  public medicosTemp: Medico[] = [];

  public cargando: boolean = true;
  private imgSubs: Subscription;

  constructor(private medicoService: MedicoService, private busquedasService: BusquedasService, private modalImagenService: ModalImagenService) { }
  
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarMedicos();
    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe( delay(100) )
      .subscribe( (img) => this.cargarMedicos() );
  }

  cargarMedicos() {
    this.cargando = true;
    this.medicoService.cargarMedicos()
      .subscribe(medicos => {
        this.cargando = false;
        this.medicos = medicos;
        this.medicosTemp = medicos;
      })
  }

  buscar(termino: string) {

    if (termino.length === 0) {
      return this.cargarMedicos();
    }

    this.busquedasService.buscar('medicos', termino)
      .subscribe(resp => {
        this.medicos = resp;
      });
  }

  eliminarMedico( medico: Medico ){
    Swal.fire({
      title: '¿Borrar hospital?',
      text: `Estas apunto de borrar a "${ medico.nombre }"`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#FF311E',
      confirmButtonText: 'Si, borrar!'
    }).then((result) => {
      if ( result.value ) {
        this.medicoService.borrarMedico( medico.uid )
          .subscribe( resp => {
            this.cargarMedicos();
            Swal.fire(
              'Medico borrado!',
              `El medico ${ medico.nombre } ha sido eliminado.`,
              'success'
            );
          })
      }
    })
  }

  abrirModal(medico: Medico) {

    this.modalImagenService.abrirModal( 'medicos', medico.uid, medico.img);

  }

}
