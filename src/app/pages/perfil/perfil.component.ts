import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FileUploadService } from 'src/app/services/file-upload.service';
import { UsuarioService } from 'src/app/services/usuario.service';

import { Usuario } from 'src/app/models/usuario.model';

import Swal from 'sweetalert2'

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  public perfilForm: FormGroup;
  public usuario: Usuario;
  public imagenSubir: File;
  public imgTemp: any  = null;
  
  constructor( private fb: FormBuilder, private usuarioService: UsuarioService, private fileUploadService: FileUploadService) {  
    this.usuario = usuarioService.usuario;
  }
  
  ngOnInit(): void {
    this.perfilForm  = this.fb.group({ 
      nombre: [ this.usuario.nombre  , Validators.required],
      email: [ this.usuario.email , [ Validators.required, Validators.email ] ],
    });
  }

  actualiarPerfil() {
    console.log( this.perfilForm.value );
    this.usuarioService.actualizarPerfil( this.perfilForm.value )
                      .subscribe( () => {
                        const { nombre, email } = this.perfilForm.value;
                        this.usuario.nombre = nombre;
                        this.usuario.email = email;
                        /** Si sucede un ok renderizo la respuesta con el sweetalert2 */
                        Swal.fire('Guardado', `Cambios fueron guardados...`, 'success')
                      }, (err) => {
                         /** Si sucede un error renderizo la respuesta con el sweetalert2 */
                         Swal.fire('Oops...', `${ err.error.msg }`, 'error')
                      });
  }
  
  cambiarImagen( file: File ): any {
          
      this.imagenSubir = file;
      
      /** si la imagen no existe, no hacer nada XD */
      if (!file) {
        return this.imgTemp = null;
      }
  
      const reader = new FileReader();
      reader.readAsDataURL(file);
  
      reader.onloadend = () => {
        this.imgTemp = reader.result;
      }
  }

  subirImagen(){
    this.fileUploadService.actualizarFoto( this.imagenSubir, 'usuarios', this.usuario.uid )
                          .then( img => {
                            this.usuario.img = img;
                            /** Si sucede un ok renderizo la respuesta con el sweetalert2 */
                            Swal.fire('¡Muy bien!', `Cambios de avatar exitosamente...`, 'success')
                          }).catch ( err => {
                            /** Si sucede un error renderizo la respuesta con el sweetalert2 */
                            Swal.fire('Oops...', `${ err.error.msg }`, 'error')
                          });
  }

}
