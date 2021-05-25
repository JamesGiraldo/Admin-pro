import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Hospital } from 'src/app/models/hospital.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { HospitalService } from 'src/app/services/hospital.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styleUrls: ['./hospitales.component.css']
})
export class HospitalesComponent implements OnInit, OnDestroy {

  public page: number = 1;
  public hospitales: Hospital[] = [];
  public hospitalesTemp: Hospital[] = [];

  public cargando: boolean = true;
  private imgSubs: Subscription;

  constructor( private hospitalService: HospitalService,
               private busquedasService: BusquedasService,  
               private modalImagenService: ModalImagenService ) { }
  
  
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarHospital()
    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe( delay(100) )
      .subscribe( (img) => this.cargarHospital() );
  }

  cargarHospital() {
    this.cargando = true;
    this.hospitalService.cargarHospitales()
      .subscribe(hospitales => {
        this.cargando = false;
        this.hospitales = hospitales;
        this.hospitalesTemp = hospitales;
      })
  }

  buscar( termino: string ) {

    if ( termino.length === 0 ) {
      return this.cargarHospital();
    }

    this.busquedasService.buscar( 'hospitales', termino )
        .subscribe( resp  => {
          this.hospitales = resp;
        });
  }

  guardarHospital(hospital: Hospital) {
    this.hospitalService.actualizarHospital( hospital.nombre, hospital.uid)
      .subscribe(resp => {
        Swal.fire('Actualizado', hospital.nombre, 'success');
      });
  }

  eliminarHospital( hospital: Hospital ){
    Swal.fire({
      title: '¿Borrar hospital?',
      text: `Estas apunto de borrar a "${ hospital.nombre }"`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#FF311E',
      confirmButtonText: 'Si, borrar!'
    }).then((result) => {
      if ( result.value ) {
        this.hospitalService.borrarHospital( hospital.uid )
          .subscribe( resp => {
            this.cargarHospital();
            Swal.fire(
              'Hospital borrado!',
              `El hospital ${ hospital.nombre } ha sido eliminado.`,
              'success'
            )
          })
      }
    })
  }

  async abrirSweetAlert() {
    const { value = '' } = await Swal.fire<string>({
      title: 'Crear hospital',
      text: 'Ingrese el nombre del nuevo hospital',
      input: 'text',
      confirmButtonColor: '#28a745',
      inputPlaceholder: 'Nombre del hospital',
      confirmButtonText: 'Registrar',
      showCancelButton: true
    });

    if (value.trim().length > 0) {
      this.hospitalService.crearHospital(value)
        .subscribe((resp: any) => {
          this.hospitales.push(resp.hospital)
        })
    }
  }

  abrirModal(hospital: Hospital) {

    this.modalImagenService.abrirModal('hospitales', hospital.uid, hospital.img);

  }

}
