import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: [ './register.component.css' ]
})
export class RegisterComponent {

  /** formulario posteado */
  public formSubmitted = false;

  /** propiedad publica formulario de registro */
  public registerForm: any = this.fb.group({
    nombre: ['', Validators.required],
    email: ['', [ Validators.required, Validators.email ] ],
    password: ['', Validators.required],
    password2: ['', Validators.required],
    terminos: [ false , Validators.required]
  }, {
    validators: this.passwordsIguales('password', 'password2')
  });

  constructor( private fb: FormBuilder, private router: Router, private usuarioService: UsuarioService) { }


  crearUsuario(){
    this.formSubmitted = true; 
    // console.log(this.registerForm.value);
    /** Validar el posteo de la acción del formulario */
    if ( this.registerForm.invalid ){
      return;
    }

    /** Realizar el posteo o la creación  */
    this.usuarioService.crearUsuario(this.registerForm.value)
                        .subscribe( resp => {
                            /** Mover al dasboadh */
                            this.router.navigateByUrl('/')
                        }, ( err ) => {
                          /** Si sucede un error renderizo la respuesta con el sweetalert2 */
                          Swal.fire('Oops...', `${ err.error.msg }`, 'error')
                        });

  }

  /** validar campo  */
  campoNoValido( campo: string ): boolean{
    if ( this.registerForm.get(campo).invalid && this.formSubmitted ){
      return true;
    } else {
      return false;
    }
  };

  /** Validar Contraseñas */
  contrasenasNoValidas() {
    const pass1 = this.registerForm.get('password').value
    const pass2 = this.registerForm.get('password2').value
    if ( (pass1 !== pass2) && this.formSubmitted ){
      return true;
    } else {
      return false;
    }
  };

  /** Validar los terminos de uso */
  aceptaterminos(){
    return !this.registerForm.get('terminos').value && this.formSubmitted
  }

  /** Validar que sean iguales las Contraseñas */
  passwordsIguales(pass1Name: string , pass2Name: string){
    return ( formGroup: FormGroup ) => {
      const pass1Control: any = formGroup.get(pass1Name);
      const pass2Control: any = formGroup.get(pass2Name);

      if (pass1Control.value === pass2Control.value) {
        pass2Control.setErrors(null)
      } else {
        pass2Control.setErrors({ noEsIgual: true })
      }
    }
  }

}
