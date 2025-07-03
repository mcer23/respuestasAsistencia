import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmacionService } from '../../../services/confirmacion.service';
import { Confirmacion } from '../../../interface/confirmacion/confirmacion.interface';
import { confirmacionV2 } from '../../../services/confirmacionV2.service'; //prueba 2 jul
import { AditionalUserData } from '../../../app.interfaces';

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
    numEmpleado: 'TEST num',
    nombreCompleto: 'TEST name',
    correo: 'test@coppel.com',
    invitadoAsiste: null,
    parejaAsiste: null,
    nombrePareja: '',
    alergiaAlimentaria: null,
    alergiaEsp: '',
    discapacidad: null,
    discapacidadEsp: '',
    comentarios: ''
  };

  public accountData = signal<AditionalUserData | null>(null);
  // constructor(private confirmacionService: ConfirmacionService) {}
  constructor(
    private ConfirmacionV2: confirmacionV2 
  ){}

  ngOnInit(): void {}

  enviarFormularioV2(){
    this.ConfirmacionV2.createConfirmacion(this.confirmacion).subscribe({
      next:(res) => {
        console.log('V2 exitoso',res);
        alert('V2 exitoso' + res.toLocaleString());
      },
      error: (err) => console.error('V2 error:',err)
    });
    
  }

  /*enviarFormulario(): void {
    //2 jul
    const payload ={
      ...this.confirmacion,
      invitadoAsiste:this.confirmacion.invitadoAsiste ?? false,
      parejaAsiste:this.confirmacion.parejaAsiste ?? false,
      alergiaAlimentaria:this.confirmacion.alergiaAlimentaria ?? false,
      discapacidad:this.confirmacion.discapacidad ?? false,

    };
    this.confirmacionService.createConfirmacion(payload).subscribe({
      next: (respuesta) => {
        alert('Respuestas guardadas correctamente!');
        console.log('Response',respuesta);
      },
      error: (error)=>{
        console.error('Error:',error);
        alert(`Error:${error.status}-${error.message}`);
      }
    });


    //prueba 1 jul
    /*if (!this.confirmacion.invitadoAsiste) {
    this.confirmacion.parejaAsiste = false;
    this.confirmacion.nombrePareja = 'N/A';
  }

  console.log('Enviando informacion:', this.confirmacion);


    // Validaciones básicas antes de enviar
    if (this.confirmacion.parejaAsiste === false) {
      this.confirmacion.nombrePareja = 'N/A';}
    
    if (this.confirmacion.alergiaAlimentaria === false) {
      this.confirmacion.alergiaEsp = 'N/A';}
    
    if (this.confirmacion.discapacidad === false) {
      this.confirmacion.discapacidadEsp = 'N/A';}*/
      //original
    /*this.confirmacionService.createConfirmacion(this.confirmacion).subscribe({
      next: (respuesta) => {
        alert('¡Respuestas enviadas correctamente!');
        console.log('Respuesta del servidor:', respuesta);
      },
      error: (error) => {
        console.error('Error al enviar:', error);
        alert('Ocurrio un error al enviar la información.'+error);
        
      }
    });

    //prueba 1 jul

    this.confirmacionService.createConfirmacion(this.confirmacion).subscribe({
    next: (respuesta) => {
      alert('¡Respuestas enviadas correctamente!');
      console.log('Full response:', respuesta); // Detailed logging
      // Reset form after successful submission if needed
    },
    error: (error) => {
      alert('Error: ' + (error.error?.message || error.message));
      console.error('Error details:', error);
    }
  });
  }*/
}

