import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Confirmacion } from "../interface/confirmacion/confirmacion.interface";
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ConfirmacionV2{
    private baseUrl = 'http://localhost:8080/api/v1/respuestasConvencionNacional';

    constructor (private http: HttpClient){}

    createConfirmacion(confirmacion: Confirmacion){
        const headers = new HttpHeaders({'Content-Type':'application/json', 'Accept':'application/json'});

        const payload ={
            ...confirmacion,
            
           // fechaRegistro: confirmacion.fechaRegistro?.toISOString(),
            //Segun deepseek 14 jul
            invitadoAsiste: confirmacion.invitadoAsiste ?? false,
            parejaAsiste: confirmacion.parejaAsiste ?? false,
            alergiaAlimentaria: confirmacion.alergiaAlimentaria ?? false,
            discapacidad: confirmacion.discapacidad ?? false,
            nombrePareja: confirmacion.parejaAsiste ? confirmacion.nombrePareja: 'N/A',
            alergiaEsp: confirmacion.alergiaEsp ? confirmacion.alergiaEsp: 'N/A',
            discapacidadEsp: confirmacion.discapacidadEsp ? confirmacion. discapacidadEsp: 'N/A'
        };
        alert('Payload a enviado');
        console.log('Payload a enviado', payload);

        return this.http.post(
            `${this.baseUrl}/guardarRespuestasv2`,
            JSON.stringify(payload),
            {headers}
        ).pipe(
            catchError((error:HttpErrorResponse)=>{
                
                console.error('Error en la peticion:', error);

                let errorMsj = 'Error al enviar los datos';
                if (error.error instanceof ErrorEvent){
                    errorMsj = ' Error: $(error.error.message)';
                }else{
                    errorMsj = `Error: $(error.status)-$(error.messege)`;
                    if (error.error && error.error.message){
                        errorMsj = error.error.message;
                    }
                }
                return throwError(()=> new Error(errorMsj));
            })
        );


    }



}