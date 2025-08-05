import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmacionService } from '../../../services/confirmacion.service';
import { Confirmacion } from '../../../interface/confirmacion/confirmacion.interface';
import { ConfirmacionV2} from '../../../services/confirmacionV2.service'; //prueba 2 jul
import { AditionalUserData } from '../../../app.interfaces';
import { AppService } from '../../../../app/services/app.service';
import { MessageModule } from 'primeng/message';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';



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
    
    this.confirmacionModel ={
      ...this.confirmacionModel,
      correo: datos?.mail || '',
      numEmpleado: datos?.employeeId || '',
      nombreCompleto: `${datos?.givenName || ''} ${datos?.surname || ''}`.trim(),
     fechaRegistro:fechaLocalISO,
    }
    //Enviar datos
    this.ConfirmacionV2Service.createConfirmacion(this.confirmacionModel).subscribe({
      
      // Mensaje en caso de errores, modificado el agregado el 23 de jul.
        next:(res: String) => {
        console.log ('Respuesta del servidor:', res);

        if (res.includes('Numero de empleado duplicado')){
          alert ('Número de empleado ya fue registrado anteriormente. Comuníquese con el equipo de convenciones.');
        } else if(res.includes('Error')){
          alert('Ocurrió un error al guardar la información. Comuníquese con el equipo de convenciones.')
        } else{
          alert('Respuestas registradas correctamente.');
        }
        
      },
      error: (error)=>{
        console.error('Error:',error);
        alert(`Error 500: Usuario registrado anteriormente, comuniquese con el área de convenciones.`);
      }
      

    });  
      
    
    console.log('Modelo completo antes de enviar:', this.confirmacionModel);

}

}
