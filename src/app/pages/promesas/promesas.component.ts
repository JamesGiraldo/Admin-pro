import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styleUrls: ['./promesas.component.css']
})
export class PromesasComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // const promesa = new Promise( (resolve, reject) => {
    //   if ( false ){
    //     resolve('Hola Mundo');
    //   }else{
    //     reject('Algo salio mal');
    //   }
    // });

    // promesa.then( (mensaje) =>{
    //   console.log(mensaje);      
    // })
    // .catch( error => console.log(`Error en mi promesa: ${error}`));

    // console.log('Fin del Init')    
    this.getusuarios().then( usuarios => {
      console.log(usuarios);
    });
  }
  getusuarios(){
    const promesa = new Promise( resolve => {
      
      fetch('https://reqres.in/api/users')
          .then( resp => resp.json() )
          .then( body => resolve( body.data ));

    })
    return promesa;
  }

}
