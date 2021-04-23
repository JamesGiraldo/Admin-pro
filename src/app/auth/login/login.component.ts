import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';

import Swal from 'sweetalert2'

declare const gapi:any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css' ]
})
export class LoginComponent implements OnInit {

    /** formulario posteado */
    public formSubmitted = false;
    /** propiedad corespondiente a google que contiene todo el estado de la autentificación */
    public auth2: any;

    /** propiedad publica formulario de registro */
    public loginForm: any = this.fb.group({
      email: [ localStorage.getItem('email') || '', [ Validators.required, Validators.email ] ],
      password: ['', Validators.required],
      remember: [false]
    });

  constructor( private router: Router, private fb: FormBuilder, private usuarioService: UsuarioService, private ngZone: NgZone ) { }

  ngOnInit(): void {
      this.renderButton();
  }

  login() {
    this.usuarioService.login( this.loginForm.value )
                      .subscribe( resp => {
                        if ( this.loginForm.get('remember').value ) {
                          localStorage.setItem('email', this.loginForm.get('email').value );
                        } else {
                          localStorage.removeItem('email');
                        }
                        /** Mover al dasboadh */
                        this.router.navigateByUrl('/');
                      }, ( err ) => {
                        /** Si sucede un error renderizo la respuesta con el sweetalert2 */
                        Swal.fire('Oops...', `${ err.error.msg }`, 'error')
                      });
    // this.router.navigateByUrl('/');
  }

  renderButton() {
    gapi.signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark',
    });
    this.startApp();      
  }

  async startApp() {
    await this.usuarioService.googleinit();
    this.auth2 = this.usuarioService.auth2;
    this.attachSignin(document.getElementById('my-signin2'));
  }

  attachSignin(element: any) {
    this.auth2.attachClickHandler(element, {},
        (googleUser: any) => {
          const id_token = googleUser.getAuthResponse().id_token;
          this.usuarioService.loginGoogle( id_token )
              .subscribe( resp => {
                  /** Mover al dasboadh */
                  this.ngZone.run( () =>{
                    this.router.navigateByUrl('/');
                  })
                }
              );
        }, (error: any) => {
          alert(JSON.stringify(error, undefined, 2));
        });
  }

}
