import { Component, OnInit } from '@angular/core';
//import { AppService } from '../../../services/app.service';
// import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmacionService } from '../../../services/confirmacion.service';
//Interfaces
import { Usuario,respuestaUsuario } from '../../../interface/usuario/usuario.interface';
import { inicioSesion } from '../../../interface/inicioSesion/inicioSesion.interface';


@Component({
  selector: 'app-protected',
  standalone: true,
  imports: [CommonModule,FormsModule ],
  templateUrl: './protected.component.html',
  styleUrl: './protected.component.scss'
})

export class ProtectedComponent implements OnInit {
  parejaOpcion: string='Seleccionar...';
  alergiaOpcion:string='Seleccionar...';
  necesidadOpcion:string='Seleccionar...';
  respuestaUsuario: respuestaUsuario;


  enviado:boolean = false;

 
  constructor(private readonly usuariosService: ConfirmacionService) {}


  ngOnInit():void{
    this.cargarDatosUsuario();
  }
  private cargarDatosUsuario():void{
    let usuario = this.usuariosService.getUsuarioActual();

    if(usuario){
      this.confirmacion.numEmpleado=usuario.numEmpleado;
      this.confirmacion.nombreCompleto = usuario.nombreCompleto;
      this.confirmacion.correo = usuario.correo;
    }
  }
  onSubmit():void{
    if (this.confirmacion.invitadoAsiste === undefined){
      alert('Por favor, indique si asistirá al evento.');
      return;
    }
    this.confirmacion.enviarConfirmacion(this.u).subscribre({
      next: (response) => {
        console.log('Confirmación enviada con exito', response);
        this.enviado = true;
      },
      error: (error)=> {
        console.error('Error al enviar la confirmación', error);
        alert('Ocurrió un error al enviar la confirmación')
      }
    })




  }




 }
