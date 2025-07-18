import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmacionService } from '../../../services/confirmacion.service';
import { Confirmacion } from '../../../interface/confirmacion/confirmacion.interface';
import { ConfirmacionV2} from '../../../services/confirmacionV2.service'; //prueba 2 jul
import { AditionalUserData } from '../../../app.interfaces';
import { AppService } from '../../../../app/services/app.service';

@Component({
  selector: 'app-protected',
  standalone: true,
  imports: [CommonModule,FormsModule ],
  templateUrl: './protected.component.html',
  styleUrl: './protected.component.scss'
})

export class protectedComponent implements OnInit {
  confirmacionModel: Confirmacion = {
    fechaRegistro: new Date().toISOString(),
    numEmpleado: '',
    nombreCompleto: '',
    correo: '',
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
    private ConfirmacionV2Service: ConfirmacionV2,
    private appService: AppService,

  ){}

  ngOnInit(): void {}

  

  enviarFormularioV2(){
    //Se guarda en la var declarada = se manda llamar lo que necesito de graph.service
    //numEmpleado: 'TEST num', nombreCompleto: 'TEST name',

    //Preparar datos
    const datos= this.appService.accountData();

    //Fecha actual (sin UTC)
    const now = new Date();
    const fechaLocalISO = new Date(now.getTime()-(now.getTimezoneOffset()*6000)).toISOString();
    
    // this.confirmacion.correo = this.appService.accountData()?.mail; 
    // this.confirmacion.numEmpleado = this.appService.accountData()?.employeeId; 
    this.confirmacionModel ={
      ...this.confirmacionModel,
      correo: datos?.mail || '',
      numEmpleado: datos?.employeeId || '',
      nombreCompleto: `${datos?.givenName || ''} ${datos?.surname || ''}`.trim(),
     fechaRegistro:fechaLocalISO,
    }
    //Enviar datos
    this.ConfirmacionV2Service.createConfirmacion(this.confirmacionModel).subscribe({
      next:(res) => {
        console.log('Envio de respuesta exitoso',res);
        alert('Envio de respuesta exitoso' + res.toLocaleString());
      },
      error: (err) => console.error('error en el envio de respuesta:',err)
    });

    /*this.confirmacionModel.fechaRegistro = new Date();
    this.confirmacionModel.correo = datos?.mail || '';
    this.confirmacionModel.numEmpleado = datos?.employeeId || '';
    this.confirmacionModel.nombreCompleto = `${this.appService.accountData()?.givenName || ''} ${this.appService.accountData()?.surname || ''}`.trim();/*
    
    
    
    
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
}
