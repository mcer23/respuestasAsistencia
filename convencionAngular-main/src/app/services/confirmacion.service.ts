import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
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
    private baseUrl = 'http://localhost:8080/api/confirmaciones'; // Cambia esto por la URL de tu API

    constructor(private http: HttpClient) {}
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

    createConfirmacion(confirmacion: Confirmacion): Observable<Confirmacion> {
        return this.http.post<Confirmacion>(this.baseUrl, confirmacion);
    }
}