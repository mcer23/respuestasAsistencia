import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmacionService } from '../../../services/confirmacion.service';
import { Confirmacion } from '../../../interface/confirmacion/confirmacion.interface';


@Component({
  selector: 'app-protected',
  standalone: true,
  imports: [CommonModule,FormsModule ],
  templateUrl: './protected.component.html',
  styleUrl: './protected.component.scss'
})

export class protectedComponent implements OnInit {
  confirmacion: Confirmacion = {
    fechaRegistro: new Date(),
    numEmpleado: '98585991',
    nombreCompleto: 'MELISSA CECILIA ESTRADA RAMOS',
    correo: 'melissa.estrada@coppel.com',
    invitadoAsiste: undefined,
    parejaAsiste: undefined,
    nombrePareja: '',
    alergiaAlimentaria: undefined,
    alergiaEsp: '',
    discapacidad: undefined,
    discapacidadEsp: '',
    comentarios: ''
  };

  constructor(private confirmacionService: ConfirmacionService) {}

  ngOnInit(): void {}

  enviarFormulario(): void {
    // Validaciones básicas antes de enviar
    if (this.confirmacion.parejaAsiste === false) {
      this.confirmacion.nombrePareja = 'N/A';}
    
    if (this.confirmacion.alergiaAlimentaria === false) {
      this.confirmacion.alergiaEsp = 'N/A';}
    
    if (this.confirmacion.discapacidad === false) {
      this.confirmacion.discapacidadEsp = 'N/A';}
    

    this.confirmacionService.createConfirmacion(this.confirmacion).subscribe({
      next: (respuesta) => {
        alert('¡Respuestas enviadas correctamente!');
        console.log('Respuesta del servidor:', respuesta);
      },
      error: (error) => {
        console.error('Error al enviar:', error);
        alert('Ocurrio un error al enviar la información.');
        
      }
    });
  }
}

 
