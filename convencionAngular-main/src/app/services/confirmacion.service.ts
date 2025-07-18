import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpResponse, HttpHeaders } from "@angular/common/http";
import {  catchError, Observable, throwError } from "rxjs";
import { map } from 'rxjs/operators';
import { Confirmacion } from "../interface/confirmacion/confirmacion.interface";

// se omite ya que hay un archivo interface, que cumple con lo que esta aqui.

/* export interface Confirmacion {
    fechaRegistro: Date;
    numEmpleado: string;
    nombreCompleto: string;
    correo: string;
    invitadoAsiste: boolean;
    parejaAsiste: boolean;
    nombrePareja: string;
    alergiaAlimentaria: boolean;
    alergiaEsp: string;
    discapacidad: boolean;
    discapacidadEsp: string;
    comentarios: string;
 }*/
@Injectable({
    providedIn: "root"
})
export class ConfirmacionService {
    private baseUrl = 'http://127.0.0.1:8080/api/v1/respuestasConvencionNacional'; // Cambia esto por la URL de tu API

    constructor(private http: HttpClient) {}
    
    /*createConfirmacion(confirmacion: Confirmacion): Observable<Confirmacion> {
  return this.http.post<Confirmacion>(`${this.baseUrl}/guardarRespuestas`, confirmacion)
  //agregado 1 jul
    .pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error in createConfirmacion:', error);
        return throwError(() => error);
      })
    );
}
// prueba 1jul
    createConfirmacion(confirmacion: Confirmacion): Observable<Confirmacion> {
  console.log('Sending to:', `${this.baseUrl}/guardarRespuestas`);
  return this.http.post<Confirmacion>(
    `${this.baseUrl}/guardarRespuestas`, 
    confirmacion,
    { observe: 'response' }
  ).pipe(
    map((response: HttpResponse<any>) => {
      console.log('Full HTTP response:', response);
      return response.body as Confirmacion;
    }),
    catchError((error: HttpErrorResponse) => {
      console.error('Detailed error:', error);
      return throwError(() => error);
    })
  );
}*/
    // 11 jul
    createConfirmacion(confirmacion: Confirmacion){
        const headers = new HttpHeaders({
            'Content-type':'applicacion/json'
        });
        return this.http.post(`${this.baseUrl}/guardarRespuestas`,confirmacion, {headers});
    }


//sigue igual
    getInicioSesion(): Observable<Confirmacion> {
        return this.http.get<Confirmacion>(`${this.baseUrl}/inicio-sesion`);
    }
    postUsuario(usuario: Confirmacion): Observable<Confirmacion> {
        return this.http.post<Confirmacion>(`${this.baseUrl}/usuario`, usuario);
    }
    getUsuarioActual(): Observable<Confirmacion> {
        return this.http.get<Confirmacion>(`${this.baseUrl}/usuario/actual`);
    }
    
    getConfirmaciones(): Observable<Confirmacion[]> {
        return this.http.get<Confirmacion[]>(this.baseUrl);
    }

    getConfirmacion(numEmpleado: string): Observable<Confirmacion> {
        return this.http.get<Confirmacion>(`${this.baseUrl}/${numEmpleado}`);
    }

}