import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  constructor(
   private ConfirmacionV2Service: ConfirmacionV2,
   private appService: AppService,){}


 ngOnInit(): void {}


 enviarFormularioV2(){


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
    fechaRegistro:fechaLocalISO,}
   
   //Enviar datos
   this.ConfirmacionV2Service.createConfirmacion(this.confirmacionModel).subscribe({
    
     // Mensaje en caso de errores, modificado el agregado el 23 de jul.
       next:(res: string) => {
       console.log ('Respuesta del servidor:', res);
        
      try{
        if(!res || res.trim()===''){
          alert('Tu respuesta ha sido registrada');
        }
        const responseObj=JSON.parse(res);

        if(responseObj.message.includes('Ya existe una respuesta con la misma clave')){
          alert('Número de empleado ya fue registrado anteriormente. Comuníquese con el equipo de convenciones.');
        } else if(responseObj.status === 'success' || responseObj.message.includes('registrada')){
          alert('Tu respuesta ha sido registrada');
        } else{
          alert('Ocurrió un error al guardar la información. Comuníquese con el equipo de convenciones.')
        }
      } //cierre try
      catch(e){
        console.error('Error con el servidor',e);
          alert('Ocurrió un error al guardar la información. Comuníquese con el equipo de convenciones.');
        
      }
      
     }, //cierre next:
     error: (error)=>{
       console.error('Error:', error);
      
      let errorMessage='Ocurrió un error inesperado al enviar la información';

       try{
          const errorObj = JSON.parse(error.error);
          errorMessage=errorObj.message;
       } catch{
          errorMessage=`Error 500: Usuario registrado anteriormente, comuniquese con el área de convenciones.`;
       }
       alert(errorMessage);
     }// cierre error:
    


   }); //cierre this.ConfirmacionV2Service
    
  
   console.log('Modelo completo antes de enviar:', this.confirmacionModel);


}


} //cierre export
