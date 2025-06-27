import { Component, OnInit } from '@angular/core';
//import { AppService } from '../../../services/app.service';
// import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmacionService } from '../../../services/confirmacion.service';
//Interfaces
import { Usuario} from '../../../interface/usuario/usuario.interface';
// import { inicioSesion } from '../../../interface/inicioSesion/inicioSesion.interface';


@Component({
  selector: 'app-protected',
  standalone: true,
  imports: [CommonModule,FormsModule ],
  templateUrl: './protected.component.html',
  styleUrl: './protected.component.scss'
})

export class ProtectedComponent implements OnInit {
  confirmacion:confirmacion={
    numEmpleado:'',
    nombreCompleto:'',
    correo:'',
    invitadoAsiste:'Seleccionar...',
    parejaAsiste:'Seleccionar...',
    nombrePareja:'',
    alergiaAlimentaria:'Seleccionar...',
    alergiaEsp:'',
    discapacidad:'Seleccionar...',
    discapacidadEsp:'',
    comentarios:'',

  };
  usuario=Usuario;
  private cargarDatosUsuario(): void {
  const usuario = this.usuario.getUsuarioActual();
  if (usuario) {
    this.confirmacion.numEmpleado = usuario.numEmpleado;
    this.confirmacion.nombreCompleto = usuario.nombreCompleto;
    this.confirmacion.correo = usuario.correo;
  }
}







  }

 
