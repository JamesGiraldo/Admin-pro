import { Component, OnInit } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styleUrls: ['./modal-imagen.component.css']
})
export class ModalImagenComponent implements OnInit {

  public imagenSubir: File;
  public imgTemp:any | ArrayBuffer = null;

  constructor(public modalImagenService: ModalImagenService, public fileUploadService: FileUploadService) { }

  ngOnInit(): void {
  }

  cerraModal() {
    this.imgTemp = null;
    this.modalImagenService.cerraModal()
  }

  cambiarImagen(file: File): any {

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

  subirImagen() {

    const id = this.modalImagenService.id;
    const tipo = this.modalImagenService.tipo;

    this.fileUploadService.actualizarFoto(this.imagenSubir, tipo , id)
      .then(img => {
        /** Si sucede un ok renderizo la respuesta con el sweetalert2 */
        Swal.fire('¡Muy bien!', `Cambios de avatar exitosamente...`, 'success');
        this.modalImagenService.nuevaImagen.emit( img )
        this.cerraModal()
      }).catch(err => {
        /** Si sucede un error renderizo la respuesta con el sweetalert2 */
        Swal.fire('Oops...', `${err.error.msg}`, 'error')
      });
  }

}
