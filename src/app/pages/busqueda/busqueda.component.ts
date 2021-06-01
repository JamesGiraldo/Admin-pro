import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BusquedasService } from 'src/app/services/busquedas.service';

import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medico.model';
import { Usuario } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styleUrls: ['./busqueda.component.css']
})
export class BusquedaComponent implements OnInit {

  public usuarios: Usuario[] = [];
  public medicos: Medico[] = []
  public hospitales: Hospital[] = []

  constructor( private acrivateRoute: ActivatedRoute, private busquedaService: BusquedasService, private router: Router) { }

  ngOnInit(): void {
    this.acrivateRoute.params
        .subscribe( ({ termino }) => {         
          this.busquedaGlobal( termino )
        })
  }

  busquedaGlobal( termino: string){
    this.busquedaService.busquedaGlobal( termino )
        .subscribe( (resp: any) => {
          this.usuarios = resp.usuarios;
          this.medicos = resp.medicos;
          this.hospitales = resp.hospitales;
        })
  }

  irMedico( medico: Medico ){    
    this.router.navigateByUrl(`/dashboard/medico/${ medico.uid }`)
  }

}
