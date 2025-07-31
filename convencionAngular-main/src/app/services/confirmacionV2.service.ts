import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Confirmacion } from "../interface/confirmacion/confirmacion.interface";
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { parse } from 'node:path';


@Injectable({
  providedIn: 'root'
})
export class ConfirmacionV2{
    private baseUrl = 'http://localhost:8080/api/v1/respuestasConvencionNacional';

    constructor (private http: HttpClient){}
    //25 jul: : Observable<string> se instalo para que acepte el string plano de mi back

    createConfirmacion(confirmacion: Confirmacion): Observable<string>{
        const headers = new HttpHeaders({'Content-Type':'application/json', 'Accept':'application/json'});

        const payload ={
            ...confirmacion,
            
           // fechaRegistro: confirmacion.fechaRegistro?.toISOString(),
            //Segun deepseek 14 jul
            fechaRegistro: confirmacion.fechaRegistro ? new Date(confirmacion.fechaRegistro) : new Date(),
            invitadoAsiste: confirmacion.invitadoAsiste ?? false,
            parejaAsiste: confirmacion.parejaAsiste ?? false,
            alergiaAlimentaria: confirmacion.alergiaAlimentaria ?? false,
            discapacidad: confirmacion.discapacidad ?? false,
            nombrePareja: confirmacion.parejaAsiste ? confirmacion.nombrePareja: 'N/A',
            alergiaEsp: confirmacion.alergiaEsp ? confirmacion.alergiaEsp: 'N/A',
            discapacidadEsp: confirmacion.discapacidadEsp ? confirmacion. discapacidadEsp: 'N/A'
        };
        console.log('Payload a enviado', payload);
        //25 jul: se instalo para que acepte el string plano de mi back

        // 30 jul: The URL should match the @RequestMapping of the controller + the @PostMapping value
        // return this.http.post<string>('http://localhost:8080/confirmacion', confirmacion,{
        //     headers: new HttpHeaders({'Content-Type':'application/json', 'Accept':'application/json'})

        // }
        return this.http.post<string>(`${this.baseUrl}/guardarRespuestasv2`, payload, {
            headers:headers,
            responseType: 'text' as 'json'
        })
        //25 jul: Si no funciona, Eliminar el return y colocar este codigo
            //`${this.baseUrl}/guardarRespuestasv2`,
            // JSON.stringify(payload),
            // {headers}
        .pipe(
            catchError((error:HttpErrorResponse)=>{
                
                console.error('Error en la peticion:', error);

                let errorMsj = 'Error al enviar los datos';
                if (error.error instanceof ErrorEvent){
                    errorMsj = ` Error: ${error.error.message}`;
                }else{
                    // 30 jul: The backend returned an unsuccessful response code.
                    console.error(
                        `Backend devolvió el código ${error.status},`+
                        `Cuerpo: ${error.error}`
                    );
                    //30 jul:  Attempt to parse the error.error if it's a string
                    if (typeof error.error === 'string'){
                        try{
                            const parsedError = JSON.parse(error.error);
                            if(parsedError && parsedError.message){
                                errorMsj=parsedError.message;
                            } else{// If it's a string but not a JSON with a 'message'
                                errorMsj= `Error del servidor: ${error.status}-${error.statusText || 'Mensaje desconocido'}`;
                            }
                        } catch(e){// If error.error is a string but not valid JSON
                            errorMsj=`Error de formato de respuesta del servidor: ${error.error}`;

                        }
                    } else if(error.error && error.error.message){
                        // If error.error is already an object with a message property
                        errorMsj=error.error.message;
                    } else{
                        // Fallback for other types of server errors
                        errorMsj = `Error del servidor: ${error.status}-${error.statusText || 'Mensaje desconocido' }`;
                    }



                    //codigo original
                    // errorMsj = `Error: $(error.status)-$(error.message)`;
                    // if (error.error && error.error.message){
                    //     errorMsj = error.error.message;
                    // }
                }
                return throwError(()=> new Error(errorMsj));
            })
        );


    }



}