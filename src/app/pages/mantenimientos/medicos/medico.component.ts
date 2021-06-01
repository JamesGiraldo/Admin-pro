import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import Swal from 'sweetalert2';

import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medico.model';

import { HospitalService } from 'src/app/services/hospital.service';
import { MedicoService } from 'src/app/services/medico.service';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styleUrls: ['./medico.component.css']
})
export class MedicoComponent implements OnInit {

  public  medicoFrom: FormGroup;
  public hospitales: Hospital[] = [];

  public medicoSeleccionado: Medico;
  public hospitalSeleccionado:  Hospital | any;

  constructor( private fb: FormBuilder,
               private hospitalService: HospitalService,
               private medicoService: MedicoService,
               private router: Router, 
               private ActivatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

    this.ActivatedRoute.params
        .subscribe( ({ id  }) => this.cargarMedico( id ))

    this.medicoFrom = this.fb.group({
      nombre: ['', Validators.required ],
      hospital: ['', Validators.required ]
    })
    this.cargarHospitales();
    this.medicoFrom.get('hospital')?.valueChanges
        .subscribe( hospitalId => {
          this.hospitalSeleccionado = this.hospitales.find( h => h.uid === hospitalId );          
        })
  }

  cargarMedico( id: string ){

    /** valir si la url es nuevo */
    if ( id === 'nuevo') { return; }

    this.medicoService.obtenerMedicoPorId( id )
        .pipe(
          delay(100)
        )
        .subscribe( medico => {         
          const { nombre, hospital:{ _id } } = medico
          this.medicoSeleccionado = medico;
          this.medicoFrom.setValue({ nombre, hospital: _id });
        }, error => {
          return this.router.navigateByUrl(`/dashboard/medicos`);
        })
        
  }

  cargarHospitales(){
    this.hospitalService.cargarHospitales()
        .subscribe( (hospitales: Hospital[]) =>{         
          this.hospitales = hospitales;
        })
  }

  guardarMedico(){

    const { nombre  } = ( this.medicoFrom.value )

    if (this.medicoSeleccionado) {
      /** Actualizar medico */
      const data = {
        ...this.medicoFrom.value,
        uid: this.medicoSeleccionado.uid
      }
      this.medicoService.actualizarMedico( data )
          .subscribe( resp => {
            Swal.fire(
              'Medico actualizado.',
              `${ nombre } ha sido actualizado correctamente.`,
              'success'
            );
          })

    } else {
      /** Crear medico */
      this.medicoService.crearMedico( this.medicoFrom.value )
          .subscribe( (resp: any | Medico) => {
            Swal.fire(
              'Medico creado.',
              `El medico ${ nombre } ha sido creado.`,
              'success'
            );
            this.router.navigateByUrl(`/dashboard/medico/${ resp.medico.uid }`)
          })      
    }
  }
}
